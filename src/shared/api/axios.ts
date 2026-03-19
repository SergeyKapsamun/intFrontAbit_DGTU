import axios from 'axios'
import { getAuthToken, refreshAuthToken } from '@/shared/api/authSession'

function getTokenFromStorage() {
  return getAuthToken()
}

export default () => {
  const token = getTokenFromStorage()
  const headers: Record<string, string> = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const client = axios.create({
    withCredentials: false,
    headers,
  })

  client.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error?.config

      if (
        !axios.isAxiosError(error) ||
        error.response?.status !== 401 ||
        !originalRequest ||
        originalRequest._retry
      ) {
        return Promise.reject(error)
      }

      if (String(originalRequest.url || '').includes('/api/TokenAuth/refresh')) {
        return Promise.reject(error)
      }

      originalRequest._retry = true

      const refreshedToken = await refreshAuthToken()
      if (!refreshedToken) {
        return Promise.reject(error)
      }

      originalRequest.headers = originalRequest.headers || {}
      originalRequest.headers.Authorization = `Bearer ${refreshedToken}`

      return client.request(originalRequest)
    },
  )

  return client
}
