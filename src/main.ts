/* eslint-disable vue/multi-word-component-names */
import './assets/style.css'

import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { createApp } from 'vue'

import App from './App.vue'
import router from './router'

/* Vee Validate */
import { localize, setLocale } from '@vee-validate/i18n'
import zhTW from '@vee-validate/i18n/dist/locale/zh_TW.json'
import { email, min, required } from '@vee-validate/rules'
import { ErrorMessage, Field, Form, configure, defineRule } from 'vee-validate'
defineRule('required', required)
defineRule('email', email)
defineRule('min', min)
configure({
  generateMessage: localize({ zh_TW: zhTW }) // 載入繁體中文語系
})
setLocale('zh_TW') // 設定預設語系

import dayjs from '@/plugins/dayjs'
import gsap from '@/plugins/gsap'
import Swal from '@/plugins/sweetalert2'
import { Icon } from '@iconify/vue'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const app = createApp(App)
app.use(pinia)
app.use(router)

app.component('ErrorMessage', ErrorMessage)
app.component('VField', Field)
app.component('VForm', Form)
app.component('Icon', Icon)

app.use(dayjs)
app.use(Swal)
app.use(gsap)

app.mount('#app')
