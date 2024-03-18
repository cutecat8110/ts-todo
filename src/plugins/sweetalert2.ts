import Swal from 'sweetalert2'
import type { App } from 'vue'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $Swal: typeof Swal
  }
}

export default {
  install: (app: App<Element>): void => {
    app.config.globalProperties.$Swal = Swal
  }
}
