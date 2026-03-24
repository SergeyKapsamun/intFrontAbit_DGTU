<template>
  <div ref="appdetail" @click="onClick" class="w-100 sticky app-tabs">
    <v-tabs
      v-model="tab"
      color="primary"
      show-arrows
      align-tabs="start"
      class="tabs-bar"
      @update:modelValue="onTabChange"
    >
      <v-tab value="custom">
        Пользовательский
      </v-tab>
      <v-tab v-for="i in tabs" :key="i.name" :value="i.name">
        {{ i.name }}
      </v-tab>
      <v-tab value="scores">
        Баллы
      </v-tab>
      <v-tab value="ranking">
        РС
      </v-tab>
      <v-tab value="documents">
        Документы
      </v-tab>
      <v-tab value="achievements">
        Достижения
      </v-tab>
    </v-tabs>

    <v-divider />

    <v-window v-model="tab" class="tab-window" :touch="false">
      <v-window-item value="custom">
        <div class="tab-panel">
          <CustomTab :data="data" v-if="data" />
        </div>
      </v-window-item>

      <v-window-item v-for="i in tabs" :key="`panel-${i.name}`" :value="i.name">
        <div class="tab-panel" v-if="data">
          <div class="grid grid-col-6">
            <v-card
              v-for="f in i.fields"
              :key="`${i.name}_${f.name}`"
              variant="outlined"
              rounded="lg"
              class="app-card"
            >
              <v-card-title class="p-2 text-4">{{ f.title }}</v-card-title>
              <v-card-text class="p-2 pt-0 app-card-text">
                {{ formatValue(f.title, data && data[f.name] ? data[f.name] : '-') }}
              </v-card-text>
            </v-card>
          </div>
        </div>
      </v-window-item>

      <v-window-item value="scores">
        <div class="tab-panel">
          <ApplicationScoresTab
            v-if="data && data.id"
            :id="data && data.id ? data.id : null"
          />
        </div>
      </v-window-item>

      <v-window-item value="ranking">
        <div class="tab-panel">
          <ApplicationRankingTab
            v-if="data"
            ref="rankingTab"
            :data="data"
          />
        </div>
      </v-window-item>

      <v-window-item value="documents">
        <div class="tab-panel">
          <ApplicationDocumentsTab
            v-if="data && data.id"
            :documentId="data.documentId"
            :id="data && data.id ? data.id : null"
          />
        </div>
      </v-window-item>

      <v-window-item value="achievements">
        <div class="tab-panel">
          <ApplicationAchievementsTab
            :id="data && data.id ? data.id : null"
          />
        </div>
      </v-window-item>
    </v-window>
  </div>
</template>

<script setup lang="ts">
import { ref, toRef } from 'vue'
import { tabsconfig } from './tabs/tabsconfig'
import ApplicationScoresTab from './tabs/ApplicationScoresTab.vue'
import ApplicationRankingTab from './tabs/ApplicationRankingTab.vue'
import CustomTab from './tabs/CustomTab.vue'
import ApplicationDocumentsTab from './tabs/ApplicationDocumentsTab.vue'
import ApplicationAchievementsTab from './tabs/ApplicationAchievementsTab.vue'

interface Props {
  data?: Record<string, any> | null
}

const props = defineProps<Props>()
const data = toRef(props, 'data')
const rankingTab = ref<{ scrollToCurrentPerson?: () => void } | null>(null)

const tab = ref('custom')
const tabs = tabsconfig

function onClick(e: Event) {
  e.stopPropagation()
}

function onTabChange() {
  if (tab.value === 'ranking' && rankingTab.value?.scrollToCurrentPerson) {
    rankingTab.value.scrollToCurrentPerson()
  }
}

function formatValue(fieldTitle: string, value: unknown) {
  if (
    fieldTitle &&
    fieldTitle.startsWith('Дата') &&
    value &&
    typeof value === 'string' &&
    (value.includes('T') || isValidDate(value))
  ) {
    const date = new Date(value)
    if (!isNaN(date.getTime())) {
      const day = String(date.getDate()).padStart(2, '0')
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const year = date.getFullYear()
      return `${day}.${month}.${year}`
    }
  }

  if (typeof value === 'boolean') {
    return value ? 'да' : 'нет'
  }

  if (typeof value === 'string') {
    const lowerValue = value.toLowerCase()
    if (lowerValue === 'true') {
      return 'да'
    } else if (lowerValue === 'false') {
      return 'нет'
    }
  }

  if (typeof value === 'number' && (value === 0 || value === 1)) {
    return value === 1 ? 'да' : 'нет'
  }

  if (value === null || value === undefined) {
    return '-'
  }

  return value
}

function isValidDate(dateString: string) {
  const date = new Date(dateString)
  return date instanceof Date && !isNaN(date.getTime())
}

</script>

<style scoped>
.grid {
  display: grid;
  gap: 0.5rem;
  padding: 0.3rem;
}

.grid-col-6 {
  grid-template-columns: repeat(6, 1fr);
}

.w-100 {
  width: min(95rem, 100%);
}

.sticky {
  position: sticky;
  left: 0;
}

.app-tabs {
  background: #fff;
  border-radius: 8px;
}

.tabs-bar {
  padding: 0.25rem 0.25rem 0;
}

.tab-window {
  margin-top: 0.25rem;
}

.tab-panel {
  padding-top: 0.35rem;
}

.app-card {
  border: 1px solid #e2e8f0;
  background: #fff;
  border-radius: 8px;
  min-width: 0;
  height: auto;
  overflow: visible;
}

.app-card-title {
  font-weight: 600;
  color: #0f172a;
}

.app-card-text {
  color: #334155;
  word-break: break-word;
  overflow-wrap: anywhere;
  white-space: normal;
  overflow: visible;
  text-overflow: initial;
  display: block;
}

.p-2 {
  padding: 0.5rem !important;
}

.pt-0 {
  padding-top: 0 !important;
}

.text-4 {
  font-size: 1rem !important;
}

@media (max-width: 900px) {
  .grid-col-6 {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .grid-col-6 {
    grid-template-columns: 1fr;
  }

}
</style>
