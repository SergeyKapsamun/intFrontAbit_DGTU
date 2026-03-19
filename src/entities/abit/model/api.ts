import { BASE_URL, endpoints } from '@/entities/abit/api/config'
import api from '@/shared/api/http'
import type {
	EndpointRequestByAlias,
	EndpointResponseByAlias,
} from '@/entities/abit/api/config'

type GetDisciplineRequest = EndpointRequestByAlias<'GET_DISCIPLINE_LIST'>
type GetDisciplineResponse = EndpointResponseByAlias<'GET_DISCIPLINE_LIST'>
type DisciplineListItem = NonNullable<GetDisciplineResponse['data']>[number]
type UpdateAchievementRequest = EndpointRequestByAlias<'UPDATE_ACHIEVEMENT'>['body']
type UpdateAchievementResponse = EndpointResponseByAlias<'UPDATE_ACHIEVEMENT'>
type UpdateDocumentRequest = EndpointRequestByAlias<'UPDATE_DOCUMENT'>['body']
type UpdateDocumentResponse = EndpointResponseByAlias<'UPDATE_DOCUMENT'>

export const getDiscipline = async (
	db: string | null,
	year: number | null,
): Promise<DisciplineListItem[]> => {
	const endpoint = endpoints.GET_DISCIPLINE_LIST
	const url = new URL(BASE_URL + endpoint)

	if (db) {
		url.searchParams.append('db', db)
	}

	if (year) {
		url.searchParams.append('year', String(year))
	}

	const data = await api.post<GetDisciplineResponse, GetDisciplineRequest['body']>(
		url.toString(),
		{},
	)

	if (!data) {
		throw new Error('API call failed')
	}

	return Array.isArray(data.data) ? data.data : []
}

export const updateAchievement = async (
	body: UpdateAchievementRequest,
): Promise<UpdateAchievementResponse> => {
	const data = await api.post<UpdateAchievementResponse, UpdateAchievementRequest>(
		BASE_URL + endpoints.UPDATE_ACHIEVEMENT,
		body,
	)

	if (!data) {
		throw new Error('Failed to update achievement')
	}

	return data
}

export const updateDocument = async (
	body: UpdateDocumentRequest,
): Promise<UpdateDocumentResponse> => {
	const data = await api.post<UpdateDocumentResponse, UpdateDocumentRequest>(
		BASE_URL + endpoints.UPDATE_DOCUMENT,
		body,
	)

	if (!data) {
		throw new Error('Failed to update document')
	}

	return data
}
