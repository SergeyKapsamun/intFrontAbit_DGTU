<template>
  <div class="devxtreme-table-container">
    <div class="v-checkboxes-container">
      <v-checkbox
        v-model="consentFilterEnabled"
        @update:model-value="handleConsentFilterChange"
        label="Согласие!"
        class="v-consent-checkbox"
        hide-details
        density="compact"
        color="primary"
      />
      <v-checkbox
        v-model="moreThanOneFilterEnabled"
        @update:model-value="handleMoreThanOneFilterChange"
        label="больше одного"
        class="v-more-than-one-checkbox"
        hide-details
        density="compact"
        color="primary"
      />
      <v-checkbox
        v-model="standardViewEnabled"
        @update:model-value="handleStandardViewChange"
        label="стандартно"
        class="v-standard-checkbox"
        hide-details
        density="compact"
        color="primary"
      />
      <v-checkbox
        v-model="additionalViewEnabled"
        @update:model-value="handleRefreshData"
        label="С учетом направления"
        class="v-standard-checkbox"
        hide-details
        density="compact"
        color="primary"
      />
    </div>
    <DxDataGrid
      :data-source="abitData"
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
      @cell-prepared="onCellPrepared"
    >
      <DxHeaderFilter :visible="true" />
      <DxExport :enabled="true" file-name="Applicants" />
      <DxFilterPanel :visible="true" />
      <DxFilterBuilderPopup :visible="false" />
      <DxColumn
        v-for="(column, index) in filteredColumnConfig"
        :key="`${column.dataField}_${index}`"
        :data-field="column.dataField"
        :caption="column.caption"
        :width="column.width"
        :alignment="column.alignment"
        :allow-filtering="column.allowFiltering"
        :allow-header-filtering="column.allowHeaderFiltering"
        :data-type="column.dataType"
        :css-class="getColumnCssClass(column.dataField)"
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
        <div class="master-detail-section">
          <ApplicationDetails :data="data.data" />
        </div>
      </template>
    </DxDataGrid>
  </div>
</template>

<style scoped>
.master-detail-section {
  padding: 3px;
  background-color: #f9f9f9;
  border-top: 1px solid #e0e0e0;
}

.master-detail-section h4 {
  margin-top: 0;
  color: #333;
}

.master-detail-section p {
  margin: 8px 0;
  color: #666;
}


.master-detail-section {
  
  -webkit-transform: translateZ(0);
  -moz-transform: translateZ(0);
  -ms-transform: translateZ(0);
  transform: translateZ(0);
}


.green-wave-column {
  background-color: #d4edda !important;
  color: #155724 !important;
  font-weight: bold;
}


.green-wave-cell {
  background-color: #d4edda !important;
  color: #155724 !important;
  font-weight: bold;
  padding: 8px;
  display: block;
  width: 100%;
  height: 100%;
}
</style>

<script setup lang="ts">

import { computed, nextTick, ref, watch } from "vue";
import {
  DxDataGrid,
  DxColumn,
  DxHeaderFilter,
  DxFilterPanel,
  DxFilterBuilderPopup,
  DxSearch,
  DxItem,
  DxExport,
  DxPager,
  DxPaging,
  DxToolbar,
  DxMasterDetail,
} from "devextreme-vue/data-grid";
import CustomStore from "devextreme/data/custom_store";
import { locale, loadMessages } from "devextreme/localization";
import ruMessages from "devextreme/localization/messages/ru.json";
import { Workbook } from "exceljs";
import { saveAs } from "file-saver";
import { ApplicationDetails } from "@/features/application-details";
import api from "@/shared/api/http";
import { BASE_URL, endpoints } from "@/entities/abit/api/config";
import { abitColumnConfig } from "@/entities/abit/config/columnConfig";
import { useAbitStore } from "@/entities/abit/model/abitStore";
import { useDbStore } from "@/entities/db/model/dbStore";

defineOptions({ name: "TableAbit" });

loadMessages(ruMessages);
locale("ru");

const abitStore = useAbitStore();
const dbStore = useDbStore();

const dataGrid = ref(null);
const pageSize = 20;
const columnConfig = abitColumnConfig;

const abitData = ref(null);
const consentFilterEnabled = ref(false);
const moreThanOneFilterEnabled = ref(false);
const standardViewEnabled = ref(true);
const additionalViewEnabled = ref(true);

const filteredColumnConfig = computed(() => {
  if (standardViewEnabled.value) {
    return columnConfig.filter(
      (column) =>
        column.dataField !== "greenWaveFilesCount" &&
        column.dataField !== "reductionFilesCount",
    );
  }
  return columnConfig;
});

function isCanceledGridError(error) {
  const textCandidates = [
    error,
    error?.message,
    error?.name,
    error?.statusText,
    error?.code,
    error?.cause,
    error?.cause?.message,
    error?.response?.statusText,
    error?.response?.data?.message,
    error?.error,
    error?.error?.message,
  ]
    .filter((value) => value != null)
    .map((value) => (typeof value === "string" ? value : String(value)));

  return textCandidates.some((text) =>
    /(cancel(ed|led)?|abort(ed)?|ERR_CANCELED)/i.test(text),
  );
}

function buildGridUrl(payload) {
  const url = new URL(BASE_URL + endpoints.GET_ABIT);

  Object.keys(payload).forEach((key) => {
    url.searchParams.append(key, payload[key]);
  });

  if (consentFilterEnabled.value) {
    url.searchParams.append("Consent", "true");
  }

  if (moreThanOneFilterEnabled.value) {
    url.searchParams.append("MoreThanOne", "true");
  }

  return url;
}

function createCustomStore() {
  return new CustomStore({
    key: "applicationCode",
    load: (loadOptions: any) => {
      const selectedYear = abitStore.getSelectedYear;
      let baseFilter = loadOptions.filter ? [...loadOptions.filter] : [];

      if (selectedYear) {
        const yearFilter = ["recruitmentYear", "=", parseInt(selectedYear, 10)];
        baseFilter =
          baseFilter.length > 0 ? [baseFilter, "and", yearFilter] : yearFilter;
      }

      const payload = {
        requireTotalCount: true,
        requireGroupCount: true,
        isCountQuery: false,
        isSummaryQuery: false,
        skip: loadOptions.skip || 0,
        take: loadOptions.take || 20,
        sort: JSON.stringify(
          (loadOptions.sort || []).map((s) => ({
            selector: s.selector,
            desc: s.desc,
          })),
        ),
        group: JSON.stringify(
          (loadOptions.group || []).map((g) => ({
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
        primaryKey: ["applicationCode"],
        defaultSort: "applicationCode",
        stringToLower: true,
        paginateViaPrimaryKey: true,
        sortByPrimaryKey: true,
        allowAsyncOverSync: true,
      };

      return api
        .post(buildGridUrl(payload).toString(), {})
        .then((data) => {
          if (!data) throw new Error("Network response was not ok");

          return {
            data: Array.isArray(data.data)
              ? data.data.map((row) => ({
                  ...row,
                  scoreSumFull: row.scoreSum + row.additionalScoreId,
                }))
              : [],
            totalCount: data.totalCount || 0,
          };
        })
        .catch((err) => {
          if (!isCanceledGridError(err)) {
            console.error("DataGrid load error:", err);
          }
          throw err;
        });
    },
  });
}

async function refreshTableData() {
  abitData.value = createCustomStore();

  const instance = dataGrid.value?.instance;
  if (!instance) return;

  try {
    await instance.refresh();
  } catch (error) {
    if (!isCanceledGridError(error)) {
      console.error("Error refreshing grid:", error);
    }
  }
}

function handleConsentFilterChange() {
  refreshTableData();
}

function handleMoreThanOneFilterChange() {
  refreshTableData();
}

function handleStandardViewChange() {
  refreshTableData();
}

function handleRefreshData() {
  refreshTableData();
}

function getColumnCssClass(dataField) {
  return dataField === "greenWaveFilesCount" ? "green-wave-column" : "";
}

function onCellPrepared(e) {
  if (e.rowType === "data" && e.column.dataField === "greenWaveFilesCount") {
    e.cellElement.style.backgroundColor = "#d4edda";
    e.cellElement.style.color = "#155724";
    e.cellElement.style.fontWeight = "bold";
  }
}

async function onExporting(e) {
  e.cancel = true;

  const instance = e.component;
  instance.beginUpdate();
  instance.option("loadPanel.enabled", true);

  try {
    const exportData = await fetchExportData();

    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet("Applicants");
    const columns = filteredColumnConfig.value;
    const headers = columns.map((col) => col.caption || col.dataField);

    const headerRow = worksheet.addRow(headers);
    headerRow.font = { bold: true };

    exportData.forEach((row) => {
      worksheet.addRow(columns.map((col) => row[col.dataField]));
    });

    if (exportData.length > 0) {
      worksheet.autoFilter = {
        from: "A1",
        to: `${String.fromCharCode(64 + headers.length)}${exportData.length + 1}`,
      };
    }

    try {
      const buffer = await workbook.xlsx.writeBuffer();
      saveAs(
        new Blob([buffer], { type: "application/octet-stream" }),
        "Applicants.xlsx",
      );
    } catch (bufferError) {
      console.error("Buffer creation failed:", bufferError);
    }
  } catch (error) {
    console.error("Export failed:", error);
  } finally {
    instance.option("loadPanel.enabled", false);
    instance.endUpdate();
  }
}

async function fetchExportData() {
  const instance = dataGrid.value?.instance;
  if (!instance) throw new Error("DataGrid instance not found");

  const filterValue = instance.getCombinedFilter(true);
  const sortValue = instance.getDataSource().sort();
  const groupValue = instance.getDataSource().group();

  const selectedYear = abitStore.getSelectedYear;
  let baseFilter = filterValue ? [...filterValue] : [];

  if (selectedYear) {
    const yearFilter = ["recruitmentYear", "=", parseInt(selectedYear, 10)];
    baseFilter = baseFilter.length > 0 ? [baseFilter, "and", yearFilter] : yearFilter;
  }

  const payload = {
    requireTotalCount: false,
    requireGroupCount: false,
    skip: 0,
    take: 2000,
    sort: JSON.stringify(sortValue || []),
    group: JSON.stringify(groupValue || []),
    filter: JSON.stringify(baseFilter),
    totalSummary: "[]",
    groupSummary: "[]",
  };

  const data = await api.post(buildGridUrl(payload).toString(), {});
  if (!data) throw new Error("Network response was not ok");

  return (data.data || []).map((item) => ({
    ...item,
    scoreSumFull: item.scoreSum + item.additionalScoreId,
  }));
}

function onRowClick(e) {
  if (e.event?.target?.closest(".master-detail-section")) {
    return;
  }

  abitStore.selectAbit(abitStore.getSelectedAbit === e.key ? null : e.key);

  const instance = e.component;
  if (instance.isRowExpanded(e.key)) {
    instance.collapseRow(e.key);
  } else {
    instance.expandRow(e.key);
  }
}

function toQueryParams(obj, prefix) {
  const pairs = [];

  if (Array.isArray(obj)) {
    obj.forEach((value, index) => {
      const pref = prefix ? `${prefix}[${index}]` : index;
      if (typeof value === "object") {
        pairs.push(...toQueryParams(value, pref));
      } else {
        pairs.push(`${encodeURIComponent(pref)}=${encodeURIComponent(value)}`);
      }
    });
    return pairs;
  }

  for (const key in obj) {
    if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;

    const value = obj[key];
    const pref = prefix ? `${prefix}[${key}]` : key;

    if (typeof value === "object" && value !== null) {
      pairs.push(...toQueryParams(value, pref));
    } else {
      pairs.push(`${encodeURIComponent(pref)}=${encodeURIComponent(value)}`);
    }
  }

  return pairs;
}

watch(
  () => dbStore.getSelectedDB,
  () => {
    refreshTableData();
  },
);

watch(
  () => abitStore.getSelectedAbit,
  async (selectedAbit) => {
    await nextTick();
    if (dataGrid.value?.instance && !selectedAbit) {
      dataGrid.value.instance.deselectAll();
    }
  },
);

watch(
  () => abitStore.getSelectedYear,
  () => {
    refreshTableData();
  },
  { immediate: true },
);
</script>
<style>
.relative {
  position: relative;
}

.master-detail-section {
  padding: 5px;
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

.v-checkboxes-container {
  margin-bottom: 10px;
  display: flex;
  gap: 20px;
  align-items: center;
  padding: 0 10px 10px;
  background-color: #f5f5f5;
  border-radius: 4px;
  flex-wrap: wrap;
  color: #000;
}

.v-consent-checkbox,
.v-more-than-one-checkbox,
.v-standard-checkbox {
  margin-bottom: 0;
  margin-right: 10px;
  margin: 10px;
}

.v-checkboxes-container :deep(.v-input) {
  flex: 0 0 auto;
  margin: 0;
}

.v-checkboxes-container :deep(.v-selection-control) {
  min-height: 32px;
}

.v-checkboxes-container :deep(.v-label) {
  color: #000 !important;
  font-weight: 500;
}

.v-checkboxes-container :deep(.v-selection-control--dirty .v-selection-control__input > .v-icon) {
  color: #6495ed !important;
}
</style>
