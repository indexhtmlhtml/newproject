import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { createI18n } from 'vue-i18n'
import { messages } from './locales'

const app = createApp(App)
const pinia = createPinia()

// 创建 i18n 实例
const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('language') || 'zh',
  messages,
  fallbackLocale: 'zh'
})

app.use(pinia)
app.use(router)
app.use(i18n)
app.mount('#app')
