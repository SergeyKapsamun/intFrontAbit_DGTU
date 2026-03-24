<template>
  <div class="discipline-table-container">
    
    <div v-if="!getSelectedYear" class="no-year-message">
      год не выбран
    </div>

    <div v-else class="layout">
      <div class="entity-panel">
        <div class="entity-list">
          <div
            v-for="entity in entityList"
            :key="entity.id + entity.name + entity.examTypeCode"
            class="entity-item"
            :class="{
              active: selectedEntity && selectedEntity.id === entity.id,
            }"
            @click="selectEntity(entity)"
          >
            {{ entity.name }}
          </div>
        </div>
      </div>

      <div class="table-panel">
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
          :grouping="{ autoExpandAll: false }"
          ref="dataGrid"
          :selection="{ mode: 'single', showCheckBoxesMode: 'none' }"
          @exporting="onExporting"
        >
          <DxHeaderFilter :visible="true" />
          <DxExport :enabled="true" :file-name="getExportFileName()" />
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
          >
            <DxHeaderFilter
              :allow-select-all="column.headerFilterAllowSelectAll !== false"
            >
              <DxSearch :enabled="true" />
            </DxHeaderFilter>
          </DxColumn>
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
        </DxDataGrid>
      </div>
    </div>
  </div>
</template>

<style scoped>
.discipline-table-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}

.no-year-message {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 18px;
  color: #666;
  font-style: italic;
  text-align: center;
}

.layout {
  display: flex;
  flex: 1;
  height: 100%;
}

.entity-panel {
  width: 250px;
  border-right: 1px solid #ddd;
  padding: 16px;
  overflow-y: auto;
  color: #000 !important;
}

.entity-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.entity-item {
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
  color: #000 !important;
}

.entity-item:hover {
  background-color: #f0f0f0;
}

.entity-item.active {
  background-color: #e3f2fd;
  border-color: #2196f3;
  font-weight: bold;
  color: #000 !important;
}

.table-panel {
  flex: 1;
  padding: 16px;
  overflow: hidden;
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

import { computed, ref, watch } from 'vue'
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
} from 'devextreme-vue/data-grid'

import CustomStore from 'devextreme/data/custom_store'
import { locale, loadMessages } from 'devextreme/localization'
import ruMessages from 'devextreme/localization/messages/ru.json'

import { endpoints } from '@/entities/abit/api/config'
import { Workbook } from 'exceljs'
import { saveAs } from 'file-saver'
import { getDiscipline } from '@/entities/abit/model/api'
import { disciplineConfig } from '@/entities/abit/config/disciplineCnfig'
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
const entityList = ref([])
const selectedEntity = ref(null)
const tableColumns = disciplineConfig
const getSelectedYear = computed(() => abitStore.getSelectedYear)
const pendingGridLoads = new Map<string, Promise<{ data: any[]; totalCount: number }>>()

function getDisciplineEntityValue(item: any, keys: string[]) {
	for (const key of keys) {
		const value = item?.[key]
		if (value !== undefined && value !== null && value !== '') {
			return value
		}
	}

	return null
}

function appendSearchParams(url: URL, params: Record<string, any>) {
	Object.entries(params).forEach(([key, value]) => {
		if (value !== undefined && value !== null && value !== '') {
			url.searchParams.append(key, String(value))
		}
	})
}

function getExportFileName() {
	if (selectedEntity.value) {
		const cleanName = selectedEntity.value.name
			.replace(/[^a-zA-Zа-яА-Я0-9\s]/g, '_')
			.replace(/\s+/g, '_')
		return `Discipline_${cleanName}`
	}
	return 'Discipline_Data'
}

async function loadEntityList() {
	try {
		const db = dbStore.getSelectedDB
		const year = abitStore.getSelectedYear

		if (!year) {
			entityList.value = []
			selectedEntity.value = null
			refreshTableData()
			return
		}

		const response = await getDiscipline(db, year)
		if (Array.isArray(response)) {
			entityList.value = response
				.map(item => {
					const disciplineCode = getDisciplineEntityValue(item, [
						'DisciplineCode',
						'disciplineCode',
						'disciplineId',
						'id',
					])
					const disciplineName = getDisciplineEntityValue(item, [
						'Discipline',
						'discipline',
						'name',
					])
					const examTypeCode = getDisciplineEntityValue(item, [
						'ExamTypeCode',
						'examTypeCode',
						'examType',
					])

					if (!disciplineCode || !disciplineName) {
						return null
					}

					return {
						id: disciplineCode,
						name: disciplineName,
						disciplineCode,
						disciplineId: disciplineCode,
						examTypeCode,
					}
				})
				.filter(Boolean)

			if (entityList.value.length > 0 && !selectedEntity.value) {
				selectEntity(entityList.value[0])
			}
		}
	} catch (error) {
		console.error('Error loading entity list:', error)
	}
}

function selectEntity(entity: any) {
	if (
		selectedEntity.value?.id === entity?.id &&
		selectedEntity.value?.examTypeCode === entity?.examTypeCode
	) {
		return
	}

	selectedEntity.value = entity
}

function createCustomStore() {
	return new CustomStore({
		key: 'id',
		load: (loadOptions: any) => {
			if (!abitStore.getSelectedYear || !selectedEntity.value) {
				return Promise.resolve({
					data: [],
					totalCount: 0,
				})
			}

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
				examType: selectedEntity.value?.examTypeCode,
				inGroup: false,
				year: abitStore.getSelectedYear,
			}

			const endpoint = endpoints.GET_DISCIPLINE(
				selectedEntity.value?.disciplineCode || selectedEntity.value?.id,
			)

			const url = new URL(BASE_URL + endpoint)
			appendSearchParams(url, payload)

			return loadGridData(url.toString())
		},
	})
}

const tableData = createCustomStore()

function refreshTableData() {
	const gridInstance = dataGrid.value?.instance
	if (gridInstance?.getDataSource) {
		void gridInstance.getDataSource().reload()
	}
}

function refreshEntityList() {
	void loadEntityList()
}

function loadGridData(requestUrl: string) {
	const existingRequest = pendingGridLoads.get(requestUrl)
	if (existingRequest) {
		return existingRequest
	}

	const request = api
		.post(requestUrl, {})
		.then(data => {
			if (!data) throw new Error('Network response was not ok')
			return {
				data: Array.isArray(data.data)
					? data.data.map((row, i) => ({
							...row,
							id: i,
							scoreSumFull:
								(row.scoreSum || 0) + (row.additionalScoreId || 0),
					  }))
					: [],
				totalCount: data.totalCount || 0,
			}
		})
		.catch(err => {
			console.error('DataGrid load error:', err)
			if (err.response && err.response.status === 400) {
				return {
					data: [],
					totalCount: 0,
				}
			}
			throw err
		})
		.finally(() => {
			pendingGridLoads.delete(requestUrl)
		})

	pendingGridLoads.set(requestUrl, request)
	return request
}

async function fetchExportData() {
	if (!abitStore.getSelectedYear) {
		return []
	}

	const grid = dataGrid.value?.instance
	if (!grid) throw new Error('DataGrid instance not found')

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
			examType: selectedEntity.value?.examTypeCode,
			inGroup: false,
			year: abitStore.getSelectedYear,
		}

		const endpoint = endpoints.GET_DISCIPLINE(
			selectedEntity.value?.disciplineCode || selectedEntity.value?.id,
		)
		const url = new URL(BASE_URL + endpoint)
		appendSearchParams(url, payload)

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

	return allData.map(item => ({
		...item,
		scoreSumFull: (item.scoreSum || 0) + (item.additionalScoreId || 0),
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
		const worksheet = workbook.addWorksheet('Discipline Data')
		const headers = tableColumns.map(col => col.caption || col.dataField)

		const headerRow = worksheet.addRow(headers)
		headerRow.font = { bold: true }

		exportData.forEach(row => {
			const dataRow = tableColumns.map(col => {
				const value = row[col.dataField]
				if (typeof value === 'boolean') {
					return value ? 'Да' : 'Нет'
				}
				if (col.dataType === 'date' && value) {
					return new Date(value)
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
			`${getExportFileName()}_${new Date().toISOString().slice(0, 10)}.xlsx`,
		)
	} catch (error) {
		console.error('Export failed:', error)
	} finally {
		grid.option('loadPanel.enabled', false)
		grid.endUpdate()
	}
}

watch(
	() => dbStore.getSelectedDB,
	() => {
		refreshEntityList()
	},
)

watch(
	() => abitStore.getSelectedYear,
	() => {
		refreshEntityList()
	},
	{ immediate: true },
)

watch(
	selectedEntity,
	() => {
		refreshTableData()
	},
	{ immediate: true },
)
</script>
<style>
.relative {
  position: relative;
}
</style>
