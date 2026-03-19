<template>
  <Teleport to="body">
    <Transition name="theme-backdrop">
      <div v-if="dialog" class="theme-backdrop" @click="dialog = false"></div>
    </Transition>

    <Transition name="theme-slide">
      <section v-if="dialog" class="theme-selector-drawer" @click.stop>
        <v-toolbar
          color="primary"
          density="comfortable"
          class="theme-selector-header"
        >
          <v-toolbar-title class="theme-selector-title">
            <i class="fas fa-palette" aria-hidden="true"></i>
            <span>Выбор темы</span>
          </v-toolbar-title>
          <button type="button" class="theme-close-btn" @click="dialog = false">
            <i class="fas fa-times" aria-hidden="true"></i>
          </button>
        </v-toolbar>

        <div class="theme-selector-content">
          <div class="theme-grid">
            <button
              v-for="item in presets"
              :key="item.id"
              type="button"
              class="theme-card"
              :class="{ 'theme-card-active': selectedThemeId === item.id }"
              @click="onSelect(item.id)"
            >
              <div class="theme-preview" :style="getGradientStyle(item)">
                <span class="theme-preview-name">{{ item.name }}</span>
                <i
                  v-if="selectedThemeId === item.id"
                  class="fas fa-check-circle theme-check-icon"
                  aria-hidden="true"
                ></i>
              </div>

              <div class="theme-card-content">
                <div class="theme-colors-preview">
                  <div
                    v-for="group in colorGroups"
                    :key="group.key"
                    class="color-group"
                  >
                    <div class="color-group-label">{{ group.label }}</div>
                    <div class="color-swatches">
                      <span
                        v-for="token in getColorsByGroup(item, group.key)"
                        :key="`${item.id}-${group.key}-${token.name}`"
                        class="theme-swatch color-swatch"
                        :style="{ background: token.color }"
                        :title="token.title"
                      ></span>
                    </div>
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>
      </section>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, watch } from "vue";
import {
  THEME_PRESETS,
  type ThemeColors,
  type ThemePreset,
} from "@/shared/config/theme/presets";

const props = defineProps<{
  modelValue: boolean;
  selectedThemeId: number;
  isMobile: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "select-theme", value: number): void;
}>();

const presets = THEME_PRESETS;
type ColorGroupKey = "main" | "positive" | "negative" | "info";

const colorGroups: ReadonlyArray<{ key: ColorGroupKey; label: string }> = [
  { key: "main", label: "Основные" },
  { key: "positive", label: "Утвердительные" },
  { key: "negative", label: "Отрицательные" },
  { key: "info", label: "Информационные" },
];

const colorsByGroup: Record<ColorGroupKey, Array<keyof ThemeColors>> = {
  main: [
    "primary",
    "secondary",
    "accent",
    "background",
    "surface",
    "text",
    "headCard",
    "bodyCard",
  ],
  positive: ["success"],
  negative: ["error", "warning"],
  info: ["info"],
};

const colorTitles: Record<keyof ThemeColors, string> = {
  primary: "Основной",
  secondary: "Вторичный",
  accent: "Акцент",
  error: "Ошибка",
  info: "Информация",
  success: "Успех",
  warning: "Предупреждение",
  background: "Фон",
  surface: "Поверхность",
  text: "Текст",
  headCard: "Заголовок карточки",
  bodyCard: "Тело карточки",
};

const dialog = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit("update:modelValue", value),
});

function onSelect(themeId: number) {
  emit("select-theme", themeId);
}

function getGradientStyle(item: ThemePreset) {
  return {
    background: `linear-gradient(135deg, ${item.colors.primary} 0%, ${item.colors.secondary} 100%)`,
  };
}

function getColorsByGroup(item: ThemePreset, group: ColorGroupKey) {
  return colorsByGroup[group]
    .map((name) => ({
      name,
      color: item.colors[name],
      title: colorTitles[name],
    }))
    .filter((token) => !!token.color);
}

watch(
  () => dialog.value,
  (opened) => {
    document.body.style.overflow = opened ? "hidden" : "";
  },
);

onBeforeUnmount(() => {
  document.body.style.overflow = "";
});
</script>

<style scoped lang="scss">
.theme-backdrop {
  position: fixed;
  inset: 0;
  z-index: 2500;
  background: rgba(15, 23, 42, 0.34);
}

.theme-selector-drawer {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: min(420px, 100vw);
  height: 100vh;
  background: #fff;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  z-index: 2501;
  box-shadow: -10px 0 28px rgba(15, 23, 42, 0.2);
}

@media (max-width: 900px) {
  .theme-selector-drawer {
    width: 100vw;
  }
}

.theme-selector-header {
  position: sticky;
  top: 0;
  z-index: 2;
  color: #fff;
}

.theme-selector-title {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-weight: 700;
  font-size: 17px;
}

.theme-selector-title :deep(.v-toolbar-title__placeholder) {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.theme-close-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.26);
  background: rgba(255, 255, 255, 0.16);
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-right: 15px;
}

.theme-close-btn .fas {
  font-size: 14px;
  line-height: 1;
}

.theme-selector-content {
  padding: 12px;
}

.theme-grid {
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.theme-card {
  width: 100%;
  border: 2px solid rgba(100, 149, 237, 0.16);
  border-radius: 12px;
  background: #fff;
  padding: 0;
  text-align: left;
  cursor: pointer;
  overflow: hidden;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease;
}

.theme-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(15, 23, 42, 0.12);
}

.theme-card-active {
  border-color: rgba(100, 149, 237, 0.75);
  box-shadow: 0 10px 22px rgba(100, 149, 237, 0.22);
}

.theme-preview {
  min-height: 56px;
  padding: 10px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #fff;
}

.theme-preview-name {
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.01em;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.32);
}

.theme-check-icon {
  font-size: 18px;
  line-height: 1;
}

.theme-swatches {
  padding: 10px 12px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.theme-card-content {
  position: relative;
  z-index: 1;
  background: #fff;
  padding: 10px 12px;
}

.theme-colors-preview {
  margin-top: 0;
}

.color-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 8px;
}

.color-group:last-child {
  margin-bottom: 0;
}

.color-group-label {
  font-size: 9px;
  color: #80889d;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.color-swatches {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
  align-items: center;
}

.theme-swatch {
  width: 20px;
  height: 20px;
  border-radius: 6px;
  border: 1px solid rgba(15, 23, 42, 0.12);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.2);
}

.color-swatch {
  transition: all 0.2s ease;
  cursor: pointer;
}

.color-swatch:hover {
  transform: scale(1.12);
  box-shadow: 0 4px 8px rgba(15, 23, 42, 0.2);
}

.theme-backdrop-enter-active,
.theme-backdrop-leave-active {
  transition: opacity 0.2s ease;
}

.theme-backdrop-enter-from,
.theme-backdrop-leave-to {
  opacity: 0;
}

.theme-slide-enter-active,
.theme-slide-leave-active {
  transition: transform 0.22s ease;
}

.theme-slide-enter-from,
.theme-slide-leave-to {
  transform: translateX(100%);
}

@media (max-width: 600px) {
  .theme-grid {
    grid-template-columns: 1fr;
  }
}
</style>
