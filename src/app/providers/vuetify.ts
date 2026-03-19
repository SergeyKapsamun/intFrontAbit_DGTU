import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'

import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import { ru } from 'vuetify/locale'

export default createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
  locale: {
    locale: 'ru',
    fallback: 'ru',
    messages: { ru },
  },
  theme: {
    defaultTheme: 'seaBreeze',
    themes: {
      seaBreeze: {
        dark: false,
        colors: {
          primary: '#6495ED',
          secondary: '#7FC7FF',
          accent: '#5E9EF2',
          success: '#4FAE7A',
          warning: '#D6A34E',
          error: '#C85472',
          info: '#6495ED',
          background: '#EEF5FF',
          surface: '#ffffff',
        },
      },
    },
  },
})
