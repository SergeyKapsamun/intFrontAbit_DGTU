export interface ThemeColors {
  primary: string
  secondary: string
  accent: string
  error: string
  info: string
  success: string
  warning: string
  background: string
  surface: string
  text: string
  headCard: string
  bodyCard: string
}

export interface ThemePreset {
  id: number
  name: string
  colors: ThemeColors
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 0,
    name: 'Морской бриз',
    colors: {
      primary: '#6495ED',
      secondary: '#7FC7FF',
      accent: '#9747FF',
      error: '#F97676',
      info: '#6495ED',
      success: '#76F9BA',
      warning: '#FFCF48',
      background: '#EEF5FF',
      surface: '#FFFFFF',
      text: '#424B9E',
      headCard: '#E9F5FF',
      bodyCard: '#FFFFFF',
    },
  },
  {
    id: 1,
    name: 'Легкий дым',
    colors: {
      primary: '#A0A7BA',
      secondary: '#E3E7EC',
      accent: '#BDC4D8',
      error: '#F97676',
      info: '#A0A7BA',
      success: '#76F9BA',
      warning: '#FFCF48',
      background: '#F2F5FA',
      surface: '#FFFFFF',
      text: '#5A6071',
      headCard: '#E3E7EC',
      bodyCard: '#FFFFFF',
    },
  },
  {
    id: 2,
    name: 'Вечерние сумерки',
    colors: {
      primary: '#2A456D',
      secondary: '#4954BA',
      accent: '#9747FF',
      error: '#B53E3E',
      info: '#6495ED',
      success: '#3B8F5D',
      warning: '#FFCF48',
      background: '#1F1E31',
      surface: '#292C44',
      text: '#C1C8F3',
      headCard: '#292C44',
      bodyCard: '#1F1E31',
    },
  },
  {
    id: 3,
    name: 'Фиолетовая ночь',
    colors: {
      primary: '#7032C1',
      secondary: '#9747FF',
      accent: '#6248FF',
      error: '#C8463E',
      info: '#9747FF',
      success: '#3B8F5D',
      warning: '#FFCF48',
      background: '#3D2D52',
      surface: '#523E6B',
      text: '#E1CCFF',
      headCard: '#523E6B',
      bodyCard: '#3D2D52',
    },
  },
  {
    id: 4,
    name: 'Зеленое яблоко',
    colors: {
      primary: '#97E296',
      secondary: '#CFEF9A',
      accent: '#03A000',
      error: '#F97676',
      info: '#97E296',
      success: '#76F9BA',
      warning: '#FFCF48',
      background: '#F8FFF2',
      surface: '#FFFFFF',
      text: '#0F615C',
      headCard: '#FAFFF1',
      bodyCard: '#FFFFFF',
    },
  },
  {
    id: 5,
    name: 'Летний день',
    colors: {
      primary: '#C8463E',
      secondary: '#FFCF48',
      accent: '#FFBD88',
      error: '#F97676',
      info: '#FFDEAD',
      success: '#76F9BA',
      warning: '#FFCF48',
      background: '#FFF9F0',
      surface: '#FFFFFF',
      text: '#8F2A24',
      headCard: '#FFF9F0',
      bodyCard: '#FFFFFF',
    },
  },
]

