<template>
  <main class="page">
    <section class="shell">
      <header class="header">
        <div>
          <h1>Абитуриенты ДГТУ</h1>
        </div>
        <div v-if="dbStore.getIp" class="chip">IP: {{ dbStore.getIp }}</div>
      </header>

      <section class="controls">
        <v-select
          v-model="selectedYear"
          :items="yearItems"
          label="Выберите год"
          variant="outlined"
          density="comfortable"
          hide-details
          clearable
          class="year-select"
        />
      </section>

      <p v-if="loadError" class="error">{{ loadError }}</p>

      <section class="table-wrap">
        <v-tabs
          v-model="activeTab"
          color="primary"
          show-arrows
          class="abit-tabs"
          align-tabs="start"
        >
          <v-tab v-for="item in tabs" :key="item.id" :value="item.id">
            {{ item.label }}
          </v-tab>
        </v-tabs>
        <v-divider class="mt-2" />

        <v-window v-model="activeTab" class="tab-window" :touch="false">
          <v-window-item value="abit">
            <TableAbit />
          </v-window-item>
          <v-window-item value="achievements">
            <TableAchievements />
          </v-window-item>
          <v-window-item value="documents">
            <TableDocuments />
          </v-window-item>
          <v-window-item value="chart">
            <ChartsTab />
          </v-window-item>
          <v-window-item value="phys">
            <TableAbitUser />
          </v-window-item>
          <v-window-item value="disciplines">
            <TableDiscipline />
          </v-window-item>
          <v-window-item value="crm">
            <TableCrm />
          </v-window-item>
          <v-window-item value="screen">
            <ScreenTable />
          </v-window-item>
        </v-window>
      </section>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import {
  TableAbit,
  TableAchievements,
  TableDocuments,
  ChartsTab,
  TableAbitUser,
  TableDiscipline,
  TableCrm,
  ScreenTable,
} from "@/widgets/abit-section";
import { useAbitStore } from "@/entities/abit/model/abitStore";
import { useDbStore } from "@/entities/db/model/dbStore";

const dbStore = useDbStore();
const abitStore = useAbitStore();

const loadError = ref("");
const activeTab = ref("abit");
const tabs = [
  { id: "abit", label: "Абитуриенты" },
  { id: "achievements", label: "Достижения" },
  { id: "documents", label: "Документы" },
  { id: "chart", label: "График" },
  { id: "phys", label: "Список абитуриентов (физ. лиц)" },
  { id: "disciplines", label: "Сводка по дисциплинам" },
  { id: "crm", label: "Сообщения чата" },
  { id: "screen", label: "Экран" },
];

const yearItems = computed(() =>
  (dbStore.getYears || []).map((year) => {
    const parsed = Number.parseInt(String(year), 10);
    return Number.isNaN(parsed) ? year : parsed;
  }),
);

const selectedYear = computed({
  get() {
    return abitStore.getSelectedYear ?? null;
  },
  set(value) {
    if (value === null || value === undefined || value === "") {
      abitStore.selectYear(null);
      return;
    }

    const year = Number.parseInt(String(value), 10);
    if (!Number.isNaN(year)) {
      abitStore.selectYear(year);
    }
  },
});

onMounted(async () => {
  try {
    await dbStore.selectRole(1);

    if (abitStore.getSelectedYear == null && dbStore.getYears.length > 0) {
      const numericYears = dbStore.getYears
        .map((year) => Number.parseInt(String(year), 10))
        .filter((year) => !Number.isNaN(year))
        .sort((a, b) => b - a);

      if (numericYears.length > 0) {
        abitStore.selectYear(numericYears[0]);
      }
    }
  } catch (error) {
    loadError.value = error?.message || "Не удалось загрузить список лет";
  }
});
</script>

<style scoped>
.page {
  padding: 24px;
}

.shell {
  max-width: 1600px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.94);
  border: 1px solid rgba(100, 149, 237, 0.22);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 12px 28px rgba(77, 127, 216, 0.1);
}

.header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: flex-start;
  margin-bottom: 16px;
}

.header h1 {
  margin: 0;
  font-size: 24px;
  line-height: 1.1;
  color: #000;
}

.subtitle {
  margin: 6px 0 0;
  color: #64748b;
}

.chip {
  background: rgba(127, 199, 255, 0.2);
  color: #335ea8;
  border: 1px solid rgba(100, 149, 237, 0.35);
  border-radius: 999px;
  padding: 6px 10px;
  font-weight: 600;
  white-space: nowrap;
}

.controls {
  display: grid;
  gap: 12px;
  margin-bottom: 12px;
}

.field {
  display: grid;
  gap: 6px;
}

.field > span {
  font-size: 13px;
  color: #334155;
}

.field select,
.field input {
  height: 38px;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  background: #fff;
  padding: 0 10px;
}

.table-wrap {
  margin-top: 12px;
}

.year-select {
  max-width: 220px;
  color: #000;
}

.year-select :deep(.v-field) {
  background-color: #fff !important;
}

.year-select :deep(.v-field__input),
.year-select :deep(.v-label),
.year-select :deep(.v-field-label),
.year-select :deep(.v-select__selection-text),
.year-select :deep(.v-icon) {
  color: #000 !important;
  opacity: 1 !important;
}

.year-select :deep(.v-field--variant-outlined .v-field__outline) {
  --v-field-border-opacity: 1;
  color: #000 !important;
}

.abit-tabs {
  margin-top: 2px;
}

.abit-tabs :deep(.v-tab) {
  color: #000 !important;
  opacity: 1 !important;
}

.abit-tabs :deep(.v-tab.v-tab--selected),
.abit-tabs :deep(.v-tab.v-btn--active) {
  color: var(--ui-primary, #6495ed) !important;
  font-weight: 600;
}

.abit-tabs :deep(.v-tab__slider) {
  background-color: var(--ui-primary, #6495ed) !important;
}

.tab-window {
  margin-top: 12px;
}

.error {
  margin: 0;
  color: #b93f57;
  background: #fff4f7;
  border: 1px solid #f3c4d0;
  padding: 10px 12px;
  border-radius: 8px;
}

@media (max-width: 900px) {
  .page {
    padding: 12px;
  }

  .shell {
    padding: 14px;
    border-radius: 12px;
  }

  .header {
    flex-direction: column;
  }

  .year-select {
    max-width: 100%;
  }
}
</style>
