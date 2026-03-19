import axios from 'axios'
import { configureAuthSession } from '@/shared/api/authSession'

const ACCESS_TOKEN_KEY = 'authToken'
const REFRESH_TOKEN_KEY = 'refreshToken'
const LEGACY_TOKEN_KEY = 'abitAuthToken'
const URL_TOKEN_KEY = 'token'
const AUTH_API_ROOT = 'https://ddt.donstu.ru'
const APP_API_ROOT = 'https://ddt.donstu.ru'
let refreshRequestPromise: Promise<string | null> | null = null

function getStorageValue(key) {
  try {
    return window.localStorage.getItem(key) || ''
  } catch {
    return ''
  }
}

function setStorageValue(key, value) {
  try {
    if (value) {
      window.localStorage.setItem(key, value)
    } else {
      window.localStorage.removeItem(key)
    }
  } catch {
    
  }
}

function getToken() {
  return getStorageValue(ACCESS_TOKEN_KEY) || getStorageValue(LEGACY_TOKEN_KEY) || ''
}

function setToken(token) {
  setStorageValue(ACCESS_TOKEN_KEY, token || '')
}

function getRefreshToken() {
  return getStorageValue(REFRESH_TOKEN_KEY) || ''
}

function setRefreshToken(token) {
  setStorageValue(REFRESH_TOKEN_KEY, token || '')
}

function clearToken() {
  setToken('')
}

function clearRefreshToken() {
  setRefreshToken('')
}

function setSession(payload) {
  setToken(payload?.accessToken || '')
  setRefreshToken(payload?.refreshToken || '')
}

function clearSession() {
  clearToken()
  clearRefreshToken()
  setStorageValue(LEGACY_TOKEN_KEY, '')
}

function getUrlToken() {
  if (typeof window === 'undefined') return ''

  const searchToken = new URLSearchParams(window.location.search).get(URL_TOKEN_KEY)?.trim()
  if (searchToken) {
    return searchToken
  }

  const rawHash = window.location.hash.startsWith('#')
    ? window.location.hash.slice(1)
    : window.location.hash
  const queryIndex = rawHash.indexOf('?')

  if (queryIndex === -1) {
    return ''
  }

  return new URLSearchParams(rawHash.slice(queryIndex + 1)).get(URL_TOKEN_KEY)?.trim() || ''
}

function normalizePathname(pathname) {
  const trimmedPath = pathname.replace(/\/+$/, '') || '/'

  if (trimmedPath === '/login') {
    return '/'
  }

  if (trimmedPath.endsWith('/login')) {
    return trimmedPath.slice(0, -'/login'.length) || '/'
  }

  return pathname || '/'
}

function clearUrlToken() {
  if (typeof window === 'undefined') return

  try {
    const currentUrl = new URL(window.location.href)
    currentUrl.pathname = normalizePathname(currentUrl.pathname)
    currentUrl.searchParams.delete(URL_TOKEN_KEY)

    const rawHash = currentUrl.hash.startsWith('#')
      ? currentUrl.hash.slice(1)
      : currentUrl.hash

    if (rawHash) {
      const queryIndex = rawHash.indexOf('?')

      if (queryIndex !== -1) {
        const hashPath = rawHash.slice(0, queryIndex)
        const hashParams = new URLSearchParams(rawHash.slice(queryIndex + 1))
        hashParams.delete(URL_TOKEN_KEY)
        const nextHashQuery = hashParams.toString()
        currentUrl.hash = nextHashQuery ? `#${hashPath}?${nextHashQuery}` : hashPath
      }
    }

    window.history.replaceState({}, '', currentUrl.toString())
  } catch {
  }
}

function createAuthorizedHeaders(token) {
  return {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }
}

function isUnauthorizedError(error) {
  return axios.isAxiosError(error) && error.response?.status === 401
}

async function exchangeToken(jwtToken) {
  const response = await axios.post(`${AUTH_API_ROOT}/api/TokenAuth`, {
    jwtToken,
  })

  const payload = response?.data

  if (!payload || payload.state !== 1) {
    return {
      token: null,
      state: false,
      error: payload?.msg || 'Ошибка авторизации',
    }
  }

  return {
    token: payload?.data?.accessToken || null,
    refreshToken: payload?.data?.refreshToken || null,
    state: true,
    error: null,
  }
}

async function refreshAccessToken() {
  const refreshToken = getRefreshToken()
  if (!refreshToken) {
    clearSession()
    return null
  }

  if (!refreshRequestPromise) {
    refreshRequestPromise = (async () => {
      try {
        const response = await axios.post(`${AUTH_API_ROOT}/api/TokenAuth/refresh`, {
          refreshToken,
        })

        const payload = response?.data
        const nextAccessToken = payload?.data?.accessToken || null
        const nextRefreshToken = payload?.data?.refreshToken || refreshToken

        if (!payload || payload.state !== 1 || !nextAccessToken) {
          clearSession()
          return null
        }

        setSession({
          accessToken: nextAccessToken,
          refreshToken: nextRefreshToken,
        })

        return nextAccessToken
      } catch {
        clearSession()
        return null
      } finally {
        refreshRequestPromise = null
      }
    })()
  }

  return refreshRequestPromise
}

async function getCurrentUser() {
  const token = getToken()
  if (!token) {
    return { state: 0, data: null, msg: 'No token' }
  }

  try {
    const response = await axios.get(`${AUTH_API_ROOT}/api/TokenAuth`, {
      headers: createAuthorizedHeaders(token),
    })

    return response?.data ?? null
  } catch (error) {
    if (!isUnauthorizedError(error)) {
      throw error
    }

    const refreshedToken = await refreshAccessToken()
    if (!refreshedToken) {
      throw error
    }

    const retryResponse = await axios.get(`${AUTH_API_ROOT}/api/TokenAuth`, {
      headers: createAuthorizedHeaders(refreshedToken),
    })

    return retryResponse?.data ?? null
  }
}

async function getUserCardMini(userId: number | string) {
  const token = getToken()
  if (!token || userId === '' || userId === null || userId === undefined) {
    return null
  }

  try {
    const response = await axios.get(`${APP_API_ROOT}/api/Modules/RolesModules/UserCardMini`, {
      params: { id: userId },
      headers: createAuthorizedHeaders(token),
    })

    return response?.data ?? null
  } catch (error) {
    if (!isUnauthorizedError(error)) {
      throw error
    }

    const refreshedToken = await refreshAccessToken()
    if (!refreshedToken) {
      throw error
    }

    const retryResponse = await axios.get(`${APP_API_ROOT}/api/Modules/RolesModules/UserCardMini`, {
      params: { id: userId },
      headers: createAuthorizedHeaders(refreshedToken),
    })

    return retryResponse?.data ?? null
  }
}

function logout() {
  clearSession()
}

configureAuthSession({
  getToken,
  refreshAccessToken,
})

export default {
  getToken,
  setToken,
  getRefreshToken,
  setRefreshToken,
  clearToken,
  clearRefreshToken,
  setSession,
  clearSession,
  getUrlToken,
  clearUrlToken,
  exchangeToken,
  refreshAccessToken,
  getCurrentUser,
  getUserCardMini,
  logout,
}
