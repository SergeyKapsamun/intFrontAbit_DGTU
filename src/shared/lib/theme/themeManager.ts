import { THEME_PRESETS, type ThemePreset } from '@/shared/config/theme/presets'

const STORAGE_THEME_ID = 'selectThemeID'

function getPreset(themeId: number): ThemePreset {
  return THEME_PRESETS.find((preset) => preset.id === themeId) || THEME_PRESETS[0]
}

function setCssVar(name: string, value: string) {
  document.documentElement.style.setProperty(name, value)
}

function darkenHexColor(hexColor: string, ratio = 0.18): string {
  const hex = hexColor.replace('#', '').trim()
  if (hex.length !== 6) return hexColor

  const r = Number.parseInt(hex.slice(0, 2), 16)
  const g = Number.parseInt(hex.slice(2, 4), 16)
  const b = Number.parseInt(hex.slice(4, 6), 16)

  if ([r, g, b].some((channel) => Number.isNaN(channel))) return hexColor

  const toHex = (channel: number) => {
    const value = Math.max(0, Math.min(255, Math.round(channel * (1 - ratio))))
    return value.toString(16).padStart(2, '0')
  }

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

function setLegacyStorageKeys(preset: ThemePreset) {
  const { colors } = preset
  localStorage.setItem('primary', colors.primary)
  localStorage.setItem('secondary', colors.secondary)
  localStorage.setItem('accent', colors.accent)
  localStorage.setItem('error', colors.error)
  localStorage.setItem('info', colors.info)
  localStorage.setItem('success', colors.success)
  localStorage.setItem('warning', colors.warning)
  localStorage.setItem('bgcolor', colors.background)
  localStorage.setItem('txtcolor', colors.text)
  localStorage.setItem('headcardcolor', colors.headCard)
  localStorage.setItem('bodycardcolor', colors.bodyCard)
}

function applyCssVariables(preset: ThemePreset) {
  const { colors } = preset
  setCssVar('--ui-primary', colors.primary)
  setCssVar('--ui-secondary', colors.secondary)
  setCssVar('--ui-primary-deep', darkenHexColor(colors.primary))
  setCssVar('--ui-text', colors.text)
  setCssVar('--ui-bg', colors.background)
  setCssVar('--ui-bg-soft', colors.surface)
  setCssVar('--legacy-primary', colors.primary)
  setCssVar('--legacy-secondary', colors.secondary)
}

function applyVuetifyTheme(vuetifyTheme: any, preset: ThemePreset) {
  if (!vuetifyTheme?.themes?.value) return

  const targetName = vuetifyTheme?.global?.name?.value || 'seaBreeze'
  const targetTheme = vuetifyTheme.themes.value[targetName] || vuetifyTheme.themes.value.seaBreeze
  if (!targetTheme?.colors) return

  Object.assign(targetTheme.colors, {
    primary: preset.colors.primary,
    secondary: preset.colors.secondary,
    accent: preset.colors.accent,
    success: preset.colors.success,
    warning: preset.colors.warning,
    error: preset.colors.error,
    info: preset.colors.info,
    background: preset.colors.background,
    surface: preset.colors.surface,
  })
}

function normalizeThemeId(rawValue: string | null): number {
  const parsed = Number(rawValue)
  if (Number.isNaN(parsed)) return 0
  return THEME_PRESETS.some((preset) => preset.id === parsed) ? parsed : 0
}

export function getStoredThemeId(): number {
  return normalizeThemeId(localStorage.getItem(STORAGE_THEME_ID))
}

export function applyThemeById(themeId: number, vuetifyTheme?: any, persist = true): number {
  const preset = getPreset(themeId)

  applyCssVariables(preset)
  applyVuetifyTheme(vuetifyTheme, preset)

  if (persist) {
    localStorage.setItem(STORAGE_THEME_ID, String(preset.id))
    setLegacyStorageKeys(preset)
  }

  return preset.id
}

export function applyStoredTheme(vuetifyTheme?: any): number {
  const themeId = getStoredThemeId()
  return applyThemeById(themeId, vuetifyTheme, true)
}
