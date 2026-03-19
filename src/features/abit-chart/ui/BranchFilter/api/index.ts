import api from '@/shared/api/http'
import { BASE_URL, endpoints } from '@/entities/abit/api/config'
import type {
  EndpointRequestByAlias,
  EndpointResponseByAlias,
} from '@/entities/abit/api/config'

type ChartHelpersRequest = EndpointRequestByAlias<'GET_CHART_HELPERS'>['body']
type ChartHelpersResponse = EndpointResponseByAlias<'GET_CHART_HELPERS'>

export const chartHelpersApiService = {
  async getBranchData(db: string | null): Promise<string[]> {
    try {
      const url = new URL(BASE_URL + endpoints.GET_CHART_HELPERS)
      if (db) {
        url.searchParams.append('db', db)
      }

      const response = await api.post<ChartHelpersResponse, ChartHelpersRequest>(
        url.toString(),
        { Years: [] },
      )

      const values = response?.data as { pKs?: string[]; PKs?: string[] } | undefined
      if (values && Array.isArray(values.PKs)) {
        return values.PKs
      }

      if (values && Array.isArray(values.pKs)) {
        return values.pKs
      }

      console.error('Unexpected API response structure:', response)
      return ['ДГТУ', 'Авиаколледж ДГТУ', 'Маг', 'ФТТ']
    } catch (error) {
      console.error('Error fetching branch data:', error)
      return ['ДГТУ', 'Авиаколледж ДГТУ', 'Маг', 'ФТТ']
    }
  },
}

export default {
  chartHelpersApiService,
}
