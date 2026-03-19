<template>
	<div class="devxtreme-table-container">
		<DxDataGrid
			:data-source="abitData"
			:remote-operations="true"
			:allow-column-resizing="true"
			:allow-column-reordering="true"
			:column-min-width="80"
			:key-expr="'id'"
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
			:export="{ enabled: true }"
			:grouping="{ autoExpandAll: false }"
			ref="dataGrid"
			@row-click="onRowClick"
			:selection="{ mode: 'single', showCheckBoxesMode: 'none' }"
			@exporting="onExporting"
		>
			<DxHeaderFilter :visible="true" />
			<DxExport :enabled="true" file-name="Applicants" />
			<DxFilterPanel :visible="true" />
			<DxFilterBuilderPopup :visible="false" />
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
			<DxToolbar>
				<DxItem name="exportButton" />
			</DxToolbar>
			<DxPaging :page-size="pageSize" />
			<DxPager
				:visible="true"
				:allowed-page-sizes="[10, 20, 50, 100, 200]"
				:show-page-size-selector="true"
				:show-info="true"
				:display-mode="'adaptive'"
			/>
			<template #master-detail="{ data }">
				<div class="master-detail-section" @click.stop>
					<ApplicationDetails :data="data.data" />
				</div>
			</template>
		</DxDataGrid>
	</div>
</template>

<style scoped>
.master-detail-section {
	padding: 20px;
	background-color: #f9f9f9;
	border-top: 1px solid #e0e0e0;
}

.detail-content h4 {
	margin-top: 0;
	color: #333;
}

.detail-content p {
	margin: 8px 0;
	color: #666;
}
</style>

<script setup lang="ts">

import { nextTick, ref, watch } from 'vue'
import {
	DxDataGrid,
	DxColumn,
	DxHeaderFilter,
	DxGroupPanel,
	DxGrouping,
	DxFilterPanel,
	DxFilterBuilderPopup,
	DxSearch,
	DxItem,
	DxExport,
	DxPager,
	DxPaging,
	DxToolbar,
	DxMasterDetail,
} from 'devextreme-vue/data-grid'

import CustomStore from 'devextreme/data/custom_store'
import { locale, loadMessages } from 'devextreme/localization'
import ruMessages from 'devextreme/localization/messages/ru.json'

import { abitColumnConfig } from '@/entities/abit/config/columnConfig.ts'
import { BASE_URL, endpoints } from '@/entities/abit/api/config.ts'

import { Workbook } from 'exceljs'
import { saveAs } from 'file-saver'
import ApplicationDetails from './ApplicationDetails.vue'
import api from '@/shared/api/http'
import { useAbitStore } from '@/entities/abit/model/abitStore'
import { useDbStore } from '@/entities/db/model/dbStore'

loadMessages(ruMessages)
locale('ru')

const props = defineProps<{ id: number | string }>()

const abitStore = useAbitStore()
const dbStore = useDbStore()

const dataGrid = ref(null)
const pageSize = 20
const columnConfig = abitColumnConfig
const abitData = ref(null)

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
		key: 'id',
		load: (loadOptions: any) => {
			const selectedYear = abitStore.getSelectedYear
			let baseFilter = loadOptions.filter ? [...loadOptions.filter] : []

			if (selectedYear) {
				const yearFilter = ['recruitmentYear', '=', parseInt(selectedYear)]
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

			const url = new URL(BASE_URL + endpoints.GET_ABIT_USER_BY_ID(props.id))
			Object.keys(payload).forEach(key => {
				url.searchParams.append(key, payload[key])
			})

			return api
				.post(url.toString(), {})
				.then(data => {
					if (!data) throw new Error('Network response was not ok')
					return {
						data: Array.isArray(data.data)
							? data.data.map(row => ({
									...row,
									scoreSumFull: row.scoreSum + row.additionalScoreId,
							  }))
							: [],
						totalCount: data.totalCount || 0,
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
	abitData.value = createCustomStore()

	if (dataGrid.value?.instance) {
		try {
			await dataGrid.value.instance.refresh()
		} catch (error) {
			if (!isCanceledGridError(error)) {
				console.error('Error refreshing grid:', error)
			}
		}
	}
}

async function fetchExportData() {
	const grid = dataGrid.value?.instance
	if (!grid) throw new Error('DataGrid instance not found')

	const filterValue = grid.getCombinedFilter(true)
	const sortValue = grid.getDataSource().sort()
	const groupValue = grid.getDataSource().group()
	const selectedYear = abitStore.getSelectedYear
	let baseFilter = filterValue ? [...filterValue] : []

	if (selectedYear) {
		const yearFilter = ['recruitmentYear', '=', parseInt(selectedYear)]
		baseFilter = baseFilter.length > 0 ? [baseFilter, 'and', yearFilter] : yearFilter
	}

	const payload = {
		requireTotalCount: false,
		requireGroupCount: false,
		skip: 0,
		take: 2000,
		sort: JSON.stringify(sortValue || []),
		group: JSON.stringify(groupValue || []),
		filter: JSON.stringify(baseFilter),
		totalSummary: '[]',
		groupSummary: '[]',
	}

	const url = new URL(BASE_URL + endpoints.GET_ABIT_USER_BY_ID(props.id))
	Object.keys(payload).forEach(key => {
		url.searchParams.append(key, payload[key])
	})

	const data = await api.post(url.toString(), {})
	if (!data) throw new Error('Network response was not ok')

	return data.data.map(item => ({
		...item,
		scoreSumFull: item.scoreSum + item.additionalScoreId,
	}))
}

async function onExporting(e: any) {
	e.cancel = true

	const grid = e.component
	grid.beginUpdate()
	grid.option('loadPanel.enabled', true)

	try {
		const exportData = await fetchExportData()
		const workbook = new Workbook()
		const worksheet = workbook.addWorksheet('Applicants')
		const headers = columnConfig.map(col => col.caption || col.dataField)

		const headerRow = worksheet.addRow(headers)
		headerRow.font = { bold: true }

		exportData.forEach(row => {
			const dataRow = []
			columnConfig.forEach(col => {
				dataRow.push(row[col.dataField])
			})
			worksheet.addRow(dataRow)
		})

		if (exportData.length > 0) {
			worksheet.autoFilter = {
				from: 'A1',
				to: `${String.fromCharCode(64 + headers.length)}${exportData.length + 1}`,
			}
		}

		const buffer = await workbook.xlsx.writeBuffer()
		saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'Applicants.xlsx')
	} catch (error) {
		console.error('Export failed:', error)
	} finally {
		grid.option('loadPanel.enabled', false)
		grid.endUpdate()
	}
}

function onRowClick(e: any) {
	abitStore.selectAbit(abitStore.getSelectedAbit === e.key ? null : e.key)

	const grid = e.component
	if (grid.isRowExpanded(e.key)) {
		grid.collapseRow(e.key)
	} else {
		grid.expandRow(e.key)
	}
}

watch(
	() => dbStore.getSelectedDB,
	() => {
		void refreshTableData()
	},
)

watch(
	() => abitStore.getSelectedAbit,
	async value => {
		await nextTick()
		if (dataGrid.value?.instance && !value) {
			dataGrid.value.instance.deselectAll()
		}
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

abitData.value = createCustomStore()
</script>
<style>
.relative {
	position: relative;
}
</style>
