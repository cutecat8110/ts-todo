import { defineStore } from 'pinia'
import colors from 'tailwindcss/colors'

export const useStyleStore = defineStore('style', () => {
  const confirmButtonColor = ref(colors.blue['600'])

  return {
    confirmButtonColor
  }
})
