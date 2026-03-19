import api from '@/shared/api/http'

const BASE_URL = 'https://ddt.donstu.ru/api'

const dbEndpoints = {
  GET_DBS: '/DBMetadata/databases',
  GET_YEARS: (db: string) => `/DbMetadata/recruitment-years/${db}`,
}

interface DbMetaApiResponse {
  data?: {
    Databases?: string[]
    IP?: string
  }
}

interface YearsApiResponse {
  data?: number[]
}

interface DbMetaViewModel {
  databases: string[]
  ip: string
}

export const getDBs = async (role: string): Promise<DbMetaViewModel> => {
  const roleValue = role == 'Пользователь' ? '2' : '1'
  const res = await api.get<DbMetaApiResponse>(BASE_URL + dbEndpoints.GET_DBS, {
    role: roleValue,
  })

  if (!res) {
    throw new Error('Failed to get DBs')
  }

  return {
    databases: Array.isArray(res.data?.Databases) ? res.data.Databases : [],
    ip: res.data?.IP || '',
  }
}

export const getYears = async (db: string | null, role: number | string): Promise<number[]> => {
  const res = await api.get<YearsApiResponse>(BASE_URL + dbEndpoints.GET_YEARS(db || ''), {
    role: String(role),
  })

  if (!res) {
    throw new Error('Failed to get Years')
  }

  return Array.isArray(res.data) ? res.data : []
}
