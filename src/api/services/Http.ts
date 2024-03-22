import { useCommonStore } from '@/stores/common'
import type { UseFetchOptions } from '@vueuse/core'
import { createFetch } from '@vueuse/core'

const fetch = createFetch({
  baseUrl: import.meta.env.VITE_BASE_API,
  fetchOptions: {
    headers: {
      'Content-Type': 'application/json'
    }
  },
  options: {
    immediate: false, // 是否自動運行
    timeout: 30000, // 請求過期時間
    beforeFetch({ options }) {
      const commonStore = useCommonStore()
      if (commonStore.auth.token !== '') {
        options.headers = { ...options.headers, Authorization: commonStore.auth.token }
      }
      return { options }
    },
    afterFetch({ data, response }) {
      return { data, response }
    },
    onFetchError({ data, error }) {
      return { data, error }
    }
  }
})

export default class Http {
  static get(url: string, options: UseFetchOptions) {
    return fetch(url, { method: 'GET' }, options).json()
  }

  static post(url: string, options: UseFetchOptions) {
    return fetch(url, { method: 'POST' }, options).json()
  }

  static put(url: string, options: UseFetchOptions) {
    return fetch(url, { method: 'PUT' }, options).json()
  }

  static delete(url: string, options: UseFetchOptions) {
    return fetch(url, { method: 'DELETE' }, options).json()
  }

  static patch(url: string, options: UseFetchOptions) {
    return fetch(url, { method: 'PATCH' }, options).json()
  }
}
