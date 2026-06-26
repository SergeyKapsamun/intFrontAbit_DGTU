import { defineStore } from 'pinia'
import authApi from '@/entities/session/api/authApi'

const AUTH_ACCESS_DENIED_MESSAGE = 'У вас недостаточно прав, обратитесь к администратору'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    loading: false,
    initialized: false,
    authError: '',
    authReturnUrl: '',
  }),
  getters: {
    isAuthenticated: (state) => !!authApi.getToken() && !!state.user,
    userFio: (state) => state.user?.fio || state.user?.fullName || state.user?.userName || '',
  },
  actions: {
    restoreSession(sessionData = null) {
      if (!authApi.getToken()) {
        this.user = null
        return { ok: false, error: AUTH_ACCESS_DENIED_MESSAGE }
      }

      try {
        const user = authApi.buildUserFromSessionData(sessionData)
        if (!user) {
          this.user = null
          authApi.clearSession()
          return {
            ok: false,
            error: AUTH_ACCESS_DENIED_MESSAGE,
          }
        }

        this.user = user
        return { ok: true, error: '' }
      } catch (error) {
        this.user = null
        authApi.clearSession()

        return {
          ok: false,
          error: AUTH_ACCESS_DENIED_MESSAGE,
        }
      }
    },
    async initializeSession() {
      if (this.initialized) {
        return this.isAuthenticated
      }

      this.loading = true
      this.authError = ''
      this.authReturnUrl = ''

      try {
        const urlToken = authApi.getUrlToken()

        if (urlToken) {
          authApi.logUrlTokenDebug(urlToken)
          authApi.clearSession()

          const result = await authApi.exchangeToken(urlToken)
          if (!result.state || !result.token) {
            this.user = null
            authApi.clearSession()
            this.authReturnUrl = result.externalEntryUrl || ''
            this.authError = AUTH_ACCESS_DENIED_MESSAGE
            return false
          }

          authApi.setSession({
            accessToken: result.token,
            refreshToken: result.refreshToken,
            externalEntryUrl: result.externalEntryUrl,
            sourceToken: urlToken,
          })

          const restoredSession = this.restoreSession(result.sessionData)
          if (!restoredSession.ok) {
            this.authError = AUTH_ACCESS_DENIED_MESSAGE
            return false
          }

          return true
        }

        const restoredSession = this.restoreSession()
        if (!restoredSession.ok) {
          this.authError = AUTH_ACCESS_DENIED_MESSAGE
          return false
        }

        return true
      } catch (error) {
        this.user = null
        authApi.clearSession()
        this.authError = AUTH_ACCESS_DENIED_MESSAGE
        this.authReturnUrl = ''
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
      this.authReturnUrl = ''

      try {
        const jwtToken = credentials?.jwtToken || credentials?.token
        if (!jwtToken) {
          this.authError = AUTH_ACCESS_DENIED_MESSAGE
          return { ok: false, error: this.authError }
        }

        const result = await authApi.exchangeToken(jwtToken)
        if (!result.state || !result.token) {
          this.user = null
          authApi.clearSession()
          this.authReturnUrl = result.externalEntryUrl || ''
          this.authError = AUTH_ACCESS_DENIED_MESSAGE
          return { ok: false, error: this.authError }
        }

        authApi.setSession({
          accessToken: result.token,
          refreshToken: result.refreshToken,
          externalEntryUrl: result.externalEntryUrl,
          sourceToken: jwtToken,
        })

        const restoredSession = this.restoreSession(result.sessionData)
        if (!restoredSession.ok) {
          this.authError = AUTH_ACCESS_DENIED_MESSAGE
          return { ok: false, error: this.authError }
        }

        return { ok: true }
      } catch (error) {
        this.user = null
        authApi.clearSession()
        this.authError = AUTH_ACCESS_DENIED_MESSAGE
        this.authReturnUrl = ''
        return { ok: false, error: this.authError }
      } finally {
        this.loading = false
      }
    },
    logout(message = 'Сеанс завершён. Откройте раздел заново.') {
      authApi.clearSession()
      this.user = null
      this.authError = message
      this.authReturnUrl = ''
      this.initialized = true
    },
  },
})
