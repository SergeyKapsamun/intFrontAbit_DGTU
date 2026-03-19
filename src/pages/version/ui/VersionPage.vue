<template>
  <v-container fluid class="version-page pa-2 pa-md-4">
    <v-row class="mb-3 mb-md-4" align="center" justify="space-between" no-gutters>
      <v-col cols="12" sm="auto" class="d-flex align-center mb-2 mb-sm-0">
        <h1 class="page-title mb-0">Журнал версий</h1>
      </v-col>
    </v-row>

    <v-row v-if="loading" no-gutters>
      <v-col cols="12">
        <v-card class="version-loading-card">
          <v-card-text class="py-10 d-flex align-center justify-center">
            <v-progress-circular indeterminate color="primary" />
            <span class="ml-3">Загрузка...</span>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row v-else-if="errorMessage" no-gutters>
      <v-col cols="12">
        <v-alert icon="fas fa-exclamation-circle" prominent variant="text" type="error">
          {{ errorMessage }}
        </v-alert>
      </v-col>
    </v-row>

    <v-row v-else-if="versions.length === 0" no-gutters>
      <v-col cols="12">
        <v-alert icon="fas fa-info-circle" prominent variant="text" type="info">
          Не найдено версий для отображения.
        </v-alert>
      </v-col>
    </v-row>

    <v-row v-else no-gutters>
      <v-col cols="12" md="4" class="pr-md-2 mb-2 mb-md-0">
        <v-card class="version-list-card">
          <v-list class="py-0">
            <v-list-item
              v-for="item in versions"
              :key="`${item.id || 'no-id'}-${item.versionNumber || 'no-number'}`"
              :active="isSelected(item)"
              class="version-item"
              @click="selectVersion(item)"
            >
              <template #prepend>
                <i class="fas fa-code-branch version-icon" aria-hidden="true"></i>
              </template>
              <v-list-item-title class="version-title">
                {{ item.versionNumber || "Без номера" }}
              </v-list-item-title>
              <v-list-item-subtitle class="version-date">
                {{ formatDate(item.dateUpdate) }}
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>

      <v-col cols="12" md="8" class="pl-md-2">
        <v-card class="version-details-card">
          <v-card-title class="card-title-integr">
            Описание обновления версии
            <template v-if="selectedVersion?.versionNumber">
              {{ selectedVersion.versionNumber }}
            </template>
          </v-card-title>
          <v-card-text class="pa-4">
            <template v-if="hasDetails">
              <div v-if="additionsItems.length" class="details-row">
                <i class="fas fa-wrench section-icon section-icon-primary" aria-hidden="true"></i>
                <div class="details-content">
                  <div class="details-title">Общие изменения:</div>
                  <ul class="details-list">
                    <li v-for="(line, index) in additionsItems" :key="`a-${index}`">
                      {{ line }}
                    </li>
                  </ul>
                </div>
              </div>

              <div v-if="errorsItems.length" class="details-row">
                <i class="fas fa-bug section-icon section-icon-error" aria-hidden="true"></i>
                <div class="details-content">
                  <div class="details-title">Исправленные ошибки:</div>
                  <ul class="details-list">
                    <li v-for="(line, index) in errorsItems" :key="`e-${index}`">
                      {{ line }}
                    </li>
                  </ul>
                </div>
              </div>

              <div v-if="opportunitiesItems.length" class="details-row">
                <i class="fas fa-star section-icon section-icon-warning" aria-hidden="true"></i>
                <div class="details-content">
                  <div class="details-title">Новые возможности:</div>
                  <ul class="details-list">
                    <li v-for="(line, index) in opportunitiesItems" :key="`o-${index}`">
                      {{ line }}
                    </li>
                  </ul>
                </div>
              </div>
            </template>

            <div v-else class="empty-details">
              Описание обновления для выбранной версии отсутствует.
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import {
  getProgramVersions,
  type ProgramVersionDto,
} from "@/entities/version/api/versionApi";

const loading = ref(false);
const errorMessage = ref("");
const versions = ref<ProgramVersionDto[]>([]);
const selectedVersion = ref<ProgramVersionDto | null>(null);

const additionsItems = computed(() =>
  toItems(selectedVersion.value?.additionsFunctionality),
);
const errorsItems = computed(() => toItems(selectedVersion.value?.editsErrors));
const opportunitiesItems = computed(() =>
  toItems(selectedVersion.value?.newOpportunities),
);
const hasDetails = computed(
  () =>
    additionsItems.value.length > 0 ||
    errorsItems.value.length > 0 ||
    opportunitiesItems.value.length > 0,
);

onMounted(() => {
  void loadVersions();
});

async function loadVersions() {
  loading.value = true;
  errorMessage.value = "";

  try {
    const result = await getProgramVersions();
    versions.value = result;
    selectedVersion.value = result[0] || null;
  } catch {
    versions.value = [];
    selectedVersion.value = null;
    errorMessage.value = "Не удалось загрузить журнал версий.";
  } finally {
    loading.value = false;
  }
}

function toItems(text: string | null | undefined) {
  if (!text) return [] as string[];
  const normalized = text.replace(/\r/g, "\n").replace(/;/g, "\n");
  return normalized
    .split("\n")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

function selectVersion(item: ProgramVersionDto) {
  selectedVersion.value = item;
}

function isSelected(item: ProgramVersionDto) {
  return (
    selectedVersion.value?.id === item.id &&
    selectedVersion.value?.versionNumber === item.versionNumber
  );
}

function formatDate(dateValue: string | null | undefined) {
  if (!dateValue) return "Дата не указана";
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return String(dateValue);
  return date.toLocaleDateString("ru-RU");
}
</script>

<style scoped>
.version-page {
  min-width: 0;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #1f2937;
}

.version-loading-card {
  border-radius: 10px;
}

.version-list-card,
.version-details-card {
  border-radius: 10px;
  overflow: hidden;
}

.card-title-integr {
  background: var(--ui-primary, #6495ed);
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  min-height: 52px;
  display: flex;
  align-items: center;
}

.version-item {
  min-height: 54px;
  padding: 4px 14px;
}

.version-item + .version-item {
  border-top: 1px solid rgba(100, 116, 139, 0.14);
}

.version-icon {
  color: #64748b;
  font-size: 13px;
  width: 16px;
  text-align: center;
}

.version-title {
  font-weight: 600;
  color: #0f172a;
}

.version-date {
  color: #64748b;
  font-size: 12px;
}

.details-row {
  display: flex;
  align-items: flex-start;
  gap: 14px;
}

.details-row + .details-row {
  margin-top: 22px;
}

.section-icon {
  margin-top: 4px;
  width: 18px;
  text-align: center;
}

.section-icon-primary {
  color: var(--ui-primary, #6495ed);
}

.section-icon-error {
  color: #ef4444;
}

.section-icon-warning {
  color: #f59e0b;
}

.details-content {
  flex: 1;
  min-width: 0;
}

.details-title {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 8px;
}

.details-list {
  margin: 0;
  padding-left: 18px;
}

.details-list li {
  margin-bottom: 4px;
  color: #334155;
}

.empty-details {
  color: #64748b;
  padding: 10px 2px;
}

@media (max-width: 960px) {
  .page-title {
    font-size: 22px;
  }
}
</style>
