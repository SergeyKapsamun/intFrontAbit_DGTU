import api from '@/shared/api/http'
import { getApiOrigin } from '@/shared/config/runtime'

const API_ROOT = getApiOrigin()
const PROGRAM_VERSIONS_ENDPOINT = '/api/Modules/CommonControllers/ProgramVersions'

export interface ProgramVersionDto {
  id?: number
  versionNumber?: string
  dateUpdate?: string | null
  additionsFunctionality?: string | null
  editsErrors?: string | null
  newOpportunities?: string | null
}

interface ProgramVersionsResponseShape {
  updates?: ProgramVersionDto[]
  vers?: ProgramVersionDto[]
  data?:
    | ProgramVersionDto[]
    | {
        updates?: ProgramVersionDto[]
        vers?: ProgramVersionDto[]
      }
}

function normalizeList(payload: ProgramVersionsResponseShape | ProgramVersionDto[] | null) {
  if (!payload) return [] as ProgramVersionDto[]

  if (Array.isArray(payload)) {
    return payload
  }

  if (Array.isArray(payload.data)) {
    return payload.data
  }

  if (payload.data && typeof payload.data === 'object') {
    if (Array.isArray(payload.data.updates)) {
      return payload.data.updates
    }

    if (Array.isArray(payload.data.vers)) {
      return payload.data.vers
    }
  }

  if (Array.isArray(payload.updates)) {
    return payload.updates
  }

  if (Array.isArray(payload.vers)) {
    return payload.vers
  }

  return []
}

function toTimestamp(dateValue: string | null | undefined) {
  if (!dateValue) return Number.NEGATIVE_INFINITY
  const timestamp = new Date(dateValue).getTime()
  return Number.isFinite(timestamp) ? timestamp : Number.NEGATIVE_INFINITY
}

export async function getProgramVersions(): Promise<ProgramVersionDto[]> {
  const response = await api.get<ProgramVersionsResponseShape | ProgramVersionDto[]>(
    `${API_ROOT}${PROGRAM_VERSIONS_ENDPOINT}`,
  )
  const list = normalizeList(response)

  return [...list].sort((a, b) => toTimestamp(b.dateUpdate) - toTimestamp(a.dateUpdate))
}
