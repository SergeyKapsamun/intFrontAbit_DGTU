import axios from "axios";
import { configureAuthSession } from "@/shared/api/authSession";
import { getApiOrigin } from "@/shared/config/runtime";

const ACCESS_TOKEN_KEY = "authToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const EXTERNAL_ENTRY_URL_KEY = "externalEntryUrl";
const LEGACY_TOKEN_KEY = "abitAuthToken";
const URL_TOKEN_KEY = "token";
const AUTH_API_ROOT = getApiOrigin();
const APP_API_ROOT = getApiOrigin();
const CLAIM_NAME = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name";
const CLAIM_SURNAME =
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname";
const CLAIM_SID = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/sid";
const CLAIM_HASH = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/hash";
const CLAIM_USERDATA =
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/userdata";
const RESERVED_CLAIMS = new Set([
  CLAIM_NAME,
  CLAIM_SURNAME,
  CLAIM_HASH,
  CLAIM_SID,
  CLAIM_USERDATA,
  "verifString",
  "type",
  "nbf",
  "exp",
  "iss",
  "aud",
  "iat",
  "jti",
]);
let refreshRequestPromise: Promise<string | null> | null = null;

function getStorageValue(key) {
  try {
    return window.localStorage.getItem(key) || "";
  } catch {
    return "";
  }
}

function setStorageValue(key, value) {
  try {
    if (value) {
      window.localStorage.setItem(key, value);
    } else {
      window.localStorage.removeItem(key);
    }
  } catch {}
}

function getToken() {
  return (
    getStorageValue(ACCESS_TOKEN_KEY) || getStorageValue(LEGACY_TOKEN_KEY) || ""
  );
}

function setToken(token) {
  setStorageValue(ACCESS_TOKEN_KEY, token || "");
}

function getRefreshToken() {
  return getStorageValue(REFRESH_TOKEN_KEY) || "";
}

function setRefreshToken(token) {
  setStorageValue(REFRESH_TOKEN_KEY, token || "");
}

function clearToken() {
  setToken("");
}

function clearRefreshToken() {
  setRefreshToken("");
}

function getExternalEntryUrl() {
  return getStorageValue(EXTERNAL_ENTRY_URL_KEY) || "";
}

function setExternalEntryUrl(url) {
  setStorageValue(EXTERNAL_ENTRY_URL_KEY, url || "");
}

function clearExternalEntryUrl() {
  setExternalEntryUrl("");
}

function setSession(payload) {
  setToken(payload?.accessToken || "");
  setRefreshToken(payload?.refreshToken || "");
  const externalEntryUrl =
    normalizeExternalEntryUrl(payload?.externalEntryUrl || "") ||
    extractExternalEntryUrlFromToken(payload?.sourceToken || "") ||
    getExternalEntryUrl() ||
    extractExternalEntryUrlFromToken(payload?.accessToken || "");
  setExternalEntryUrl(externalEntryUrl);
}

function clearSession() {
  clearToken();
  clearRefreshToken();
  clearExternalEntryUrl();
  setStorageValue(LEGACY_TOKEN_KEY, "");
}

function getUrlToken() {
  if (typeof window === "undefined") return "";

  const searchToken = new URLSearchParams(window.location.search)
    .get(URL_TOKEN_KEY)
    ?.trim();
  if (searchToken) {
    return searchToken;
  }

  const rawHash = window.location.hash.startsWith("#")
    ? window.location.hash.slice(1)
    : window.location.hash;
  const queryIndex = rawHash.indexOf("?");

  if (queryIndex === -1) {
    return "";
  }

  return (
    new URLSearchParams(rawHash.slice(queryIndex + 1))
      .get(URL_TOKEN_KEY)
      ?.trim() || ""
  );
}

function getLogoutEntryUrl() {
  return extractExternalEntryUrlFromToken(getToken()) || getExternalEntryUrl();
}

function normalizePathname(pathname) {
  const trimmedPath = pathname.replace(/\/+$/, "") || "/";

  if (trimmedPath === "/login") {
    return "/";
  }

  if (trimmedPath.endsWith("/login")) {
    return trimmedPath.slice(0, -"/login".length) || "/";
  }

  return pathname || "/";
}

function clearUrlToken() {
  if (typeof window === "undefined") return;

  try {
    const currentUrl = new URL(window.location.href);
    currentUrl.pathname = normalizePathname(currentUrl.pathname);
    currentUrl.searchParams.delete(URL_TOKEN_KEY);

    const rawHash = currentUrl.hash.startsWith("#")
      ? currentUrl.hash.slice(1)
      : currentUrl.hash;

    if (rawHash) {
      const queryIndex = rawHash.indexOf("?");

      if (queryIndex !== -1) {
        const hashPath = rawHash.slice(0, queryIndex);
        const hashParams = new URLSearchParams(rawHash.slice(queryIndex + 1));
        hashParams.delete(URL_TOKEN_KEY);
        const nextHashQuery = hashParams.toString();
        currentUrl.hash = nextHashQuery
          ? `#${hashPath}?${nextHashQuery}`
          : hashPath;
      }
    }

    window.history.replaceState({}, "", currentUrl.toString());
  } catch {}
}

function normalizeExternalEntryUrl(rawValue) {
  const value = typeof rawValue === "string" ? rawValue.trim() : "";
  if (!value) {
    return "";
  }

  if (/^https:\/\//i.test(value)) {
    return value;
  }

  if (/^http:\/\//i.test(value)) {
    return value.replace(/^http:\/\//i, "https://");
  }

  if (value.startsWith("//")) {
    return `https:${value}`;
  }

  return `https://${value.replace(/^\/+/, "")}`;
}

function decodeBase64UrlSegment(segment) {
  if (!segment || typeof window === "undefined") {
    return "";
  }

  try {
    const normalized = segment.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(
      normalized.length + ((4 - (normalized.length % 4)) % 4),
      "=",
    );
    const binary = window.atob(padded);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));

    if (typeof TextDecoder !== "undefined") {
      return new TextDecoder().decode(bytes);
    }

    return binary;
  } catch {
    return "";
  }
}

function decodeJwtPayload(token) {
  const payloadSegment =
    typeof token === "string" ? token.split(".")[1] || "" : "";
  if (!payloadSegment) {
    return null;
  }

  try {
    const payload = decodeBase64UrlSegment(payloadSegment);
    return payload ? JSON.parse(payload) : null;
  } catch {
    return null;
  }
}

function extractExternalEntryUrlFromToken(token) {
  const payload = decodeJwtPayload(token);
  return normalizeExternalEntryUrl(payload?.iss);
}

function logUrlTokenDebug(token) {
  if (!token) {
    return;
  }

  const payload = decodeJwtPayload(token);
  const normalizedIss = normalizeExternalEntryUrl(payload?.iss || "");
}

function normalizeNumericValue(value) {
  if (value === "" || value === null || value === undefined) {
    return "";
  }

  const normalizedValue = String(value).trim();
  if (!normalizedValue) {
    return "";
  }

  return /^\d+$/.test(normalizedValue)
    ? Number(normalizedValue)
    : normalizedValue;
}

function extractRolesFromClaims(claims) {
  if (!claims || typeof claims !== "object") {
    return [];
  }

  return Object.keys(claims)
    .filter((key) => !RESERVED_CLAIMS.has(key))
    .map((name, index) => ({
      id: index + 1,
      name,
      objectID: null,
      objectTable: null,
    }));
}

function buildUserFromSessionData(sessionData) {
  const normalizedSessionData =
    sessionData && typeof sessionData === "object" ? sessionData : {};
  const accessToken = normalizedSessionData.accessToken || getToken();
  const claims = decodeJwtPayload(accessToken) || {};
  const login = claims?.[CLAIM_NAME] || normalizedSessionData.login || "";
  const fio = claims?.[CLAIM_SURNAME] || normalizedSessionData.userName || "";
  const userId =
    normalizeNumericValue(claims?.[CLAIM_SID]) ||
    normalizeNumericValue(normalizedSessionData.id);
  const roles = extractRolesFromClaims(claims);

  if (!accessToken || !userId) {
    return null;
  }

  return {
    userID: userId,
    id: userId,
    login,
    userName: normalizedSessionData.userName || fio || login || "",
    fio: fio || normalizedSessionData.userName || login || "",
    fullName: fio || normalizedSessionData.userName || login || "",
    shortFIO: fio || normalizedSessionData.userName || login || "",
    email: normalizedSessionData.email || "",
    numberMobile: normalizedSessionData.numberMobile || "",
    phone: normalizedSessionData.phone || "",
    workNumberMobile: normalizedSessionData.workNumberMobile || "",
    uid_1c: normalizedSessionData.uid_1c || "",
    roles,
    currentRole: roles[0]?.id || null,
    expiresIn: normalizedSessionData.expiresIn || 0,
    accessTokenExpiresAt: normalizedSessionData.accessTokenExpiresAt || "",
    refreshTokenExpiresAt: normalizedSessionData.refreshTokenExpiresAt || "",
    requertAt: normalizedSessionData.requertAt || "",
  };
}

function createAuthorizedHeaders(token) {
  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

function isUnauthorizedError(error) {
  return axios.isAxiosError(error) && error.response?.status === 401;
}

async function exchangeToken(jwtToken) {
  const response = await axios.post(`${AUTH_API_ROOT}/api/TokenAuth`, {
    jwtToken,
  });

  const payload = response?.data;

  if (!payload || payload.state !== 1) {
    return {
      token: null,
      state: false,
      error: payload?.msg || "Ошибка авторизации",
    };
  }

  return {
    token: payload?.data?.accessToken || null,
    refreshToken: payload?.data?.refreshToken || null,
    sessionData: payload?.data || null,
    user: buildUserFromSessionData(payload?.data),
    state: true,
    error: null,
  };
}

async function refreshAccessToken() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    clearSession();
    return null;
  }

  if (!refreshRequestPromise) {
    refreshRequestPromise = (async () => {
      try {
        const response = await axios.post(
          `${AUTH_API_ROOT}/api/TokenAuth/refresh`,
          {
            refreshToken,
          },
        );

        const payload = response?.data;
        const nextAccessToken = payload?.data?.accessToken || null;
        const nextRefreshToken = payload?.data?.refreshToken || refreshToken;

        if (!payload || payload.state !== 1 || !nextAccessToken) {
          clearSession();
          return null;
        }

        setSession({
          accessToken: nextAccessToken,
          refreshToken: nextRefreshToken,
        });

        return nextAccessToken;
      } catch {
        clearSession();
        return null;
      } finally {
        refreshRequestPromise = null;
      }
    })();
  }

  return refreshRequestPromise;
}

async function getUserCardMini(userId: number | string) {
  const token = getToken();
  if (!token || userId === "" || userId === null || userId === undefined) {
    return null;
  }

  try {
    const response = await axios.get(
      `${APP_API_ROOT}/api/Modules/RolesModules/UserCardMini`,
      {
        params: { id: userId },
        headers: createAuthorizedHeaders(token),
      },
    );

    return response?.data ?? null;
  } catch (error) {
    if (!isUnauthorizedError(error)) {
      throw error;
    }

    const refreshedToken = await refreshAccessToken();
    if (!refreshedToken) {
      throw error;
    }

    const retryResponse = await axios.get(
      `${APP_API_ROOT}/api/Modules/RolesModules/UserCardMini`,
      {
        params: { id: userId },
        headers: createAuthorizedHeaders(refreshedToken),
      },
    );

    return retryResponse?.data ?? null;
  }
}

function logout() {
  clearSession();
}

configureAuthSession({
  getToken,
  refreshAccessToken,
});

export default {
  getToken,
  setToken,
  getRefreshToken,
  setRefreshToken,
  clearToken,
  clearRefreshToken,
  setSession,
  clearSession,
  getExternalEntryUrl,
  getLogoutEntryUrl,
  getUrlToken,
  clearUrlToken,
  logUrlTokenDebug,
  buildUserFromSessionData,
  exchangeToken,
  refreshAccessToken,
  getUserCardMini,
  logout,
};
