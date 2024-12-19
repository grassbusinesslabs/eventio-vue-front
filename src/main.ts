import {createApp} from 'vue'
import {createPinia} from 'pinia'
import App from '@/App.vue'

// Vuetify
import 'vuetify/styles'
import {createVuetify} from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'

// Router
import router from '@/router'

// Internationalization
import i18n from '@/i18n'

// Toast
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import {DEFAULT_TOAST_CONFIG} from '@/constants/app'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

// Global styles
import '@/styles.scss'

const vuetify = createVuetify({
   components,
   directives,
   icons: {
      defaultSet: 'mdi'
   }
})

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const app = createApp(App)
   .use(vuetify)
   .use(pinia)
   .use(i18n as any)
   .use(Toast, DEFAULT_TOAST_CONFIG as any)
   .use(router)

   

app.mount('#app')
