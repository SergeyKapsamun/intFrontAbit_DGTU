import Api from '@/shared/api/axios'

function appendQuery(link: string, params: Record<string, unknown> = {}) {
  if (!params || typeof params !== 'object') return link
  const query = new URLSearchParams()

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue
    query.append(key, String(value))
  }

  const queryString = query.toString()
  if (!queryString) return link
  return link.includes('?') ? `${link}&${queryString}` : `${link}?${queryString}`
}

export default {
  address: '',
  offConsole: true,
  async get<TResponse = any>(link: string, params?: Record<string, unknown>) {
    const response = await Api().get(appendQuery(link, params))
    return (response?.data ?? null) as TResponse | null
  },
  async post<TResponse = any, TBody = unknown>(
    link: string,
    body?: TBody,
    params?: Record<string, unknown>,
  ) {
    const response = await Api().post(link, body, params)
    return (response?.data ?? null) as TResponse | null
  },
  async put<TResponse = any, TBody = unknown>(link: string, body?: TBody) {
    const response = await Api().put(link, body)
    return (response?.data ?? null) as TResponse | null
  },
  async delete<TResponse = any>(link: string, params?: Record<string, unknown>) {
    const response = await Api().delete(appendQuery(link, params))
    return (response?.data ?? null) as TResponse | null
  },
}
