<template>
  <div class="chart-container">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import Chart from "chart.js/auto";
import { onBeforeUnmount, onMounted, ref, watch } from "vue";

interface ChartPoint {
  date: string;
  value: number;
}

type ShowValues = boolean | string | number | null;

interface Props {
  chartData?: ChartPoint[];
  showValues?: ShowValues;
}

const props = withDefaults(defineProps<Props>(), {
  chartData: () => [],
  showValues: null,
});

const chartCanvas = ref<HTMLCanvasElement | null>(null);
const chart = ref<Chart | null>(null);

function renderChart() {
  const ctx = chartCanvas.value?.getContext("2d");
  if (!ctx) {
    return;
  }

  let tooltipEnabled = true;
  let pointRadius = 4;
  let pointHoverRadius = 6;

  if (
    props.showValues === false ||
    props.showValues === "false" ||
    props.showValues === 0
  ) {
    tooltipEnabled = false;
    pointRadius = 2;
    pointHoverRadius = 4;
  } else if (props.showValues === "tooltip" || props.showValues === 2) {
    tooltipEnabled = true;
    pointRadius = 4;
    pointHoverRadius = 6;
  } else if (props.showValues === "labels" || props.showValues === 3) {
    tooltipEnabled = true;
    pointRadius = 6;
    pointHoverRadius = 8;
  } else {
    tooltipEnabled = true;
    pointRadius = 6;
    pointHoverRadius = 8;
  }

  chart.value = new Chart(ctx, {
    type: "line",
    data: getChartData() as any,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        tooltip: {
          enabled: tooltipEnabled,
        },
        legend: {
          display: true,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
        },
      },
      interaction: {
        mode: "index",
        intersect: false,
      },
    },
  });
}

function updateChart() {
  if (chart.value) {
    chart.value.destroy();
  }
  renderChart();
}

function getChartData() {
  const groupedData = groupByDate(props.chartData || []);

  const dataset: Record<string, unknown> = {
    label: "Количество",
    backgroundColor: "#f87979",
    borderColor: "#ff6384",
    data: Object.values(groupedData),
    fill: false,
  };

  if (
    props.showValues === false ||
    props.showValues === "false" ||
    props.showValues === 0
  ) {
    dataset.pointRadius = 2;
    dataset.pointHoverRadius = 4;
  } else if (props.showValues === "tooltip" || props.showValues === 2) {
    dataset.pointRadius = 4;
    dataset.pointHoverRadius = 6;
  } else if (props.showValues === "labels" || props.showValues === 3) {
    dataset.pointRadius = 6;
    dataset.pointHoverRadius = 8;
  } else {
    dataset.pointRadius = 6;
    dataset.pointHoverRadius = 8;
  }

  if (props.showValues === "labels" || props.showValues === 3) {
    dataset.pointStyle = "circle";
    dataset.pointBackgroundColor = "#ff6384";
    dataset.pointBorderColor = "#fff";
    dataset.pointBorderWidth = 1;
  }

  return {
    labels: Object.keys(groupedData),
    datasets: [dataset],
  };
}

function groupByDate(data: ChartPoint[]) {
  const grouped: Record<string, number> = {};
  data.forEach((item) => {
    const date = item.date;
    if (!grouped[date]) {
      grouped[date] = 0;
    }
    grouped[date] += item.value;
  });
  return grouped;
}

watch(
  () => props.chartData,
  () => {
    updateChart();
  },
  { deep: true },
);

watch(
  () => props.showValues,
  () => {
    updateChart();
  },
);

onMounted(() => {
  renderChart();
});

onBeforeUnmount(() => {
  if (chart.value) {
    chart.value.destroy();
  }
});
</script>

<style scoped>
.chart-container {
  min-height: 300px; 
}

@media (min-width: 769px) and (max-width: 1024px) {
  .chart-container {
    min-height: 450px; 
  }
}

@media (min-width: 1025px) {
  .chart-container {
    min-height: 600px; 
  }
}
</style>
