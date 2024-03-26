import { gsap } from 'gsap'
import type { App } from 'vue'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $gsap: typeof gsap
  }
}

export default {
  install: (app: App<Element>): void => {
    app.config.globalProperties.$gsap = gsap
  }
}
