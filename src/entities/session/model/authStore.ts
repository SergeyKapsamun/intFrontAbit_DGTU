import { defineStore } from 'pinia'
import axios from 'axios'
import authApi from '@/entities/session/api/authApi'

function extractErrorMessage(error, fallbackMessage) {
  if (axios.isAxiosError(error)) {
    const responseMessage =
      error.response?.data?.msg ||
      error.response?.data?.message ||
      error.response?.data?.error

    if (typeof responseMessage === 'string' && responseMessage.trim()) {
      return responseMessage
    }
  }

  if (error instanceof Error && error.message) {
    return error.message
  }

  return fallbackMessage
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    loading: false,
    initialized: false,
    authError: '',
  }),
  getters: {
    isAuthenticated: (state) => !!authApi.getToken() && !!state.user,
    userFio: (state) => state.user?.fio || state.user?.fullName || state.user?.userName || '',
  },
  actions: {
    restoreSession(sessionData = null) {
      if (!authApi.getToken()) {
        this.user = null
        return { ok: false, error: 'Токен доступа не найден' }
      }

      try {
        const user = authApi.buildUserFromSessionData(sessionData)
        if (!user) {
          this.user = null
          authApi.clearSession()
          return {
            ok: false,
            error: 'Не удалось восстановить данные пользователя',
          }
        }

        this.user = user
        return { ok: true, error: '' }
      } catch (error) {
        this.user = null
        authApi.clearSession()

        return {
          ok: false,
          error: extractErrorMessage(error, 'Не удалось восстановить сессию'),
        }
      }
    },
    async initializeSession() {
      if (this.initialized) {
        return this.isAuthenticated
      }

      this.loading = true
      this.authError = ''

      try {
        const urlToken = authApi.getUrlToken()

        if (urlToken) {
          authApi.logUrlTokenDebug(urlToken)
          authApi.clearSession()

          const result = await authApi.exchangeToken(urlToken)
          if (!result.state || !result.token) {
            this.user = null
            authApi.clearSession()
            this.authError = result.error || 'Не удалось выполнить вход по ссылке'
            return false
          }

          authApi.setSession({
            accessToken: result.token,
            refreshToken: result.refreshToken,
            sourceToken: urlToken,
          })

          const restoredSession = this.restoreSession(result.sessionData)
          if (!restoredSession.ok) {
            this.authError =
              restoredSession.error || 'Не удалось инициализировать сессию пользователя'
            return false
          }

          return true
        }

        const restoredSession = this.restoreSession()
        if (!restoredSession.ok) {
          this.authError =
            restoredSession.error || 'Не удалось инициализировать сессию пользователя'
          return false
        }

        return true
      } catch (error) {
        this.user = null
        authApi.clearSession()
        this.authError = extractErrorMessage(error, 'Ошибка сети при авторизации')
        return false
      } finally {
        authApi.clearUrlToken()
        this.initialized = true
        this.loading = false
      }
    },
    async login(credentials) {
      this.loading = true
      this.authError = ''

      try {
        const jwtToken = credentials?.jwtToken || credentials?.token
        if (!jwtToken) {
          this.authError = 'Токен авторизации не передан'
          return { ok: false, error: this.authError }
        }

        const result = await authApi.exchangeToken(jwtToken)
        if (!result.state || !result.token) {
          this.user = null
          authApi.clearSession()
          this.authError = result.error || 'Ошибка авторизации'
          return { ok: false, error: this.authError }
        }

        authApi.setSession({
          accessToken: result.token,
          refreshToken: result.refreshToken,
          sourceToken: jwtToken,
        })

        const restoredSession = this.restoreSession(result.sessionData)
        if (!restoredSession.ok) {
          this.authError = restoredSession.error || 'Не удалось получить данные пользователя'
          return { ok: false, error: this.authError }
        }

        return { ok: true }
      } catch (error) {
        this.user = null
        authApi.clearSession()
        this.authError = extractErrorMessage(error, 'Ошибка сети при авторизации')
        return { ok: false, error: this.authError }
      } finally {
        this.loading = false
      }
    },
    logout(message = 'Сеанс завершён. Откройте раздел заново.') {
      authApi.clearSession()
      this.user = null
      this.authError = message
      this.initialized = true
    },
  },
})
