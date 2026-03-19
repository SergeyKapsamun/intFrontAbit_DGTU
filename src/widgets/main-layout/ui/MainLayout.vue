<template>
  <div class="layout" :class="{ 'is-mobile': isMobileView }">
    <div class="content-shell">
      <header class="topbar app-tools">
        <div class="topbar-left">
          <button
            type="button"
            class="topbar-brand"
            title="На главную"
            @click="goToAbit"
          >
            <img src="/img/icons/logo.png" alt="" class="topbar-brand-logo" />
            <span class="crumbs">ДеканатДГТУ</span>
          </button>
        </div>

        <div class="topbar-right">
          <button
            v-if="!isMobileView"
            type="button"
            class="icon-btn topbar-icon-btn"
            :title="isFullscreen ? 'Свернуть экран' : 'Полный экран'"
            @click="toggleFullscreen"
          >
            <i
              class="fas"
              :class="isFullscreen ? 'fa-compress' : 'fa-expand'"
            ></i>
          </button>

          <button
            v-if="!isMobileView && authStore.isAuthenticated"
            type="button"
            class="icon-btn topbar-icon-btn theme-btn"
            title="Внешний вид"
            @click="openThemeSelector"
          >
            <i class="fas fa-brush" aria-hidden="true"></i>
          </button>

          <v-tooltip
            v-if="!isMobileView && authStore.isAuthenticated"
            location="left"
            transition="slide-x-transition"
            content-class="user-card-tooltip"
          >
            <template #activator="{ props }">
              <div
                class="desktop-user-name-trigger"
                v-bind="props"
                :title="authStore.userFio || 'Пользователь'"
              >
                <b>{{ authStore.userFio || "Пользователь" }}</b>
              </div>
            </template>

            <span v-if="userCardData">
              <LongUserCard
                :user-data="userCardData"
                :show-name="true"
                :show-id="isIntegratorAdmin"
                :show-sid="false"
                :show-description="false"
                :show-email="true"
                :show-phone="true"
                :show-snils="false"
                :show-open-profile="false"
              />
            </span>
          </v-tooltip>

          <v-menu
            v-if="isMobileView && authStore.isAuthenticated"
            v-model="mobileUserMenuOpen"
            location="bottom start"
            offset="8"
            :close-on-content-click="true"
            content-class="user-menu"
          >
            <template #activator="{ props }">
              <div
                class="user-menu-activator d-flex align-center"
                v-bind="props"
              >
                <div class="user-icon-wrapper mr-2">
                  <i class="fas fa-user"></i>
                </div>
                <i class="fas fa-chevron-down chevron-icon"></i>
              </div>
            </template>

            <v-list class="user-menu-list" density="compact">
              <v-list-item class="user-menu-item user-menu-name">
                <v-list-item-title>{{
                  authStore.userFio || "Пользователь"
                }}</v-list-item-title>
              </v-list-item>
              <v-list-item @click="openThemeSelector" class="user-menu-item">
                <template #prepend>
                  <i class="fas fa-brush user-menu-fa" aria-hidden="true"></i>
                </template>
                <v-list-item-title>Внешний вид</v-list-item-title>
              </v-list-item>
              <v-divider class="my-1" />
              <v-list-item @click="onLogout" class="user-menu-item logout-item">
                <template #prepend>
                  <i
                    class="fas fa-sign-out-alt user-menu-fa"
                    aria-hidden="true"
                  ></i>
                </template>
                <v-list-item-title>Вернуться</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>

          <button
            v-if="!isMobileView"
            type="button"
            class="logout-btn"
            @click="onLogout"
          >
            <i class="fas fa-sign-out-alt" aria-hidden="true"></i>
            <span>Вернуться</span>
          </button>
        </div>
      </header>

      <ThemeSelectorDrawer
        v-model="themeDialogOpen"
        :selected-theme-id="activeThemeId"
        :is-mobile="isMobileView"
        @select-theme="onSelectTheme"
      />

      <main class="content">
        <RouterView />
      </main>

      <footer v-if="!isMobileView" class="footer main-footer">
        <span class="foot-span">Интегратор ММИС</span>
        <span class="foot-span">© {{ currentYear }}</span>
        <div class="footer-spacer"></div>
        <span class="foot-span db-foot-span" title="ДеканатДГТУ">
          <i class="fas fa-database foot-icon" aria-hidden="true"></i>
          <b>ДеканатДГТУ</b>
        </span>
        <span
          class="foot-span version-foot-span"
          title="Журнал версий"
          @click="openVersionJournal"
        >
          <i class="fas fa-laptop-code foot-icon" aria-hidden="true"></i>
          <b>{{ appVersion }}</b>
        </span>
      </footer>
    </div>

    <div
      v-if="isMobileView"
      class="mobile-bottom-nav"
      role="navigation"
      aria-label="Мобильная навигация"
    >
      <div class="mobile-bottom-nav-container">
        

        <button class="mobile-bottom-nav-item" type="button" @click="onLogout">
          <span class="mobile-bottom-nav-icon-wrapper">
            <i
              class="fas fa-sign-out-alt fa-mobile-nav-icon"
              aria-hidden="true"
            ></i>
          </span>
          <span class="mobile-bottom-nav-label">Вернуться</span>
        </button>
      </div>

      <div class="mobile-bottom-nav-footer">
        <span class="mobile-bottom-nav-footer-text"
          >Интегратор ММИС © {{ currentYear }}-{{ nextYear }}</span
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { RouterView, useRoute, useRouter } from "vue-router";
import { useTheme } from "vuetify";
import authApi from "@/entities/session/api/authApi";
import { useAuthStore } from "@/entities/session/model/authStore";
import {
  applyStoredTheme,
  applyThemeById,
  getStoredThemeId,
} from "@/shared/lib/theme/themeManager";
import LongUserCard from "@/shared/ui/long-user-card/LongUserCard.vue";
import ThemeSelectorDrawer from "./ThemeSelectorDrawer.vue";

const MOBILE_BREAKPOINT = 900;

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const vuetifyTheme = useTheme();

const mobileUserMenuOpen = ref(false);
const themeDialogOpen = ref(false);
const activeThemeId = ref(getStoredThemeId());
const isMobileView = ref(false);
const isFullscreen = ref(false);
const currentYear = new Date().getFullYear();
const nextYear = currentYear + 1;
const appVersion = "1.1.8";

type UserCardData = {
  id: string | number;
  fullName: string;
  phone: string;
  email: string;
  mail: string;
  photo: string;
};

const isAbitActive = computed(
  () => route.path === "/" || route.path.startsWith("/abit"),
);
const userCardData = ref<UserCardData | null>(null);
const userCardUserId = computed(
  () =>
    authStore.user?.userID ||
    authStore.user?.id ||
    authStore.user?.currentID ||
    authStore.user?.uid ||
    "",
);
const isIntegratorAdmin = computed(() => {
  const roles = authStore.user?.roles;
  if (!Array.isArray(roles)) return false;
  return roles.some((role: any) =>
    typeof role === "string"
      ? role === "Администратор-Интегратор"
      : role?.name === "Администратор-Интегратор",
  );
});
const authUserLogin = computed(
  () =>
    authStore.user?.login ||
    authStore.user?.userName ||
    authStore.user?.username ||
    "",
);
const authUserEmail = computed(() => authStore.user?.email || "");
const authUserPhone = computed(
  () =>
    authStore.user?.numberMobile ||
    authStore.user?.phone ||
    authStore.user?.workNumberMobile ||
    "",
);
const authUserAvatar = computed(() => {
  const raw =
    authStore.user?.photoPatch ||
    authStore.user?.photo ||
    authStore.user?.avatar ||
    authStore.user?.avatarUrl ||
    authStore.user?.image ||
    "";

  if (!raw) return "";
  if (/^https?:\/\//i.test(raw) || raw.startsWith("data:")) return raw;
  return `https://ddt.donstu.ru${raw.startsWith("/") ? raw : `/${raw}`}`;
});

watch(
  () => route.fullPath,
  () => {
    mobileUserMenuOpen.value = false;
  },
);

watch(
  userCardUserId,
  () => {
    void loadUserCardData();
  },
  { immediate: true },
);

onMounted(() => {
  activeThemeId.value = applyStoredTheme(vuetifyTheme);
  updateViewportState();
  syncFullscreenState();
  window.addEventListener("resize", updateViewportState, { passive: true });
  document.addEventListener("fullscreenchange", syncFullscreenState);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateViewportState);
  document.removeEventListener("fullscreenchange", syncFullscreenState);
});

function updateViewportState() {
  isMobileView.value = window.innerWidth <= MOBILE_BREAKPOINT;
  if (!isMobileView.value) {
    mobileUserMenuOpen.value = false;
  }
}

function syncFullscreenState() {
  isFullscreen.value = !!document.fullscreenElement;
}

function normalizePhotoPath(raw: string) {
  if (!raw) return "";
  const normalized = raw.startsWith("/") ? raw : `/${raw}`;
  if (normalized === "/img/man.png") {
    return normalized;
  }

  if (/^https?:\/\//i.test(raw) || raw.startsWith("data:")) return raw;
  return `https://ddt.donstu.ru${raw.startsWith("/") ? raw : `/${raw}`}`;
}

async function loadUserCardData() {
  if (!userCardUserId.value) {
    userCardData.value = {
      id: "",
      fullName: authStore.userFio || "Пользователь",
      phone: authUserPhone.value || "",
      email: authUserEmail.value || "",
      mail: authUserEmail.value || "",
      photo: authUserAvatar.value || "",
    };
    return;
  }

  try {
    const response = await authApi.getUserCardMini(userCardUserId.value);
    const cardInfo = response?.cardInfo || response?.data?.cardInfo || null;

    if (cardInfo) {
      userCardData.value = {
        id: cardInfo.id ?? userCardUserId.value,
        fullName: cardInfo.fio || authStore.userFio || "Пользователь",
        phone: cardInfo.phone || "",
        email: cardInfo.mail || "",
        mail: cardInfo.mail || "",
        photo: normalizePhotoPath(cardInfo.photoPatch || cardInfo.photo || ""),
      };
      return;
    }
  } catch {
    
  }

  userCardData.value = {
    id: userCardUserId.value,
    fullName: authStore.userFio || "Пользователь",
    phone: authUserPhone.value || "",
    email: authUserEmail.value || "",
    mail: authUserEmail.value || "",
    photo: authUserAvatar.value || "",
  };
}

function goToAbit() {
  mobileUserMenuOpen.value = false;
  router.push("/abit").catch(() => {});
}

function openThemeSelector() {
  mobileUserMenuOpen.value = false;
  themeDialogOpen.value = true;
}

function openVersionJournal() {
  router.push("/VersionPage").catch(() => {});
}

function onSelectTheme(themeId: number) {
  activeThemeId.value = applyThemeById(themeId, vuetifyTheme);
}

async function toggleFullscreen() {
  try {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  } catch {
    
  } finally {
    syncFullscreenState();
  }
}

function onLogout() {
  authStore.logout();
  userCardData.value = null;
  mobileUserMenuOpen.value = false;
  themeDialogOpen.value = false;
}
</script>

<style scoped>
.layout {
  --legacy-primary: var(--ui-primary, #6495ed);
  --legacy-secondary: var(--ui-secondary, #7fc7ff);
  min-height: 100vh;
  position: relative;
  background:
    radial-gradient(
      circle at 100% 0%,
      rgba(126, 231, 241, 0.12),
      transparent 38%
    ),
    radial-gradient(
      circle at 0% 100%,
      rgba(45, 212, 191, 0.1),
      transparent 34%
    ),
    #effcff;
}

.content-shell {
  min-width: 0;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  min-height: 100vh;
}

.topbar,
.footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 0 16px;
  background: var(--legacy-primary);
  color: #fff;
}

.topbar {
  position: sticky;
  top: 0;
  z-index: 12;
  min-height: 64px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);
}

.topbar-left,
.topbar-right {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.topbar-left {
  flex: 1;
  min-width: 200px;
}

.topbar-brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  max-width: 100%;
  background: transparent;
  border: none;
  color: inherit;
  padding: 0;
  cursor: pointer;
}

.topbar-brand:hover .crumbs {
}

.topbar-brand-logo {
  width: 28px;
  height: 28px;
  object-fit: contain;
  display: block;
}

.crumbs {
  color: #fff;
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 0.5px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 999px;
  border: none;
  background: transparent;
  color: #fff;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    background-color 0.2s ease;
}

.icon-btn:hover {
  transform: scale(1.1);
  background-color: rgba(255, 255, 255, 0.1);
}

.icon-btn .fas {
  font-size: 16px;
  line-height: 1;
}

.topbar-icon-btn {
  flex: 0 0 auto;
}

.desktop-user-name-trigger {
  cursor: pointer;
  max-width: 320px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.desktop-user-name-trigger b {
  color: #fff;
  font-weight: 700;
}

:deep(.user-card-tooltip) {
  background: transparent !important;
  padding: 0 !important;
  box-shadow: none !important;
  border: none !important;
}

:deep(.user-card-tooltip .v-overlay__content) {
  background: transparent !important;
  padding: 0 !important;
  opacity: 1 !important;
  min-width: 280px;
  max-width: min(92vw, 360px);
}

:deep(.user-card-tooltip .long-user-card-wrapper) {
  opacity: 1 !important;
}

:deep(.user-card-tooltip .user-card) {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2) !important;
}

.logout-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  width: 36px;
  height: 36px;
  border: none;
  background: transparent;
  color: #fff;
  border-radius: 999px;
  padding: 0;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    background-color 0.2s ease;
}

.logout-btn:hover {
  background-color: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

.logout-btn .fas {
  font-size: 16px;
  line-height: 1;
}

.logout-btn span {
  display: none;
}

.user-menu-activator {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  padding: 6px 10px;
  border-radius: 8px;
  transition: background-color 0.2s ease;
  margin-left: 8px;
}

.user-menu-activator:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.user-icon-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  transition: all 0.2s ease;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
}

.user-menu-activator:hover .user-icon-wrapper {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.user-icon-wrapper .fas {
  color: white !important;
  font-size: 18px;
}

.chevron-icon {
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  line-height: 1;
  transition: transform 0.2s ease;
}

.user-menu-activator:hover .chevron-icon {
  transform: translateY(2px);
}

:deep(.user-menu) {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
  border-radius: 8px !important;
  margin-top: 8px !important;
}

:deep(.user-menu-list) {
  padding: 8px 0 !important;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(148, 163, 184, 0.2);
  box-shadow: 0 12px 24px rgba(15, 23, 42, 0.14);
}

:deep(.user-menu-item) {
  min-height: 48px !important;
  padding: 0 16px !important;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

:deep(.user-menu-item:hover) {
  background-color: rgba(0, 0, 0, 0.04) !important;
}

:deep(.user-menu-item.logout-item:hover) {
  background-color: rgba(244, 67, 54, 0.08) !important;
}

:deep(.user-menu-name .v-list-item-title) {
  font-weight: 600;
}

:deep(.user-menu-item .v-list-item__prepend) {
  margin-inline-end: 12px !important;
  min-width: 24px !important;
}

:deep(.user-menu-item .v-list-item-title) {
  font-size: 14px !important;
  font-weight: 400 !important;
}

:deep(.user-menu .user-menu-fa) {
  color: #64748b !important;
  font-size: 24px !important;
  line-height: 1 !important;
  width: 24px;
  text-align: center;
}

.content {
  min-width: 0;
  padding-bottom: 56px;
  background:
    radial-gradient(circle at 0% 0%, rgba(34, 211, 238, 0.06), transparent 28%),
    radial-gradient(
      circle at 100% 100%,
      rgba(45, 212, 191, 0.06),
      transparent 30%
    );
  background-color: #f4f4f4;
}

.footer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 11;
  border-top: none;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.14);
  padding-top: 0;
  padding-bottom: 0;
  min-height: 44px;
  font-size: 13px;
}

.footer-spacer {
  flex: 1;
}

.foot-span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
  margin-right: 20px;
}

.db-foot-span {
  min-width: 0;
  max-width: min(40vw, 360px);
}

.db-foot-span b {
  display: inline-block;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.version-foot-span {
  cursor: pointer;
}

.version-foot-span:hover {
  opacity: 0.92;
}

.foot-icon {
  font-size: 16px;
  line-height: 1;
  color: #fff;
  width: 16px;
  text-align: center;
}

.mobile-bottom-nav {
  display: none;
}

@media (max-width: 900px) {
  .topbar {
    min-height: 56px;
    padding-left: 12px;
    padding-right: 12px;
  }

  .topbar-right {
    gap: 8px;
  }

  .topbar-icon-btn {
    display: none;
  }

  .logout-btn {
    display: none;
  }

  .content {
    padding-bottom: 108px;
  }

  .footer {
    display: none;
  }

  .mobile-bottom-nav {
    display: block;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 35;
    background: linear-gradient(
      180deg,
      var(--legacy-primary) 0%,
      var(--legacy-secondary) 100%
    );
    border-top: none;
    box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.2);
  }

  .mobile-bottom-nav-container {
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 64px;
    min-height: 64px;
    padding: 8px 8px 0;
  }

  .mobile-bottom-nav-item {
    display: flex;
    flex: 1;
    min-width: 0;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0;
    padding: 6px 4px;
    background: transparent;
    border: none;
    color: rgba(255, 255, 255, 0.7);
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .mobile-bottom-nav-item:active {
    transform: scale(0.95);
  }

  .mobile-bottom-nav-item.active {
    color: #fff;
  }

  .mobile-bottom-nav-icon-wrapper {
    width: 32px;
    height: 32px;
    margin-bottom: 4px;
    border-radius: 8px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.15);
    border: none;
    backdrop-filter: blur(10px);
    transition: all 0.2s ease;
  }

  .mobile-bottom-nav-item.active .mobile-bottom-nav-icon-wrapper {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.1);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }

  .mobile-bottom-nav-icon-wrapper .fa-mobile-nav-icon {
    font-size: 18px;
    line-height: 1;
    color: #fff;
  }

  .mobile-bottom-nav-logo {
    width: 24px;
    height: 24px;
    object-fit: contain;
    display: block;
    filter: brightness(0) invert(1);
  }

  .mobile-bottom-nav-label {
    font-size: 11px;
    font-weight: 500;
    line-height: 1.2;
    white-space: nowrap;
    color: rgba(255, 255, 255, 0.8);
  }

  .mobile-bottom-nav-label.active {
    color: #fff;
    font-weight: 600;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  }

  .mobile-bottom-nav-footer {
    border-top: 1px solid rgba(255, 255, 255, 0.2);
    padding: 4px 8px 8px;
    text-align: center;
  }

  .mobile-bottom-nav-footer-text {
    font-size: 13px;
    color: rgba(255, 255, 255, 0.9);
    font-weight: 500;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    white-space: nowrap;
  }
}

@media (max-width: 900px) and (min-width: 401px) {
  .crumbs {
    display: block;
    max-width: 180px;
  }
}

@media (max-width: 400px) {
  .crumbs {
    display: none;
  }
}
</style>
