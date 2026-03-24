<template>
	<div class="devxtreme-table-container">
		<DxDataGrid
			:data-source="abitData"
			:remote-operations="true"
			:allow-column-resizing="true"
			:allow-column-reordering="true"
			:column-min-width="80"
			:key-expr="'rowKey'"
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

function getApplicantFilterValue() {
	const rawId = typeof props.id === 'string' ? Number(props.id) : props.id
	return Number.isFinite(rawId) ? rawId : props.id
}

function buildApplicantsSummaryFilter(gridFilter: any) {
	const applicantFilter = ['id', '=', getApplicantFilterValue()]
	const selectedYear = abitStore.getSelectedYear
	let baseFilter: any = applicantFilter

	if (gridFilter) {
		baseFilter = [baseFilter, 'and', gridFilter]
	}

	if (selectedYear) {
		const yearFilter = ['recruitmentYear', '=', parseInt(selectedYear, 10)]
		baseFilter = [baseFilter, 'and', yearFilter]
	}

	return baseFilter
}

function buildApplicantsSummaryUrl(payload: Record<string, any>) {
	const url = new URL(BASE_URL + endpoints.GET_ABIT)

	Object.keys(payload).forEach(key => {
		url.searchParams.append(key, payload[key])
	})

	url.searchParams.append('MoreThanOne', 'true')

	return url
}

function mapApplicantRows(data: any) {
	if (!Array.isArray(data)) {
		return []
	}

	return data.map((row, index) => ({
		...row,
		rowKey: row.applicationCode ?? row.ApplicationCode ?? `${row.id ?? row.Id}_${index}`,
		scoreSumFull: (row.scoreSum || 0) + (row.additionalScoreId || 0),
	}))
}

function createCustomStore() {
	return new CustomStore({
		key: 'rowKey',
		load: (loadOptions: any) => {
			const baseFilter = buildApplicantsSummaryFilter(loadOptions.filter)

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
				primaryKey: ['applicationCode'],
				defaultSort: 'applicationCode',
				stringToLower: true,
				paginateViaPrimaryKey: true,
				sortByPrimaryKey: true,
				allowAsyncOverSync: true,
			}

			const url = buildApplicantsSummaryUrl(payload)

			return api
				.post(url.toString(), {})
				.then(data => {
					if (!data) throw new Error('Network response was not ok')
					return {
						data: mapApplicantRows(data.data),
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
	const baseFilter = buildApplicantsSummaryFilter(filterValue)

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
		select: JSON.stringify([]),
		preSelect: JSON.stringify([]),
		remoteSelect: true,
		remoteGrouping: true,
		expandLinqSumType: true,
		primaryKey: ['applicationCode'],
		defaultSort: 'applicationCode',
		stringToLower: true,
		paginateViaPrimaryKey: true,
		sortByPrimaryKey: true,
		allowAsyncOverSync: true,
	}

	const url = buildApplicantsSummaryUrl(payload)

	const data = await api.post(url.toString(), {})
	if (!data) throw new Error('Network response was not ok')

	return mapApplicantRows(data.data)
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
