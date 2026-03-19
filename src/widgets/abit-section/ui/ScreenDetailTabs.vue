<template>
	<div class="screen-detail-tabs">
		
		<div v-if="!getSelectedYear" class="no-year-message">
			год не выбран
		</div>

		<div v-else>
			<v-tabs
				v-model="tab"
				color="primary"
				show-arrows
				align-tabs="start"
				class="screen-tabs"
			>
				<v-tab v-for="item in tabLabels" :key="item.value" :value="item.value">
					{{ item.label }}
				</v-tab>
			</v-tabs>
			<v-divider />

			<v-window v-model="tab" :touch="false">
				<v-window-item v-for="n in 8" :key="n" :value="n">
					<div class="tab-content">
						<DxDataGrid
							:ref="`dataGrid${n}`"
							:data-source="getTabData(n)"
							:show-borders="true"
							:column-auto-width="true"
							:allow-column-resizing="true"
							:remote-operations="true"
							:load-panel="{ enabled: true }"
						>
							<DxColumn
								v-for="col in tableColumns"
								:key="col.dataField"
								:data-field="col.dataField"
								:caption="col.caption"
								:width="col.width"
								:data-type="col.dataType"
								:alignment="col.alignment"
								:allow-filtering="col.allowFiltering"
								:allow-header-filtering="col.allowHeaderFiltering"
							/>
							<DxPager
								:visible="true"
								:show-page-size-selector="true"
								:allowed-page-sizes="[10, 20, 50, 100, 200]"
								:display-mode="'adaptive'"
							/>
							<DxPaging :page-size="10" />
						</DxDataGrid>
					</div>
				</v-window-item>
			</v-window>
		</div>
	</div>
</template>

<script setup lang="ts">

import { onMounted, ref, watch } from 'vue'
import {
	DxDataGrid,
	DxColumn,
	DxPager,
	DxPaging,
	DxLoadPanel,
	DxSummary,
	DxTotalItem,
} from 'devextreme-vue/data-grid'
import { locale, loadMessages } from 'devextreme/localization'
import ruMessages from 'devextreme/localization/messages/ru.json'
import CustomStore from 'devextreme/data/custom_store'
import { endpoints } from '@/entities/abit/api/config'
import { screenDetailGridConfig } from '@/entities/abit/config/screenDetailConfig'
import api from '@/shared/api/http'
import { BASE_URL } from '@/entities/abit/api/config'
import { useAbitStore } from '@/entities/abit/model/abitStore'

const props = defineProps({
	data: {
		type: Object,
		default: () => ({}),
	},
})

loadMessages(ruMessages)
locale('ru')

const abitStore = useAbitStore()
const getSelectedYear = ref(abitStore.getSelectedYear)
const tab = ref<number | null>(1)
const tableColumns = screenDetailGridConfig
const tabLabels = [
	{ value: 1, label: 'Б' },
	{ value: 2, label: 'ЦП' },
	{ value: 3, label: 'К' },
	{ value: 4, label: 'ДО' },
	{ value: 5, label: 'ОП' },
	{ value: 6, label: 'МинОбр' },
	{ value: 7, label: 'ОК' },
	{ value: 8, label: 'СВК' },
]

const tabStores = ref<Record<number, any>>({
	1: null,
	2: null,
	3: null,
	4: null,
	5: null,
	6: null,
	7: null,
	8: null,
})

function getTabData(tabNumber: number) {
	return tabStores.value[tabNumber] || null
}

function createTabStore(tabType: string) {
	return new CustomStore({
		key: 'id',
		load: (loadOptions: any) => {
			const selectedYear = abitStore.getSelectedYear
			if (!selectedYear) {
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
			}

			const url = new URL(BASE_URL + endpoints.GET_SCREEN_DETAIL)
			Object.keys(payload).forEach(key => {
				url.searchParams.append(key, payload[key])
			})
			url.searchParams.append('year', selectedYear)

			if (props.data?.formCodeFromSpecialties) {
				url.searchParams.append('eduFormCode', props.data.formCodeFromSpecialties)
			}
			url.searchParams.append('trainingType', tabType)
			url.searchParams.append('consentMode', '0')
			if (props.data?.specialtyCode) {
				url.searchParams.append('specialtyCode', props.data.specialtyCode)
			}

			return api
				.post(url.toString(), {})
				.then(data => {
					if (!data) {
						throw new Error(`Network response was not ok for ${tabType}`)
					}
					return {
						data: Array.isArray(data.data) ? data.data : [],
						totalCount: data.totalCount || 0,
					}
				})
				.catch(err => {
					console.error(`DataGrid ${tabType} load error:`, err)
					return {
						data: [],
						totalCount: 0,
					}
				})
		},
	})
}

function initializeTabs() {
	tabStores.value[1] = createTabStore('1')
	tabStores.value[2] = createTabStore('2')
	tabStores.value[3] = createTabStore('3')
	tabStores.value[4] = createTabStore('4')
	tabStores.value[5] = createTabStore('5')
	tabStores.value[6] = createTabStore('6')
	tabStores.value[7] = createTabStore('7')
	tabStores.value[8] = createTabStore('8')
}

onMounted(() => {
	tab.value = 1
	initializeTabs()
})

watch(
	() => abitStore.getSelectedYear,
	value => {
		getSelectedYear.value = value
		initializeTabs()
	},
)

watch(
	() => [props.data?.specialtyCode, props.data?.formCodeFromSpecialties],
	() => {
		initializeTabs()
	},
)
</script>

<style scoped>
.screen-detail-tabs {
	width: 100%;
	height: 100%;
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

.tab-content {
	padding: 20px;
	min-height: 400px;
}

.screen-tabs {
	margin-bottom: 4px;
}

.tab-content h3 {
	margin-top: 0;
	color: #333;
	border-bottom: 1px solid #eee;
	padding-bottom: 10px;
}

.dx-datagrid {
	margin-top: 15px;
}
</style>
