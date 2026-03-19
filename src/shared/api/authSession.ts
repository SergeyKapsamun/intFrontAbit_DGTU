type AuthSessionAdapter = {
  getToken: () => string
  refreshAccessToken: () => Promise<string | null>
}

const defaultAdapter: AuthSessionAdapter = {
  getToken: () => '',
  refreshAccessToken: async () => null,
}

let adapter: AuthSessionAdapter = defaultAdapter

export function configureAuthSession(nextAdapter: Partial<AuthSessionAdapter>) {
  adapter = {
    ...adapter,
    ...nextAdapter,
  }
}

export function getAuthToken() {
  return adapter.getToken()
}

export function refreshAuthToken() {
  return adapter.refreshAccessToken()
}
