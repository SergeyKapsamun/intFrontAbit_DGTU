<template>
  <v-col cols="12" md="3">
    <v-select
      v-model="model"
      :items="options"
      item-title="title"
      item-value="value"
      label="Статус"
      clearable
      multiple
      chips
      variant="outlined"
      density="comfortable"
      hide-details
      :menu-props="{ maxHeight: 260, closeOnContentClick: false }"
      :disabled="disabled"
    />
  </v-col>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue'])

const model = computed({
  get: () => (Array.isArray(props.modelValue) ? props.modelValue : []),
  set: (value) => emit('update:modelValue', Array.isArray(value) ? value : []),
})

const options = [
  { title: 'Принято', value: 'принято' },
  { title: 'В обработке', value: 'в обработке' },
  { title: 'Пусто', value: 'пусто' },
  { title: 'Отклонено', value: 'отклонено' },
]
</script>
