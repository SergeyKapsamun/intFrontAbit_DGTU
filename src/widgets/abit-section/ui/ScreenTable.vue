<template>
  <div class="devxtreme-table-container">
    
    <div v-if="!getSelectedYear" class="no-year-message">
      год не выбран
    </div>

    <div v-else>
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
        <DxSummary>
          <DxTotalItem
            v-for="(col, i) in summaryColumns.filter((c) => c.dataField)"
            :key="col.dataField + '_' + i"
            :column="col.dataField"
            :summary-type="col.summaryType"
            :value-format="col.format"
            :display-format="col.displayFormat || '{0}'"
          />
        </DxSummary>
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
            <ScreenDetailTabs :data="data.data" />
          </div>
        </template>
      </DxDataGrid>
    </div>
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
</style>

<script setup lang="ts">

import { computed, nextTick, ref, watch } from 'vue'
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
  DxSummary,
  DxTotalItem,
} from "devextreme-vue/data-grid";

import CustomStore from "devextreme/data/custom_store";
import { locale, loadMessages } from "devextreme/localization";
import ruMessages from "devextreme/localization/messages/ru.json";

import { screenConfig } from "@/entities/abit/config/screenConfig.ts";
import { BASE_URL, endpoints } from "@/entities/abit/api/config.ts";
import { Workbook } from "exceljs";
import { saveAs } from "file-saver";
import ScreenDetailTabs from "./ScreenDetailTabs.vue";
import api from "@/shared/api/http";
import { useAbitStore } from "@/entities/abit/model/abitStore";
import { useDbStore } from "@/entities/db/model/dbStore";

loadMessages(ruMessages);
locale("ru");

const abitStore = useAbitStore();
const dbStore = useDbStore();

const dataGrid = ref(null);
const pageSize = 20;
const columnConfig = screenConfig;
const abitData = ref(null);
const getSelectedYear = computed(() => abitStore.getSelectedYear);

const summaryColumns = computed(() =>
  columnConfig
    .filter((column) => column.dataType === "number")
    .map((column) => ({
      dataField: column.dataField,
      summaryType: "sum",
      format: { type: "fixedPoint", precision: 0 },
      displayFormat: "{0}",
    })),
);

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
        "",
    ),
  );
}

function createCustomStore() {
  return new CustomStore({
    key: "id",
    load: (loadOptions: any) => {
      const selectedYear = abitStore.getSelectedYear;
      if (!selectedYear) {
        return Promise.resolve({
          data: [],
          totalCount: 0,
          summary: [],
        });
      }

      const baseFilter = loadOptions.filter ? [...loadOptions.filter] : [];
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
        primaryKey: ["id"],
        defaultSort: "id",
        stringToLower: true,
        paginateViaPrimaryKey: true,
        sortByPrimaryKey: true,
        allowAsyncOverSync: true,
      };

      const url = new URL(BASE_URL + endpoints.GET_SCREEN);
      Object.keys(payload).forEach((key) => {
        url.searchParams.append(key, payload[key]);
      });
      url.searchParams.append("year", selectedYear);

      return api
        .post(url.toString(), {})
        .then((data) => {
          if (!data) throw new Error("Network response was not ok");
          return {
            data: Array.isArray(data.data)
              ? data.data.map((row) => ({
                  ...row,
                  id: row.specialtyCode,
                  scoreSumFull: (row.scoreSum || 0) + (row.additionalScoreId || 0),
                }))
              : [],
            totalCount: data.totalCount || 0,
            summary: data.summary || [],
          };
        })
        .catch((err) => {
          console.error("DataGrid load error:", err);
          if (err.response && err.response.status === 400) {
            return {
              data: [],
              totalCount: 0,
              summary: [],
            };
          }
          throw err;
        });
    },
  });
}

async function refreshTableData() {
  abitData.value = createCustomStore();

  if (dataGrid.value?.instance) {
    try {
      await dataGrid.value.instance.refresh();
    } catch (error) {
      if (!isCanceledGridError(error)) {
        console.error("Error refreshing grid:", error);
      }
    }
  }
}

async function fetchExportData() {
  const selectedYear = abitStore.getSelectedYear;
  if (!selectedYear) {
    return [];
  }

  const grid = dataGrid.value?.instance;
  if (!grid) throw new Error("DataGrid instance not found");

  const filterValue = grid.getCombinedFilter(true);
  const sortValue = grid.getDataSource().sort();
  const groupValue = grid.getDataSource().group();
  const baseFilter = filterValue ? [...filterValue] : [];

  let allData = [];
  let skip = 0;
  const take = 1000;
  let hasMore = true;

  while (hasMore) {
    const payload = {
      requireTotalCount: false,
      requireGroupCount: false,
      skip,
      take,
      sort: JSON.stringify(sortValue || []),
      group: JSON.stringify(groupValue || []),
      filter: JSON.stringify(baseFilter),
      totalSummary: "[]",
      groupSummary: "[]",
    };

    const url = new URL(BASE_URL + endpoints.GET_SCREEN);
    Object.keys(payload).forEach((key) => {
      url.searchParams.append(key, payload[key]);
    });
    url.searchParams.append("year", selectedYear);

    const data = await api.post(url.toString(), {});
    if (!data) {
      throw new Error("API call failed");
    }

    if (data.data && data.data.length > 0) {
      allData = allData.concat(data.data);
      skip += take;
      if (data.data.length < take) {
        hasMore = false;
      }
    } else {
      hasMore = false;
    }
  }

  return allData.map((item) => ({
    ...item,
    scoreSumFull: (item.scoreSum || 0) + (item.additionalScoreId || 0),
  }));
}

async function onExporting(e: any) {
  e.cancel = true;

  const grid = e.component;
  grid.beginUpdate();
  grid.option("loadPanel.enabled", true);

  try {
    const exportData = await fetchExportData();
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet("Applicants");

    const headers = columnConfig.map((col) => col.caption || col.dataField);
    const headerRow = worksheet.addRow(headers);
    headerRow.font = { bold: true };

    exportData.forEach((row) => {
      const dataRow = columnConfig.map((col) => {
        const value = row[col.dataField];
        if (typeof value === "boolean") {
          return value ? "Да" : "Нет";
        }
        if (col.dataType === "date" && value) {
          return new Date(value);
        }
        return value;
      });
      worksheet.addRow(dataRow);
    });

    if (exportData.length > 0) {
      const lastColumnLetter = String.fromCharCode(64 + headers.length);
      worksheet.autoFilter = {
        from: "A1",
        to: `${lastColumnLetter}${exportData.length + 1}`,
      };
    }

    worksheet.columns.forEach((column, index) => {
      let maxLength = headers[index] ? headers[index].toString().length : 0;
      exportData.forEach((row) => {
        const cellValue = row[columnConfig[index]?.dataField];
        if (cellValue && cellValue.toString().length > maxLength) {
          maxLength = cellValue.toString().length;
        }
      });
      column.width = Math.min(maxLength + 2, 50);
    });

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(
      new Blob([buffer], { type: "application/octet-stream" }),
      `Screen_${new Date().toISOString().slice(0, 10)}.xlsx`,
    );
  } catch (error) {
    console.error("Export failed:", error);
  } finally {
    grid.option("loadPanel.enabled", false);
    grid.endUpdate();
  }
}

watch(
  () => dbStore.getSelectedDB,
  () => {
    void refreshTableData();
  },
);

watch(
  () => abitStore.getSelectedAbit,
  async (value) => {
    await nextTick();
    if (dataGrid.value?.instance && !value) {
      dataGrid.value.instance.deselectAll();
    }
  },
);

watch(
  () => abitStore.getSelectedYear,
  () => {
    void refreshTableData();
  },
  { immediate: true },
);

abitData.value = createCustomStore();
</script>
<style>
.relative {
  position: relative;
}
</style>
