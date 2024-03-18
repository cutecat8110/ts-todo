import { useCommonStore } from '@/stores/common'
import type { UseFetchOptions } from '@vueuse/core'
import { createFetch } from '@vueuse/core'
interface MyFetchOptions extends UseFetchOptions {
  params?: {}
}

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

const MyFetch = (url: string, method: string, options: MyFetchOptions) => {
  const { params = {}, ...otherOptions } = options

  const replacedUrl = Object.entries(params).reduce((accUrl, [key, value]) => {
    return (accUrl as string).replace(`{${key}}`, value as string)
  }, url)

  return fetch(replacedUrl, { method: method }, otherOptions).json()
}

export default class Http {
  static get(url: string, options: MyFetchOptions) {
    return MyFetch(url, 'GET', options)
  }

  static post(url: string, options: MyFetchOptions) {
    return MyFetch(url, 'POST', options)
  }

  static put(url: string, options: MyFetchOptions) {
    return MyFetch(url, 'PUT', options)
  }

  static delete(url: string, options: MyFetchOptions) {
    return MyFetch(url, 'DELETE', options)
  }

  static patch(url: string, options: MyFetchOptions) {
    return MyFetch(url, 'PATCH', options)
  }
}
