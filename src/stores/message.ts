import type { MessageType, UIMessage, UIMessageConfig } from '@/types'
import { defineStore } from 'pinia'

export const useMessageStore = defineStore('message', () => {
  let messageCount = 0

  const messages = ref<UIMessageConfig[]>([])

  const add = (config: UIMessage, type: MessageType) => {
    messageCount += 1
    const id = `message_${messageCount}`
    const message: UIMessageConfig = reactive({
      id,
      type: type,
      duration: 3000,
      close: false,
      ...config
    })
    messages.value.push(message)
  }

  const close = (id: string) => {
    const index = messages.value.findIndex((item) => item.id === id)
    if (index !== -1) {
      messages.value.splice(index, 1)
    }
  }

  return {
    messages,
    success: (config: UIMessage) => add(config, 'success'),
    error: (config: UIMessage) => add(config, 'error'),
    warn: (config: UIMessage) => add(config, 'warn'),
    info: (config: UIMessage) => add(config, 'info'),
    close
  }
})
