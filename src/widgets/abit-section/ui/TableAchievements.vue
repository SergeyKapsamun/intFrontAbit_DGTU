<template>
  <div>
    <div>
      {{ getSelectedName }}
    </div>
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
        :export="{ enabled: true, fileName: 'Achievements' }"
        ref="dataGrid"
        :selection="{ mode: 'single', showCheckBoxesMode: 'none' }"
        @exporting="onExporting"
      >
        <DxExport
          :enabled="true"
          :excel-filter-enabled="true"
          :excel-customize-sheet="customizeExcelSheet"
        />
        <DxHeaderFilter :visible="true" />
        <DxToolbar>
          <DxItem name="exportButton" />
        </DxToolbar>

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
          <AchievementDetailCard
            :achievement="data.data"
            @achievement-updated="refreshTableData"
          />
        </template>
      </DxDataGrid>
    </div>
  </div>
</template>
<script setup lang="ts">

import { computed, ref, watch } from 'vue'
import {
  DxColumn,
  DxHeaderFilter,
  DxSearch,
  DxMasterDetail,
  DxDataGrid,
  DxExport,
  DxItem,
  DxToolbar,
} from "devextreme-vue/data-grid";
import { locale, loadMessages } from "devextreme/localization";
import ruMessages from "devextreme/localization/messages/ru.json";
import { AchievementDetailCard } from "@/entities/abit";
import CustomStore from "devextreme/data/custom_store";
import { BASE_URL, endpoints } from "@/entities/abit/api/config";
import { achievementsColumnConfig } from "@/entities/abit/config/achievementsColumnConfig";
import { exportDataGrid } from "devextreme/excel_exporter";
import { Workbook } from "exceljs";
import { saveAs } from "file-saver";
import api from "@/shared/api/http";
import { useAbitStore } from "@/entities/abit/model/abitStore";
import { useDbStore } from "@/entities/db/model/dbStore";

loadMessages(ruMessages);
locale("ru");

const abitStore = useAbitStore();
const dbStore = useDbStore();

const dataGrid = ref(null);
const columnConfig = achievementsColumnConfig;
const getSelectedName = computed(() => abitStore.getSelectedName);
const pendingAchievementLoads = new Map<string, Promise<{ data: any[]; totalCount: number }>>();

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
    key: "code",
    load: (loadOptions: any) => {
      const selectedYear = abitStore.getSelectedYear;
      let baseFilter = loadOptions.filter ? [...loadOptions.filter] : [];

      if (selectedYear) {
        const yearFilter = ["year", "=", parseInt(selectedYear, 10)];
        baseFilter = baseFilter.length > 0 ? [baseFilter, "and", yearFilter] : yearFilter;
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
        primaryKey: ["id"],
        defaultSort: "id",
        stringToLower: true,
        paginateViaPrimaryKey: true,
        sortByPrimaryKey: true,
        allowAsyncOverSync: true,
      };

      const url = new URL(BASE_URL + endpoints.GET_ACHIEVEMENTS);
      Object.keys(payload).forEach((key) => {
        url.searchParams.append(key, payload[key]);
      });

      return loadAchievementGridData(url.toString());
    },
  });
}

const achievementsData = createCustomStore();

async function refreshTableData() {
  if (dataGrid.value?.instance) {
    try {
      await dataGrid.value.instance.getDataSource().reload();
    } catch (error) {
      if (!isCanceledGridError(error)) {
        console.error("Error refreshing achievements grid:", error);
      }
    }
  }
}

function loadAchievementGridData(requestUrl: string) {
  const existingRequest = pendingAchievementLoads.get(requestUrl);
  if (existingRequest) {
    return existingRequest;
  }

  const request = api
    .post(requestUrl, {})
    .then((data) => {
      if (!data) throw new Error("Network response was not ok");
      return {
        data: Array.isArray(data.data) ? data.data : [],
        totalCount: data.totalCount || 0,
      };
    })
    .catch((err) => {
      console.error("DataGrid load error:", err);
      throw err;
    })
    .finally(() => {
      pendingAchievementLoads.delete(requestUrl);
    });

  pendingAchievementLoads.set(requestUrl, request);
  return request;
}

function customizeExcelSheet() {}

async function onExporting(e: any) {
  e.cancel = true;

  const grid = e.component;
  grid.beginUpdate();
  grid.option("loadPanel.enabled", true);

  try {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet("Достижения");

    await exportDataGrid({
      component: grid,
      worksheet,
      topLeftCell: { row: 1, column: 1 },
    });

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), `Достижения_${new Date().toISOString().slice(0, 10)}.xlsx`);
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
  () => abitStore.getSelectedYear,
  () => {
    void refreshTableData();
  },
  { immediate: true },
);
</script>
<style scoped></style>
