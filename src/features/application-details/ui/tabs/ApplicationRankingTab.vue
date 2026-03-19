<template>
  <div class="w-100">
    <div class="toolbar">
      <label>
        <input
          type="checkbox"
          v-model="rswithsogl"
          @change="onRsWithSoglChanged"
        />
        Показать с согласием
      </label>
    </div>

    <DxDataGrid
      ref="dataGrid"
      v-if="rankData"
      :data-source="rankData"
      :key-expr="'id'"
      :allow-column-resizing="true"
      :allow-column-reordering="true"
      :column-min-width="70"
      :show-borders="false"
      :column-resizing-mode="'widget'"
      :width="'100%'"
      :column-auto-width="true"
      :word-wrap-enabled="true"
      :scrolling="{
        mode: 'standard',
        showScrollbar: 'always',
        useNative: true,
        scrollByContent: true,
        scrollByThumb: true,
      }"
      :paging="{
        enabled: true,
        pageSize: 50,
      }"
      :pager="{
        visible: true,
        showPageSizeSelector: true,
        allowedPageSizes: [10, 20, 50, 100],
        showInfo: true,
      }"
      @content-ready="onContentReady"
      @row-prepared="onRowPrepared"
      @data-source-changed="onDataSourceChanged"
      @drawn="onDrawn"
      @page-changed="onPageChanged"
      :focused-row-enabled="true"
      :selection="{ mode: 'single', showCheckBoxesMode: 'none' }"
    >
      <DxHeaderFilter :visible="true" />
      <DxColumn
        v-for="(col, index) in rankingconfig"
        :key="`${col.dataField}_${index}`"
        :data-field="col.dataField"
        :caption="col.caption"
        :width="col.width"
        :allow-filtering="true"
        :allow-header-filtering="true"
        :data-type="col.dataType"
      >
      </DxColumn>
    </DxDataGrid>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from "vue";
import { getAppRanking } from "../../model/api.ts";
import { DxDataGrid, DxColumn, DxHeaderFilter } from "devextreme-vue/data-grid";
import { rankingconfig } from "./rankingconfig";
import { useAbitStore } from "@/entities/abit/model/abitStore";

interface Props {
  data?: {
    id?: number | null;
    okso?: string | null;
    planNabora?: number | null;
  } | null;
}

const props = defineProps<Props>();
const abitStore = useAbitStore();

const dataGrid = ref<any>(null);
const rankData = ref<any[] | null>(null);
const scrolledToPerson = ref(false);
const rswithsogl = ref(false);
const getSelectedYear = computed(() => abitStore.getSelectedYear);

function formatBooleanNullValue(value: unknown) {
  if (value === null || value === undefined) {
    return "-";
  }

  if (typeof value === "boolean") {
    return value ? "да" : "нет";
  }

  if (typeof value === "string") {
    const lowerValue = value.toLowerCase();
    if (lowerValue === "true" || lowerValue === "1") {
      return "да";
    } else if (lowerValue === "false" || lowerValue === "0") {
      return "нет";
    }
  }

  if (typeof value === "number") {
    if (value === 1) {
      return "да";
    } else if (value === 0) {
      return "нет";
    }
  }

  return value;
}

async function onRsWithSoglChanged() {
  await loadData();
}

async function loadData() {
  rankData.value = null;
  scrolledToPerson.value = false;

  if (props.data?.okso && props.data?.planNabora != null && getSelectedYear.value) {
    rankData.value = await getAppRanking(
      props.data.okso,
      getSelectedYear.value,
      props.data.planNabora,
      rswithsogl.value,
    );

    void nextTick(() => {
      void scrollToCurrentPerson();
    });
  }
}

async function scrollToCurrentPerson() {
  if (!props.data?.id || !rankData.value) {
    return;
  }

  const currentPersonId = props.data.id;
  const instance = dataGrid.value?.instance;
  if (!instance) {
    return;
  }

  const currentPerson = rankData.value.find((person) => person.id === currentPersonId);
  if (!currentPerson) {
    return;
  }

  const personIndex = rankData.value.findIndex((person) => person.id === currentPersonId);
  if (personIndex === -1) {
    return;
  }

  try {
    const pageSize = instance.pageSize();
    const pageNumber = Math.floor(personIndex / pageSize);

    if (pageNumber !== instance.pageIndex()) {
      instance.pageIndex(pageNumber);
      await new Promise((resolve) => setTimeout(resolve, 300));
    }

    instance.option("focusedRowKey", currentPersonId);
    await nextTick();
    await new Promise((resolve) => setTimeout(resolve, 100));
    instance.navigateToRow(currentPersonId);
  } catch (error) {
    setTimeout(() => {
      try {
        const fallbackInstance = dataGrid.value?.instance;
        if (fallbackInstance) {
          fallbackInstance.option("focusedRowKey", currentPersonId);
          fallbackInstance.navigateToRow(currentPersonId);
        }
      } catch {
        
      }
    }, 200);
  }
}

function onContentReady() {
  if (props.data && rankData.value && !scrolledToPerson.value) {
    scrolledToPerson.value = true;
    setTimeout(() => {
      void scrollToCurrentPerson();
    }, 300);
  }
}

function onRowPrepared() {}

function onDataSourceChanged() {
  scrolledToPerson.value = false;
}

function onDrawn() {
  if (props.data && rankData.value && !scrolledToPerson.value) {
    scrolledToPerson.value = true;
    setTimeout(() => {
      void scrollToCurrentPerson();
    }, 150);
  }
}

function onPageChanged() {
  const currentPersonId = props.data?.id;
  if (currentPersonId) {
    setTimeout(() => {
      void scrollToCurrentPerson();
    }, 100);
  }
}

watch(
  () => [props.data?.okso, props.data?.planNabora, getSelectedYear.value] as const,
  () => {
    void loadData();
  },
  { immediate: true },
);

defineExpose({
  scrollToCurrentPerson,
});
</script>

<style scoped>
.toolbar {
  margin-bottom: 10px;
  padding: 10px;
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.toolbar label {
  font-weight: normal;
  cursor: pointer;
  user-select: none;
}
</style>
