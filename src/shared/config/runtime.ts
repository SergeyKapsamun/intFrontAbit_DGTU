const DEFAULT_API_ORIGIN = 'https://ddt.donstu.ru'

type RuntimeConfig = {
  apiOrigin?: string
}

declare global {
  interface Window {
    __APP_CONFIG__?: RuntimeConfig
  }
}

function normalizeOrigin(raw: string | undefined) {
  const value = (raw || '').trim()
  if (!value) return DEFAULT_API_ORIGIN

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
  return `${getApiOrigin()}/api`
}
