import dayjs from 'dayjs'
import type { App } from 'vue'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $dayjs: typeof dayjs
  }
}

export default {
  install: (app: App<Element>): void => {
    app.config.globalProperties.$dayjs = dayjs
  }
}
