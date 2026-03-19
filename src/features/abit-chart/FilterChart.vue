<template>
  <v-expansion-panels v-model="openedPanel" variant="accordion" class="filter-panels">
    <v-expansion-panel>
      <v-expansion-panel-title>Фильтры</v-expansion-panel-title>
      <v-expansion-panel-text>
        <v-form @submit.prevent>
          <v-row>
            <TypeFilter v-model="localFilters.type" :disabled="disabled" />
            <DateStartFilter v-model="localFilters.dateStart" :disabled="disabled" />
            <DateEndFilter v-model="localFilters.dateEnd" :disabled="disabled" />
            <BranchFilter v-model="localFilters.branch" :disabled="disabled" />
            <LevelFilter v-model="localFilters.levels" :disabled="disabled" />
            <StatusFilter v-model="localFilters.status" :disabled="disabled" />
            
          </v-row>

          <v-row>
            <v-col cols="12" class="filter-actions">
              <v-btn variant="outlined" :disabled="disabled" @click="resetFilters">Сбросить</v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import TypeFilter from './ui/TypeFilter.vue'
import DateStartFilter from './ui/DateStartFilter.vue'
import DateEndFilter from './ui/DateEndFilter.vue'
import BranchFilter from './ui/BranchFilter/BranchFilter.vue'
import LevelFilter from './ui/LevelFilter.vue'
import StatusFilter from './ui/StatusFilter.vue'

defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['filters-changed'])

const openedPanel = ref(0)

function createDefaultFilters() {
  return {
    type: null,
    dateStart: null,
    dateEnd: null,
    branch: [],
    academicYear: null,
    levels: [],
    status: [],
    showValues: null,
  }
}

function cloneFilters(value) {
  return JSON.parse(JSON.stringify(value))
}

const localFilters = reactive(createDefaultFilters())

watch(
  localFilters,
  (value) => {
    emit('filters-changed', cloneFilters(value))
  },
  { deep: true },
)

function resetFilters() {
  Object.assign(localFilters, createDefaultFilters())
}
</script>

<style scoped>
.filter-actions {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
</style>
