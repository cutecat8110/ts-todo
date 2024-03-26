<template>
  <Teleport to="#app">
    <Transition name="scroll-top">
      <div
        v-if="scrollTopIsShow"
        class="fixed bottom-10 right-10 z-10 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-black/20 text-[2.163rem] text-white transition-all hover:bg-black/40 hover:shadow"
        @click="scrollTop()"
      >
        <Icon icon="ic:round-vertical-align-top" />
      </div>
    </Transition>
  </Teleport>
</template>

<script lang="ts" setup>
import { useWindowScroll, useWindowSize } from '@vueuse/core'

/* 至頂 */
const { height } = useWindowSize()
const { y } = useWindowScroll({ behavior: 'smooth' })
const scrollTop = () => {
  y.value = 0
}

// 至頂: 按鈕顯示
const scrollTopIsShow = computed(() => y.value > height.value / 2)
</script>

<style lang="scss" scoped>
.scroll-top-enter-active,
.scroll-top-leave-active {
  transition: opacity 0.5s ease;
}

.scroll-top-enter-from,
.scroll-top-leave-to {
  opacity: 0;
}
</style>
