import { BASE_URL, endpoints } from '@/entities/abit/api/config.ts'
import api from '@/shared/api/http'
import type {
	EndpointResponseByAlias,
} from '@/entities/abit/api/config'

type GetAppDataResponse = EndpointResponseByAlias<'GET_ABIT_FULL'>
type GetAppScoresResponse = EndpointResponseByAlias<'GET_APPLICATION_SCORES'>
type GetAppRankingResponse = EndpointResponseByAlias<'GET_APPLICATION_RANKING'>
type AppDataDto = NonNullable<GetAppDataResponse['data']>
type AppScoresDto = NonNullable<GetAppScoresResponse['data']>
type AppRankingDto = NonNullable<GetAppRankingResponse['data']>

export const getAppData = async (id: number): Promise<AppDataDto | null> => {
	const url = BASE_URL + endpoints.GET_ABIT_FULL(id)
	const res = await api.get<GetAppDataResponse>(url)
	if (!res) {
		throw new Error('Failed to get application data')
	}
	return res.data ?? null
}

export const getAppScores = async (id: number): Promise<AppScoresDto> => {
	const url = BASE_URL + endpoints.GET_APPLICATION_SCORES(id)
	const res = await api.get<GetAppScoresResponse>(url)
	if (!res) {
		throw new Error('Failed to get application scores')
	}
	return Array.isArray(res.data) ? res.data : []
}

export const getAppRanking = async (
	okso: string,
	year: number,
	planNabora: number,
	rswithsogl = false,
): Promise<AppRankingDto> => {
	const url = BASE_URL + endpoints.GET_APPLICATION_RANKING(okso)
	const res = await api.post<GetAppRankingResponse>(
		`${url}?year=${year}&planNabora=${planNabora}&rswithsogl=${rswithsogl}`,
		{},
	)
	if (!res) {
		throw new Error('Failed to get application ranking')
	}
	return Array.isArray(res.data) ? res.data : []
}
