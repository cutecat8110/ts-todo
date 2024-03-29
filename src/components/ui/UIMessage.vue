<template>
  <li class="ui-message" :style="paddingX">
    <div
      class="pointer-events-auto inline-flex items-center rounded-md bg-white/90 p-1 font-bold text-gray-600 shadow ring-1 ring-inset ring-gray-200"
    >
      <UIButton
        :color="iconColor"
        :icon="typeIcon"
        size="lg"
        square
        variant="text"
        @click="handleClose"
      />
      <div :class="[!message.close && 'pr-4', 'py-2 leading-4']">
        {{ message.message }}
      </div>
      <UIButton
        v-if="message.close"
        color="lightGray"
        icon="ic:round-close"
        square
        variant="text"
        @click="handleClose"
      />
    </div>
  </li>
</template>

<script lang="ts" setup>
import type { UIMessageConfig } from '@/types'
import { useMessageStore } from '@/stores'

/* Props */
const props = defineProps({
  message: { type: {} as PropType<UIMessageConfig>, required: true }
})

/* 全局屬性 */
const messageStore = useMessageStore()

/* 方法: 關閉 */
const handleClose = () => {
  messageStore.close(props.message.id)
}

/* 存在時長 */
const timer = ref<number | null>(null)
onMounted(() => {
  if (props.message.duration > 0) {
    timer.value = setTimeout(handleClose, props.message.duration)
  }
})
onUnmounted(() => {
  if (timer.value !== null) {
    clearTimeout(timer.value)
    timer.value = null
  }
})

/* 間距 */
const paddingX = computed(() => {
  return document.documentElement.scrollHeight > window.innerHeight
    ? {
        paddingLeft: '0.75rem',
        paddingRight: `calc(${window.innerWidth - document.documentElement.clientWidth}px + 0.75rem)`
      }
    : { padding: '0 0.75rem' }
})

/* Icon 狀態 */
const typeIcon = computed(() => {
  switch (props.message.type) {
    case 'success':
      return 'ic:round-check-circle'
    case 'error':
      return 'ic:round-cancel'
    case 'warn':
      return 'ic:round-error'
    case 'info':
      return 'ic:round-error'
    default:
      return ''
  }
})
// Icon 顏色
const iconColor = computed(() => {
  switch (props.message.type) {
    case 'success':
      return 'green'
    case 'error':
      return 'red'
    case 'warn':
      return 'yellow'
    default:
      return 'lightGray'
  }
})
</script>

<style lang="scss" scoped>
.ui-message {
  @apply w-screen text-center;
}
</style>
