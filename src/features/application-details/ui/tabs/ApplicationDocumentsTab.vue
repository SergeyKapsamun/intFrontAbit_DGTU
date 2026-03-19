<template>
	<div>
		<div class="devxtreme-table-container">
			<DxDataGrid
				:data-source="documentsData"
				:remote-operations="{
					filtering: true,
					sorting: true,
					paging: true,
					grouping: false,
				}"
				:allow-column-resizing="true"
				:allow-column-reordering="true"
				:column-min-width="80"
				:show-borders="false"
				:column-resing-mode="'widget'"
				:scrolling="{
					mode: 'standard',
					scrollByThumb: true,
					scrollByContent: true,
					useNative: true,
				}"
				:width="'100%'"
				:allow-column-grouping="true"
				:group-panel="{ visible: true }"
				:grouping="{ autoExpandAll: false, allowCollapsing: true }"
				:column-auto-width="true"
				:selection="{ mode: 'single', showCheckBoxesMode: 'none' }"
				ref="dataGrid"
				@content-ready="onContentReady"
			>
				<DxHeaderFilter :visible="true" />
				<DxFilterPanel :visible="true" />
				<DxFilterBuilderPopup :visible="false" />
				<DxColumn
					v-for="(col, index) in documentsColumns"
					:key="`${col.dataField}_${index}`"
					:data-field="col.dataField"
					:caption="col.caption"
					:width="col.width"
					:alignment="col.alignment"
					:allow-filtering="col.allowFiltering"
					:allow-header-filtering="col.allowHeaderFiltering"
					:data-type="col.dataType"
				>
					<DxHeaderFilter
						:allow-select-all="col.headerFilterAllowSelectAll !== false"
					>
						<DxSearch :enabled="true" />
					</DxHeaderFilter>
				</DxColumn>
				<DxMasterDetail
					class="relative"
					:enabled="true"
					template="master-detail"
				/>
				<template #master-detail="{ data }">
					<DocumentDetailCard :document="data.data" />
				</template>
			</DxDataGrid>
		</div>
	</div>
</template>
<script setup lang="ts">

import { ref, watch } from 'vue'
import {
	DxDataGrid,
	DxColumn,
	DxHeaderFilter,
	DxFilterPanel,
	DxFilterBuilderPopup,
	DxSearch,
	DxMasterDetail,
} from 'devextreme-vue/data-grid'
import CustomStore from 'devextreme/data/custom_store'
import { DocumentDetailCard } from '@/entities/abit'
import { locale, loadMessages } from 'devextreme/localization'
import ruMessages from 'devextreme/localization/messages/ru.json'
import { BASE_URL, endpoints } from '@/entities/abit/api/config'
import { documentsColumnsConfig } from '@/entities/abit/config/documentsColumnConfig.ts'
import api from '@/shared/api/http'
import { useAbitStore } from '@/entities/abit/model/abitStore'
import { useDbStore } from '@/entities/db/model/dbStore'

loadMessages(ruMessages)
locale('ru')

const props = defineProps<{ id?: number | string | null; documentId?: number | string | null }>()

const abitStore = useAbitStore()
const dbStore = useDbStore()

const dataGrid = ref(null)
const documentsData = ref(null)
const documentsColumns = documentsColumnsConfig

function isCanceledGridError(error: any): boolean {
	return /(cancel(ed|led)?|abort(ed)?|ERR_CANCELED)/i.test(
		String(
			error?.message ||
				error?.name ||
				error?.statusText ||
				error?.code ||
				error?.cause?.message ||
				error?.cause ||
				error?.response?.statusText ||
				error?.response?.data?.message ||
				error ||
				'',
		),
	)
}

function createCustomStore() {
	return new CustomStore({
		key: 'documentId',
		load: (loadOptions: any) => {
			const selectedYear = abitStore.getSelectedYear
			let baseFilter = loadOptions.filter ? [...loadOptions.filter] : []

			if (props.id) {
				const idFilter = ['id', '=', props.id]
				baseFilter =
					baseFilter.length > 0 ? [baseFilter, 'and', idFilter] : idFilter
			}

			if (selectedYear) {
				const yearFilter = ['year', '=', parseInt(selectedYear, 10)]
				baseFilter =
					baseFilter.length > 0 ? [baseFilter, 'and', yearFilter] : yearFilter
			}

			const payload = {
				requireTotalCount: true,
				requireGroupCount: true,
				isCountQuery: false,
				isSummaryQuery: false,
				skip: loadOptions.skip || 0,
				take: loadOptions.take || 20,
				sort: JSON.stringify(
					(loadOptions.sort || []).map(s => ({
						selector: s.selector,
						desc: s.desc,
					})),
				),
				group: JSON.stringify(
					(loadOptions.group || []).map(g => ({
						selector: g.selector,
						desc: g.desc,
						groupInterval: g.groupInterval,
						isExpanded: g.isExpanded,
					})),
				),
				filter: JSON.stringify(baseFilter),
				totalSummary: JSON.stringify(loadOptions.totalSummary || []),
				groupSummary: JSON.stringify(loadOptions.groupSummary || []),
				select: JSON.stringify([]),
				preSelect: JSON.stringify([]),
				remoteSelect: true,
				remoteGrouping: true,
				expandLinqSumType: true,
				primaryKey: ['id'],
				defaultSort: 'id',
				stringToLower: true,
				paginateViaPrimaryKey: true,
				sortByPrimaryKey: true,
				allowAsyncOverSync: true,
			}

			const url = new URL(BASE_URL + endpoints.GET_DOCUMENTS)
			Object.keys(payload).forEach(key => {
				url.searchParams.append(key, payload[key])
			})

			return api
				.post(url.toString(), {})
				.then(data => {
					if (!data) throw new Error('Network response was not ok')

					const fileIdCounts = {}
					if (Array.isArray(data.data)) {
						data.data.forEach(doc => {
							if (doc.fileId) {
								fileIdCounts[doc.documentId] =
									(fileIdCounts[doc.documentId] || 0) + 1
							}
						})
					}

					const formattedData = Array.isArray(data.data)
						? data.data.map((doc, index) => {
								const uniqueFallback = `Файл-${index + 1}`
								let processedFileCaption = doc.fileCaption || ''
								if (doc.documentId && fileIdCounts[doc.documentId] > 1) {
									processedFileCaption = doc.fileCaption || uniqueFallback
								}

								return {
									...doc,
									N: index + 1,
									fileCaption: processedFileCaption,
									abiturientFIO: doc.abiturientFIO || 'Неизвестно',
								}
						  })
						: []

					return {
						data: formattedData,
						totalCount: data.totalCount || 0,
					}
				})
				.catch(err => {
					console.error('Documents DataGrid load error:', err)
					throw err
				})
		},
	})
}

async function refreshTableData() {
	documentsData.value = createCustomStore()

	if (dataGrid.value?.instance) {
		try {
			await dataGrid.value.instance.refresh()
		} catch (error) {
			if (!isCanceledGridError(error)) {
				console.error('Error refreshing documents grid:', error)
			}
		}
	}
}

function onContentReady() {}

watch(
	() => dbStore.getSelectedDB,
	() => {
		void refreshTableData()
	},
)

watch(
	() => abitStore.getSelectedYear,
	() => {
		void refreshTableData()
	},
	{ immediate: true },
)

watch(
	() => props.id,
	() => {
		void refreshTableData()
	},
)

documentsData.value = createCustomStore()
</script>
<style scoped></style>
