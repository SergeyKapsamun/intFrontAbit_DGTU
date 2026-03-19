import axios from 'axios'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { loadMessages, locale as setDxLocale } from 'devextreme/localization'
import ruDxMessages from 'devextreme/localization/messages/ru.json'
import App from '@/app/App.vue'
import router from '@/app/providers/router'
import vuetify from '@/app/providers/vuetify'
import '@/app/styles/index.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
import 'devextreme/dist/css/dx.light.css'
import { useAuthStore } from '@/entities/session/model/authStore'
import { useAbitStore } from '@/entities/abit/model/abitStore'
import { useDbStore } from '@/entities/db/model/dbStore'
import { applyStoredTheme } from '@/shared/lib/theme/themeManager'
import { registerVuexCompatModules } from '@/shared/lib/vuex-compat'

loadMessages(ruDxMessages)
setDxLocale('ru')

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(vuetify)
app.config.globalProperties.$http = axios

registerVuexCompatModules({
  abitModule: useAbitStore,
  dbStore: useDbStore,
})

applyStoredTheme(vuetify.theme)
void useAuthStore(pinia).initializeSession()

app.mount('#app')
