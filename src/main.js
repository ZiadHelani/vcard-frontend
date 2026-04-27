import './assets/scroll.css'
import './assets/main.css'
import './assets/dashboard.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import { vuetify, Toast, toastOptions, i18n } from './plugins'
import { useAuthStore } from './stores/auth'
import { createHead } from '@vueuse/head'

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL
axios.defaults.withCredentials = true
axios.defaults.withXSRFToken = true

const pinia = createPinia()
const app = createApp(App)
const head = createHead()

app.use(pinia)
app.use(i18n)
app.use(vuetify)
app.use(Toast, toastOptions)
app.use(router)
app.use(head)

// Initialize authentication store after pinia is set up
const authStore = useAuthStore()
authStore.initializeAuth()

app.mount('#app')
