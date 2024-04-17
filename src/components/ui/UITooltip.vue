<template>
  <div ref="UITooltip" class="ui-tooltip">
    <slot />
    <Transition name="ui-tooltip">
      <div
        v-if="!isOutside"
        class="-translate-Y-1/2 pointer-events-auto absolute left-1/2 -translate-x-1/2 text-nowrap rounded-md bg-white px-4 py-2 text-sm leading-6 tracking-wide text-gray-600 ring-1 ring-gray-300"
      >
        {{ props.text }}
      </div>
    </Transition>
  </div>
</template>

<script lang="ts" setup>
import { useMouseInElement } from '@vueuse/core'

const props = defineProps({
  text: String
})

const UITooltip = ref(null)
const { isOutside } = useMouseInElement(UITooltip)
</script>

<style lang="scss" scoped>
.ui-tooltip {
  @apply relative inline-block;
}

.ui-tooltip-enter-active {
  transition: all 0.2s ease-out;
}

.ui-tooltip-leave-active {
  transition: all 0.15s ease-in;
}

.ui-tooltip-enter-from,
.ui-tooltip-leave-to {
  opacity: 0;
  transform: translate(-50%, 0.25rem);
}
</style>
