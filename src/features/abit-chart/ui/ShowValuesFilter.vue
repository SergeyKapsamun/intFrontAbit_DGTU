<template>
  <v-col cols="12" md="3">
    <v-select
      v-model="model"
      :items="options"
      item-title="title"
      item-value="value"
      label="Отображение значений"
      clearable
      variant="outlined"
      density="comfortable"
      hide-details
    />
  </v-col>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: [Number, String, null],
    default: null,
  },
})

const emit = defineEmits(['update:modelValue'])

const model = computed({
  get: () => props.modelValue ?? null,
  set: (value) => emit('update:modelValue', value ?? null),
})

const options = [
  { title: 'Без подписей', value: 1 },
  { title: 'В начале и конце', value: 2 },
  { title: 'Во всех точках', value: 3 },
]
</script>
