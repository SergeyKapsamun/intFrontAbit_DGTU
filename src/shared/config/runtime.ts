type RuntimeConfig = {
  apiOrigin?: string
  defaultDatabase?: string
}

declare global {
  interface Window {
    __APP_CONFIG__?: RuntimeConfig
  }
}

function normalizeOrigin(raw: string | undefined) {
  const value = (raw || '').trim()
  if (!value) return ''

  if (/^https?:\/\//i.test(value)) {
    return value.replace(/\/+$/, '')
  }

  if (value.startsWith('//')) {
    return `https:${value}`.replace(/\/+$/, '')
  }

  return `https://${value.replace(/^\/+/, '').replace(/\/+$/, '')}`
}

export function getApiOrigin() {
  return normalizeOrigin(window.__APP_CONFIG__?.apiOrigin)
}

export function getApiBaseUrl() {
  const origin = getApiOrigin()
  return origin ? `${origin}/api` : '/api'
}

export function getDefaultDatabase() {
  return (window.__APP_CONFIG__?.defaultDatabase || '').trim()
}
