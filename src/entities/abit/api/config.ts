import type {
  ApiEndpointKey,
  ApiEndpointRequest,
  ApiEndpointResponse,
} from '@/shared/api/contracts/frontend-api'
import { getApiBaseUrl } from '@/shared/config/runtime'

export const BASE_URL = getApiBaseUrl()

export const endpoints = {
	GET_ABIT: `/Applicants/summary`,
	GET_ABIT_FULL: id => `/Applicants/${id}`,
	GET_ACHIEVEMENTS: `/AbitAchievements`,
	GET_ACHIEVEMENT: id => `/AbitAchievements/${id}`,
	UPDATE_ACHIEVEMENT: `/AchievementStatus/update`,
	GET_DOCUMENTS: `/AbitDocuments`,
	GET_DOCUMENT: id => `/AbitDocuments/${id}`,
	UPDATE_DOCUMENT: `/DocumentStatus/update`,
	GET_DBS: '/DBMetadata/databases',
	GET_CHART_HELPERS: '/applicants/chart/helpers/PKs',
	GET_ApplicantsChart: '/applicants/chart/build',
	GET_APPLICATION_SCORES: id => `/ApplicantDisciplines/${id}`,
	GET_APPLICATION_RANKING: okso => `/ApplicantsRanking/${okso}`,
	GET_ABIT_USER: '/AbitSpisokAbit/distinct',
	GET_ABIT_USER_BY_ID: id => `/AbitSpisokAbit/${id}`,
	GET_YEARS: db => `/DbMetadata/recruitment-years/${db}`,
	GET_DISCIPLINE_LIST: `/AbitDisciplinesFast/list`,
	GET_DISCIPLINE: id => `/AbitDisciplinesFast/applicants/${id}`,
	GET_CRM_LIST: `/Messages/list`,
	GET_CRM_DETAIL: id => `/Messages/applicant/${id}`,
	GET_SCREEN: '/AbitScreen/list',
	GET_SCREEN_DETAIL: `/AbitScreen/rank`,
}

export const endpointContractKeys = {
	GET_ABIT: 'Applicants_GetSummary',
	GET_ABIT_FULL: 'Applicants_GetById',
	GET_ACHIEVEMENTS: 'AbitAchievements_Get',
	GET_ACHIEVEMENT: 'AbitAchievements_GetByAbitId',
	UPDATE_ACHIEVEMENT: 'AchievementStatus_Update',
	GET_DOCUMENTS: 'AbitDocuments_Get',
	GET_DOCUMENT: 'AbitDocuments_GetByAbitId',
	UPDATE_DOCUMENT: 'DocumentStatus_UpdateDocumentStatus',
	GET_DBS: 'DbMetadata_GetDatabases',
	GET_CHART_HELPERS: 'ApplicantsChart_GetPKs',
	GET_ApplicantsChart: 'ApplicantsChart_Build',
	GET_APPLICATION_SCORES: 'ApplicantDisciplines_GetDisciplines',
	GET_APPLICATION_RANKING: 'ApplicantsRanking_GetRankedByDirection',
	GET_ABIT_USER: 'AbitSpisokAbit_GetDistinct',
	GET_YEARS: 'DbMetadata_GetRecruitmentYears',
	GET_DISCIPLINE_LIST: 'AbitDisciplinesFast_GetDisciplines',
	GET_DISCIPLINE: 'AbitDisciplinesFast_GetApplicants',
	GET_CRM_LIST: 'Messages_GetMessages',
	GET_CRM_DETAIL: 'Messages_GetApplicantFull',
	GET_SCREEN: 'AbitScreen_GetScreen',
	GET_SCREEN_DETAIL: 'AbitScreen_GetRank',
} as const satisfies Record<string, ApiEndpointKey>

export type EndpointAlias = keyof typeof endpointContractKeys
export type EndpointKeyByAlias<T extends EndpointAlias> =
	(typeof endpointContractKeys)[T]
export type EndpointRequestByAlias<T extends EndpointAlias> = ApiEndpointRequest<
	EndpointKeyByAlias<T>
>
export type EndpointResponseByAlias<T extends EndpointAlias> = ApiEndpointResponse<
	EndpointKeyByAlias<T>
>
