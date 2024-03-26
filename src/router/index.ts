import { authAPI } from '@/api'
import { useCommonStore, useStyleStore } from '@/stores'
import Swal from 'sweetalert2'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'todo',
      component: () => import('../views/TodoView.vue')
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('../views/SignupView.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/test',
      name: 'test',
      component: () => import('../views/testView.vue')
    }
  ]
})

router.beforeEach(async (to) => {
  if (to.path === '/') {
    const commonStore = useCommonStore()
    if (commonStore.auth.token == '') {
      return { name: 'login' }
    }
    const { error } = await authAPI({ immediate: true })
    if (error.value) {
      const useStyle = useStyleStore()
      const result = await Swal.fire({
        title: '驗證失敗',
        text: '請重新登入',
        icon: 'warning',
        confirmButtonText: '確認',
        confirmButtonColor: useStyle.confirmButtonColor,
        allowOutsideClick: false
      })
      if (result.value) {
        commonStore.auth = {
          token: '',
          nickname: ''
        }
        return { name: 'login' }
      }
    }
  }
})

export default router
