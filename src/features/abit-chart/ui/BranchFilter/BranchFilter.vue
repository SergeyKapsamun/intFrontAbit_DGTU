<template>
  <v-col cols="12" md="3">
    <v-select
      v-model="model"
      :items="options"
      item-title="title"
      item-value="value"
      label="Филиал"
      clearable
      multiple
      chips
      variant="outlined"
      density="comfortable"
      hide-details
      :menu-props="{ maxHeight: 260 }"
      :loading="loading"
    />
  </v-col>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import api from './api'
import { useDbStore } from '@/entities/db/model/dbStore'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['update:modelValue'])

const dbStore = useDbStore()
const loading = ref(false)
const options = ref([])

const model = computed({
  get: () => (Array.isArray(props.modelValue) ? props.modelValue : []),
  set: (value) => emit('update:modelValue', Array.isArray(value) ? value : []),
})

const selectedDb = computed(() => dbStore.getSelectedDB)

watch(
  selectedDb,
  async () => {
    await loadBranches()
  },
  { immediate: true },
)

async function loadBranches() {
  if (!selectedDb.value) {
    options.value = []
    return
  }

  loading.value = true
  try {
    const branches = await api.chartHelpersApiService.getBranchData(selectedDb.value)
    options.value = (Array.isArray(branches) ? branches : []).map((branch) => ({
      title: branch,
      value: branch,
    }))
  } finally {
    loading.value = false
  }
}
</script>
