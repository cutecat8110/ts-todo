import { authAPI } from '@/api'
import { useCommonStore, useMessageStore } from '@/stores'
import { apiFailure } from '@/utils/api-error'
import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
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
    }
  ]
})

router.beforeEach(async (to) => {
  if (to.name !== 'todo') return
  const commonStore = useCommonStore()
  const token = commonStore.auth.token
  if (!token) return { name: 'login' }
  const { error, data, statusCode } = await authAPI({ immediate: true })
  if (commonStore.auth.token !== token) return false
  if (error.value || data.value?.status === false) {
    const expired = statusCode.value === 401
    if (expired) commonStore.auth = { token: '', nickname: '' }
    useMessageStore().error({ message: expired ? '登入已失效，請重新登入。' : apiFailure(data.value, error.value, statusCode.value).message })
    return { name: 'login' }
  }
})

export default router
