function get(name) {
  if (typeof document === 'undefined') return ''
  const escaped = name.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\\\$&')
  const match = document.cookie.match(new RegExp(`(?:^|; )${escaped}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : ''
}

type CookieSetOptions = {
  path?: string
  maxAge?: number
  domain?: string
  sameSite?: 'strict' | 'lax' | 'none' | string
  secure?: boolean
}

function set(name, value, options: CookieSetOptions = {}) {
  if (typeof document === 'undefined') return

  const opts = { path: '/', ...options }
  let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value ?? '')}`

  if (opts.maxAge != null) cookie += `; max-age=${opts.maxAge}`
  if (opts.path) cookie += `; path=${opts.path}`
  if (opts.domain) cookie += `; domain=${opts.domain}`
  if (opts.sameSite) cookie += `; samesite=${opts.sameSite}`
  if (opts.secure) cookie += '; secure'

  document.cookie = cookie
}

export default { get, set }
