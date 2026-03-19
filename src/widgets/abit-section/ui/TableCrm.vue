<template>
  <div class="crm-table-container">
    <DxDataGrid
      :data-source="tableData"
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
      :export="{ enabled: true }"
      :grouping="{ autoExpandAll: false }"
      ref="dataGrid"
      @row-click="onRowClick"
      :selection="{ mode: 'single', showCheckBoxesMode: 'none' }"
      @exporting="onExporting"
    >
      <DxHeaderFilter :visible="true" />
      <DxExport :enabled="true" file-name="CrmData" />
      <DxFilterPanel :visible="true" />
      <DxFilterBuilderPopup :defer-rendering="false" :visible="false" />
      <DxColumn
        v-for="(column, index) in tableColumns"
        :key="`${column.dataField}_${index}`"
        :data-field="column.dataField"
        :caption="column.caption"
        :width="column.width"
        :alignment="column.alignment"
        :allow-filtering="column.allowFiltering"
        :allow-header-filtering="column.allowHeaderFiltering"
        :data-type="column.dataType"
        :format="column.format"
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
        <DetailView :data="data.data" />
      </template>
    </DxDataGrid>
  </div>
</template>

<style scoped>
.crm-table-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}

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

import { ref, watch } from 'vue'
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

import { endpoints } from '@/entities/abit/api/config'
import { Workbook } from 'exceljs'
import { saveAs } from 'file-saver'
import { crmConfig } from '@/entities/abit/config/crmConfig'
import DetailView from './DetailView.vue'
import api from '@/shared/api/http'
import { BASE_URL } from '@/entities/abit/api/config'
import { useAbitStore } from '@/entities/abit/model/abitStore'
import { useDbStore } from '@/entities/db/model/dbStore'

loadMessages(ruMessages)
locale('ru')

const abitStore = useAbitStore()
const dbStore = useDbStore()

const dataGrid = ref(null)
const pageSize = 20
const tableData = ref(null)
const tableColumns = crmConfig

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
			const baseFilter = loadOptions.filter ? [...loadOptions.filter] : []

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

			const url = new URL(BASE_URL + endpoints.GET_CRM_LIST)
			Object.keys(payload).forEach(key => {
				url.searchParams.append(key, payload[key])
			})
			url.searchParams.append('withoutReply', 'false')

			return api
				.post(url.toString(), {})
				.then(data => {
					if (!data) throw new Error('Network response was not ok')
					return {
						data: Array.isArray(data.data)
							? data.data.map((item, i) => ({
									...item,
									id: i,
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
	tableData.value = createCustomStore()

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

	const selectedYear = abitStore.getSelectedYear
	if (!selectedYear) {
		return []
	}

	const filterValue = grid.getCombinedFilter(true)
	const sortValue = grid.getDataSource().sort()
	const groupValue = grid.getDataSource().group()
	const baseFilter = filterValue ? [...filterValue] : []

	let allData = []
	let skip = 0
	const take = 1000
	let hasMore = true

	while (hasMore) {
		const payload = {
			requireTotalCount: false,
			requireGroupCount: false,
			skip,
			take,
			sort: JSON.stringify(sortValue || []),
			group: JSON.stringify(groupValue || []),
			filter: JSON.stringify(baseFilter),
			totalSummary: '[]',
			groupSummary: '[]',
		}

		const url = new URL(BASE_URL + endpoints.GET_CRM_LIST)
		Object.keys(payload).forEach(key => {
			url.searchParams.append(key, payload[key])
		})
		url.searchParams.append('withoutReply', 'false')
		url.searchParams.append('year', String(selectedYear))

		const data = await api.post(url.toString(), {})
		if (!data) {
			throw new Error('API call failed')
		}

		if (data.data && data.data.length > 0) {
			allData = allData.concat(data.data)
			skip += take
			if (data.data.length < take) {
				hasMore = false
			}
		} else {
			hasMore = false
		}
	}

	return allData.map(item => ({ ...item }))
}

async function onExporting(e: any) {
	e.cancel = true

	const grid = e.component
	grid.beginUpdate()
	grid.option('loadPanel.enabled', true)

	try {
		const exportData = await fetchExportData()
		const workbook = new Workbook()
		const worksheet = workbook.addWorksheet('CRM Data')
		const headers = tableColumns.map(col => col.caption || col.dataField)

		const headerRow = worksheet.addRow(headers)
		headerRow.font = { bold: true }

		exportData.forEach(row => {
			const dataRow = tableColumns.map(col => {
				let value = row[col.dataField]

				if (typeof value === 'boolean') {
					return value ? 'Да' : 'Нет'
				}
				if (col.dataType === 'date' && value) {
					return new Date(value)
				}
				if (col.format) {
					if (col.format.type === 'date' && value) {
						return new Date(value)
					}
					if (col.format.type === 'currency' && typeof value === 'number') {
						return value.toFixed(2)
					}
					if (col.format.type === 'percent' && typeof value === 'number') {
						return value * 100 + '%'
					}
				}

				return value
			})

			worksheet.addRow(dataRow)
		})

		if (exportData.length > 0) {
			const lastColumnLetter = String.fromCharCode(64 + headers.length)
			worksheet.autoFilter = {
				from: 'A1',
				to: `${lastColumnLetter}${exportData.length + 1}`,
			}
		}

		worksheet.columns.forEach((column, index) => {
			let maxLength = headers[index] ? headers[index].toString().length : 0
			exportData.forEach(row => {
				const cellValue = row[tableColumns[index]?.dataField]
				if (cellValue && cellValue.toString().length > maxLength) {
					maxLength = cellValue.toString().length
				}
			})
			column.width = Math.min(maxLength + 2, 50)
		})

		const buffer = await workbook.xlsx.writeBuffer()
		saveAs(
			new Blob([buffer], { type: 'application/octet-stream' }),
			`CRM_Data_${new Date().toISOString().slice(0, 10)}.xlsx`,
		)
	} catch (error) {
		console.error('Export failed:', error)
	} finally {
		grid.option('loadPanel.enabled', false)
		grid.endUpdate()
	}
}

function onRowClick(e: any) {
	if (e.event.target.closest('.master-detail-section')) {
		return
	}

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

void refreshTableData()
</script>
<style>
.relative {
  position: relative;
}
</style>
