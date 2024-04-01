<template>
  <Transition name="scroll-top">
    <div v-if="scrollTopIsShow" class="ui-scroll-top" @click="scrollTop()">
      <Icon icon="ic:round-vertical-align-top" />
    </div>
  </Transition>
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
const scrollTopIsShow = computed(() => y.value > height.value / 4)
</script>

<style lang="scss" scoped>
.ui-scroll-top {
  @apply fixed bottom-10 right-10 z-10 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-black/20 text-[2.163rem] text-white transition-all hover:bg-black/40 hover:shadow;
}

.scroll-top-enter-active {
  transition: all 0.2s ease-out;
}

.scroll-top-leave-active {
  transition: all 0.15s ease-in;
}

.scroll-top-enter-from {
  opacity: 0;
  transform: translateY(-1.5rem);
}

.scroll-top-leave-to {
  opacity: 0;
  transform: translateY(-1.5rem);
}
</style>
