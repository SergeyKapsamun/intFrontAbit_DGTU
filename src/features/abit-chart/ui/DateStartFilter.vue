<template>
  <v-col cols="12" md="2">
    <RuDateField
      v-model="dateModel"
      label="Дата начала"
      clearable
      hide-details
    />
  </v-col>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import RuDateField from '@/shared/ui/ru-date-field/RuDateField.vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: null,
  },
})

const emit = defineEmits(['update:modelValue'])

const dateModel = computed({
  get: () => props.modelValue ?? null,
  set: (value) => emit('update:modelValue', value || null),
})
</script>
