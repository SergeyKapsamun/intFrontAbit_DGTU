<template>
  <v-col cols="12" md="3">
    <v-select
      v-model="model"
      :items="options"
      item-title="title"
      item-value="value"
      label="Тип"
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
    type: [String, Number, null],
    default: null,
  },
})

const emit = defineEmits(['update:modelValue'])

const model = computed({
  get: () => props.modelValue ?? null,
  set: (value) => emit('update:modelValue', value ?? null),
})

const options = [
  { title: 'Заявление', value: 'заявление' },
  { title: 'Заявление (Б)', value: 'заявление (Б)' },
  { title: 'ФизЛиц', value: 'физлиц' },
  { title: 'Договора', value: 'договора' },
  { title: 'Оплата', value: 'оплата' },
]
</script>
