<template>
  <div
    class="ru-date-field"
    :class="{ disabled, readonly, 'hide-details': hideDetails }"
  >
    <DxDateBox
      class="ru-date-field__control"
      :value="dateValue"
      :height="height"
      type="date"
      picker-type="calendar"
      display-format="dd.MM.yyyy"
      :label="label || undefined"
      label-mode="floating"
      :show-clear-button="clearable"
      :disabled="disabled"
      :read-only="readonly"
      :use-mask-behavior="true"
      styling-mode="outlined"
      @value-changed="onValueChanged"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import DxDateBox from "devextreme-vue/date-box";

const props = defineProps({
  modelValue: {
    type: [String, Date, null],
    default: null,
  },
  label: {
    type: String,
    default: "",
  },
  clearable: {
    type: Boolean,
    default: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  height: {
    type: [Number, String],
    default: 48,
  },
  hideDetails: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue"]);

const dateValue = computed(() => parseToDate(props.modelValue));

function onValueChanged(event) {
  emit("update:modelValue", formatToIsoDate(event?.value));
}

function parseToDate(value) {
  if (!value) return null;
  if (value instanceof Date)
    return Number.isNaN(value.getTime()) ? null : value;

  const text = String(value).trim();
  if (!text) return null;

  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) {
    const [year, month, day] = text.split("-").map(Number);
    return new Date(year, month - 1, day);
  }

  const parsed = new Date(text);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function formatToIsoDate(value) {
  if (!value) return null;

  if (typeof value === "string") {
    const text = value.trim();
    if (!text) return null;
    if (/^\d{4}-\d{2}-\d{2}$/.test(text)) return text;
    const parsed = new Date(text);
    if (Number.isNaN(parsed.getTime())) return null;
    return toIsoDate(parsed);
  }

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return toIsoDate(value);
  }

  return null;
}

function toIsoDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
</script>

<style scoped>
.ru-date-field {
  width: 100%;
  margin-bottom: 8px;
}

.ru-date-field.hide-details {
  margin-bottom: 0;
}

.ru-date-field__control {
  display: block;
  width: 100%;
}

.ru-date-field__control :deep(.dx-texteditor) {
  width: 100%;
  height: 48px !important;
  border-radius: 8px;
  border-color: rgba(148, 163, 184, 0.28);
  background: rgba(255, 255, 255, 0.95);
  min-height: 48px;
  box-sizing: border-box;
}

.ru-date-field__control
  :deep(.dx-editor-outlined.dx-texteditor-with-floating-label),
.ru-date-field__control :deep(.dx-editor-outlined.dx-texteditor-with-label) {
  margin-top: 0 !important;
}

.ru-date-field__control.dx-editor-outlined.dx-texteditor-with-floating-label,
.ru-date-field__control.dx-editor-outlined.dx-texteditor-with-label {
  margin-top: 0 !important;
}

.ru-date-field__control :deep(.dx-texteditor-container),
.ru-date-field__control :deep(.dx-texteditor-input-container) {
  height: 46px !important;
  min-height: 46px;
}

.ru-date-field__control :deep(.dx-texteditor.dx-state-hover) {
  border-color: rgba(100, 149, 237, 0.45);
}

.ru-date-field__control :deep(.dx-texteditor.dx-state-focused) {
  border-color: rgba(100, 149, 237, 0.7);
  box-shadow: 0 0 0 2px rgba(100, 149, 237, 0.14);
}

.ru-date-field__control :deep(.dx-texteditor-input) {
  font-size: 14px;
  color: #17384a;
  min-height: 46px !important;
}

.ru-date-field__control :deep(.dx-texteditor-label) {
  color: rgba(15, 23, 42, 0.58);
  font-size: 12px;
}

.ru-date-field__control :deep(.dx-state-focused .dx-texteditor-label),
.ru-date-field__control :deep(.dx-label-has-text .dx-texteditor-label) {
  color: rgba(77, 127, 216, 0.96);
}

.ru-date-field__control :deep(.dx-placeholder) {
  color: rgba(15, 23, 42, 0.42);
}

.ru-date-field__control :deep(.dx-dropdowneditor-icon),
.ru-date-field__control :deep(.dx-dropdowneditor-icon::before),
.ru-date-field__control :deep(.dx-dropdowneditor-button .dx-dropdowneditor-icon),
.ru-date-field__control :deep(.dx-dropdowneditor-button .dx-dropdowneditor-icon::before),
.ru-date-field__control :deep(.dx-clear-button-area .dx-icon),
.ru-date-field__control :deep(.dx-clear-button-area .dx-icon::before) {
  color: #6495ed !important;
}

.ru-date-field.readonly :deep(.dx-dropdowneditor-icon),
.ru-date-field.readonly :deep(.dx-clear-button-area) {
  opacity: 0.7;
}
</style>

<style>
.dx-overlay-content .dx-datebox-wrapper-calendar .dx-calendar .dx-icon,
.dx-overlay-content .dx-datebox-wrapper-calendar .dx-calendar .dx-icon::before,
.dx-overlay-content .dx-datebox-wrapper-calendar .dx-calendar-navigator .dx-button .dx-button-text,
.dx-overlay-content .dx-datebox-wrapper-calendar .dx-calendar-caption-button .dx-button-text {
  color: #6495ed !important;
}

.dx-overlay-content .dx-datebox-wrapper-calendar .dx-calendar-navigator .dx-button:hover .dx-icon,
.dx-overlay-content .dx-datebox-wrapper-calendar .dx-calendar-navigator .dx-button:hover .dx-icon::before,
.dx-overlay-content .dx-datebox-wrapper-calendar .dx-calendar-navigator .dx-button.dx-state-hover .dx-icon,
.dx-overlay-content .dx-datebox-wrapper-calendar .dx-calendar-navigator .dx-button.dx-state-hover .dx-icon::before {
  color: #4d7fd8 !important;
}
</style>
