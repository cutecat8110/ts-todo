import { defineStore } from 'pinia'

export const useCommonStore = defineStore(
  'common',
  () => {
    const auth = ref({
      token: '',
      nickname: ''
    })

    return {
      auth
    }
  },
  { persist: true }
)
