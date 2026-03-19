<template>
  <div class="charts-tab">
    <Filters @filters-changed="onFiltersChanged" />

    <div class="chart-stage">
      <AbitChart :chartData="filteredData" :showValues="showValuesSetting" />

      <v-overlay
        :model-value="loading"
        contained
        class="chart-overlay"
        scrim="rgba(248,250,252,0.7)"
      >
        <v-progress-circular
          indeterminate
          size="52"
          width="4"
          color="primary"
        />
      </v-overlay>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import AbitChart from "@/features/abit-chart/AbitChart.vue";
import Filters from "@/features/abit-chart/FilterChart.vue";
import { chartApiService } from "@/features/abit-chart/api/chartApi";
import { useAbitStore } from "@/entities/abit/model/abitStore";
import { useDbStore } from "@/entities/db/model/dbStore";

const dbStore = useDbStore();
const abitStore = useAbitStore();

interface ChartPoint {
  date: string;
  value: number;
}

const allData = ref<ChartPoint[]>([]);
const currentFilters = ref<Record<string, unknown>>({
  type: null,
  dateStart: null,
  dateEnd: null,
  branch: [],
  academicYear: null,
  levels: [],
  status: [],
  showValues: null,
});
const showValuesSetting = ref<boolean | string | number | null>(null);
const loading = ref(false);
const getSelectedDB = computed(() => dbStore.getSelectedDB);
const getSelectedYear = computed(() => abitStore.getSelectedYear);
const filteredData = computed(() => allData.value);

async function loadData() {
  if (!getSelectedDB.value || !getSelectedYear.value) {
    allData.value = [];
    return;
  }

  loading.value = true;
  try {
    allData.value = (await chartApiService.getAllChartData(
      getSelectedDB.value,
      getSelectedYear.value,
    )) as ChartPoint[];
  } catch (error) {
    console.error("Ошибка при загрузке данных графика:", error);
  } finally {
    loading.value = false;
  }
}

async function onFiltersChanged(filters: Record<string, unknown>) {
  if (!getSelectedDB.value || !getSelectedYear.value) {
    allData.value = [];
    return;
  }

  const { showValues, ...apiFilters } = filters || {};
  showValuesSetting.value = (showValues as boolean | string | number | null) ?? null;
  currentFilters.value = JSON.parse(JSON.stringify(apiFilters || {}));

  loading.value = true;
  try {
    allData.value = (await chartApiService.getFilteredChartData(
      currentFilters.value,
      getSelectedDB.value,
      getSelectedYear.value,
    )) as ChartPoint[];
  } catch (error) {
    console.error("Ошибка при фильтрации данных графика:", error);
  } finally {
    loading.value = false;
  }
}

watch([getSelectedDB, getSelectedYear], () => {
  void loadData();
});

onMounted(() => {
  void loadData();
});
</script>
<style scoped>
.charts-tab {
  position: relative;
  display: grid;
  gap: 10px;
}

.chart-stage {
  position: relative;
}

.chart-overlay {
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart-overlay :deep(.v-overlay__content) {
  margin: 0;
}
</style>
