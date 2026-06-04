<script setup lang="ts">
import { computed } from 'vue'
import { RouterView } from 'vue-router'
import { useAuthStore } from '@/entities/session/model/authStore'

const authStore = useAuthStore()
const PERMISSION_DENIED_MESSAGE = 'У вас недостаточно прав, обратитесь к администратору'

const canRenderApp = computed(() => authStore.initialized && authStore.isAuthenticated)
const isPermissionDenied = computed(() => authStore.authError === PERMISSION_DENIED_MESSAGE)
const authStateTitle = computed(() => {
  if (authStore.loading) {
    return 'Загрузка раздела'
  }

  if (isPermissionDenied.value) {
    return PERMISSION_DENIED_MESSAGE
  }

  return 'Не удалось загрузить данные'
})
const authStateText = computed(() => {
  if (authStore.loading) {
    return 'Подождите, раздел открывается.'
  }

  if (isPermissionDenied.value) {
    return ''
  }

  const authError = authStore.authError.toLowerCase()

  if (!authError) {
    return 'Попробуйте обновить страницу. Если проблема повторится, откройте раздел заново.'
  }

  if (
    authError.includes('сеанс заверш') ||
    authError.includes('авторизац') ||
    authError.includes('токен') ||
    authError.includes('сесси')
  ) {
    return 'Обновите страницу. Если проблема повторится, откройте раздел заново.'
  }

  return authStore.authError
})
const hasAuthReturnUrl = computed(() => Boolean(authStore.authReturnUrl))
const authStateButtonText = computed(() =>
  hasAuthReturnUrl.value ? 'Вернуться' : 'Обновить страницу',
)

function handleAuthStateAction() {
  if (authStore.authReturnUrl) {
    window.location.assign(authStore.authReturnUrl)
    return
  }

  window.location.reload()
}
</script>

<template>
  <RouterView v-if="canRenderApp" />

  <main v-else class="auth-state">
    <section class="auth-state-card">
      <div v-if="authStore.loading" class="auth-state-spinner" aria-hidden="true"></div>
      <h1 class="auth-state-title">{{ authStateTitle }}</h1>
      <p v-if="authStateText" class="auth-state-text">{{ authStateText }}</p>

      <button v-if="!authStore.loading" type="button" class="auth-state-button" @click="handleAuthStateAction">
        {{ authStateButtonText }}
      </button>
    </section>
  </main>
</template>

<style scoped>
.auth-state {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
  background:
    radial-gradient(circle at top, rgba(100, 149, 237, 0.18), transparent 38%),
    linear-gradient(180deg, #f7fbff 0%, #eef7ff 100%);
}

.auth-state-card {
  width: min(100%, 480px);
  padding: 32px 28px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.94);
  border: 1px solid rgba(100, 149, 237, 0.16);
  box-shadow: 0 24px 60px rgba(23, 73, 134, 0.14);
  text-align: center;
}

.auth-state-spinner {
  width: 44px;
  height: 44px;
  margin: 0 auto 18px;
  border-radius: 50%;
  border: 4px solid rgba(100, 149, 237, 0.18);
  border-top-color: #6495ed;
  animation: auth-spin 0.9s linear infinite;
}

.auth-state-title {
  margin: 0 0 12px;
  color: #20406d;
  font-size: 28px;
  line-height: 1.2;
}

.auth-state-text {
  margin: 0;
  color: #4d5f79;
  font-size: 16px;
  line-height: 1.5;
}

.auth-state-button {
  margin-top: 24px;
  border: 0;
  border-radius: 999px;
  padding: 12px 20px;
  background: linear-gradient(135deg, #6495ed, #7fc7ff);
  color: #fff;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}

@keyframes auth-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
