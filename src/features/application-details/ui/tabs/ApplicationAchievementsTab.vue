<template>
	<div>
		<div class="devxtreme-table-container">
			<DxDataGrid
				:data-source="achievementsData"
				:remote-operations="true"
				:allow-column-resizing="true"
				:allow-column-reordering="true"
				:column-min-width="80"
				:show-borders="false"
				:column-resizing-mode="'widget'"
				:scrolling="{
					mode: 'standard',
					scrollByThumb: true,
					scrollByContent: true,
					useNative: true,
				}"
				:width="'100%'"
				:allow-column-grouping="true"
				:group-panel="{ visible: true }"
				:grouping="{ autoExpandAll: false }"
				ref="dataGrid"
				:selection="{ mode: 'single', showCheckBoxesMode: 'none' }"
			>
				<DxHeaderFilter :visible="true" />

				<DxColumn
					v-for="(column, index) in columnConfig"
					:key="`${column.dataField}_${index}`"
					:data-field="column.dataField"
					:caption="column.caption"
					:width="column.width"
					:alignment="column.alignment"
					:allow-filtering="column.allowFiltering"
					:allow-header-filtering="column.allowHeaderFiltering"
					:data-type="column.dataType"
				>
					<DxHeaderFilter
						:allow-select-all="column.headerFilterAllowSelectAll !== false"
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
					<AchievementDetailCard :achievement="data.data" />
				</template>
			</DxDataGrid>
		</div>
	</div>
</template>
<script setup lang="ts">

import { ref, watch } from 'vue'
import {
	DxColumn,
	DxHeaderFilter,
	DxSearch,
	DxMasterDetail,
	DxDataGrid,
} from 'devextreme-vue/data-grid'
import { locale, loadMessages } from 'devextreme/localization'
import ruMessages from 'devextreme/localization/messages/ru.json'
import { AchievementDetailCard } from '@/entities/abit'
import CustomStore from 'devextreme/data/custom_store'
import { BASE_URL, endpoints } from '@/entities/abit/api/config'
import { achievementsColumnConfig } from '@/entities/abit/config/achievementsColumnConfig'
import api from '@/shared/api/http'
import { useAbitStore } from '@/entities/abit/model/abitStore'
import { useDbStore } from '@/entities/db/model/dbStore'

loadMessages(ruMessages)
locale('ru')

const props = defineProps<{ id?: number | string | null }>()

const abitStore = useAbitStore()
const dbStore = useDbStore()

const dataGrid = ref(null)
const columnConfig = achievementsColumnConfig
const achievementsData = ref(null)

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
		key: 'code',
		load: (loadOptions: any) => {
			const selectedYear = abitStore.getSelectedYear
			let baseFilter = props.id
				? ['id', '=', props.id]
				: loadOptions.filter
					? [...loadOptions.filter]
					: []

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

			const url = new URL(BASE_URL + endpoints.GET_ACHIEVEMENTS)
			Object.keys(payload).forEach(key => {
				url.searchParams.append(key, payload[key])
			})

			return api
				.post(url.toString(), {})
				.then(data => {
					if (!data) throw new Error('Network response was not ok')
					return {
						data: data.data,
						totalCount: data.totalCount,
					}
				})
				.catch(err => {
					console.error('DataGrid load error:', err)
					throw err
				})
		},
	})
}

async function refreshTableData() {
	achievementsData.value = createCustomStore()

	if (dataGrid.value?.instance) {
		try {
			await dataGrid.value.instance.refresh()
		} catch (error) {
			if (!isCanceledGridError(error)) {
				console.error('Error refreshing achievements grid:', error)
			}
		}
	}
}

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

achievementsData.value = createCustomStore()
</script>
<style scoped></style>
