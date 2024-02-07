import './assets/style.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

/* Vee Validate */
import { Form, Field, ErrorMessage, defineRule, configure } from 'vee-validate'
import { required } from '@vee-validate/rules'
import { localize, setLocale } from '@vee-validate/i18n'
import zhTW from '@vee-validate/i18n/dist/locale/zh_TW.json'
defineRule('required', required)
configure({
  generateMessage: localize({ zh_TW: zhTW }), // 載入繁體中文語系
  validateOnInput: true // 當輸入任何內容直接進行驗證
})
setLocale('zh_TW') // 設定預設語系

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.component('ErrorMessage', ErrorMessage)
app.component('VField', Field)
app.component('VForm', Form)

app.mount('#app')
