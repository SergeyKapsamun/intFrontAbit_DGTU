<template>
  <div class="custom-tab">
    <v-autocomplete
      v-model="selectedValues"
      :items="autocompleteItems"
      label="Выберите значения"
      variant="outlined"
      density="comfortable"
      clearable
      hide-details
      multiple
      chips
      closable-chips
    />

    <div
      class="grid grid-col-6"
      v-if="selectedValues && selectedValues.length > 0 && data"
    >
      <v-card v-for="value in selectedValues" :key="value" variant="outlined" rounded="lg" class="custom-card">
        <v-card-title class="p-2 text-4 custom-card-title">{{ getFieldTitle(value) }}</v-card-title>
        <v-card-text class="p-2 pt-0 custom-card-text">
          {{ data[getFieldName(value)] ? data[getFieldName(value)] : '' }}
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, toRef, watch } from 'vue'
import { translateKey } from '../../mock/translateKey.ts'

interface Props {
  data?: Record<string, unknown> | null
}

const props = defineProps<Props>()
const data = toRef(props, 'data')

const selectedValues = ref<string[]>([])
const autocompleteItems = ref<string[]>([])

function getFieldTitle(value: string) {
  if (translateKey[value]) {
    return translateKey[value]
  }

  const fieldKey = Object.keys(translateKey).find((key) => translateKey[key] === value)
  if (fieldKey) {
    return translateKey[fieldKey]
  }

  return value
}

function getFieldName(value: string) {
  if (translateKey[value]) {
    return value
  }

  const fieldKey = Object.keys(translateKey).find((key) => translateKey[key] === value)
  if (fieldKey) {
    return fieldKey
  }

  return value
}

function saveSelectedValues(values: string[]) {
  try {
    localStorage.setItem('customTabSelectedValues', JSON.stringify(values))
  } catch (error) {
    console.error('Error saving selected values to localStorage:', error)
  }
}

function loadSelectedValues() {
  try {
    const savedValues = localStorage.getItem('customTabSelectedValues')
    if (savedValues) {
      selectedValues.value = JSON.parse(savedValues)
    }
  } catch (error) {
    console.error('Error loading selected values from localStorage:', error)
    selectedValues.value = []
  }
}

watch(
  data,
  (newData) => {
    if (newData) {
      const allFields: string[] = []
      Object.keys(translateKey).forEach((key) => {
        allFields.push(translateKey[key])
      })
      autocompleteItems.value = [...new Set(allFields)]
    }
  },
  { immediate: true },
)

watch(
  selectedValues,
  (newValues) => {
    saveSelectedValues(newValues)
  },
  { deep: true },
)

onMounted(() => {
  loadSelectedValues()
})
</script>

<style scoped>
.custom-tab {
  display: grid;
  gap: 12px;
  padding: 8px 6px;
}

.grid {
  display: grid;
  gap: 0.5rem;
  padding: 0.3rem;
}

.grid-col-6 {
  grid-template-columns: repeat(6, 1fr);
}

.custom-card {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #fff;
}

.custom-card-title {
  font-weight: 600;
}

.custom-card-text {
  word-break: break-word;
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
