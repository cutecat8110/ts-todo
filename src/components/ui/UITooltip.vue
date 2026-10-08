<template>
  <div class="ui-tooltip" @mouseenter="enter" @mouseleave="hovered = false"
    @focusin="focused = true; dismissed = false" @focusout="focused = false" @keydown.esc="dismissed = true">
    <slot />
    <Transition name="ui-tooltip">
      <div v-if="(hovered || focused) && !dismissed" aria-hidden="true"
        class="tooltip-content pointer-events-auto absolute right-0 top-full z-20 mt-1 whitespace-nowrap rounded-md bg-white px-4 py-2 text-sm leading-6 tracking-wide text-gray-600 ring-1 ring-gray-300">
        {{ props.text }}
      </div>
    </Transition>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({ text: String })
const hovered = ref(false)
const focused = ref(false)
const dismissed = ref(false)
function enter() { hovered.value = true; dismissed.value = false }
</script>

<style lang="scss" scoped>
.ui-tooltip { @apply relative inline-block; }
.tooltip-content::before { content: ''; position: absolute; inset: -0.25rem 0 100%; }
.ui-tooltip-enter-active { transition: opacity 0.2s ease-out, transform 0.2s ease-out; }
.ui-tooltip-leave-active { transition: opacity 0.15s ease-in, transform 0.15s ease-in; }
.ui-tooltip-enter-from, .ui-tooltip-leave-to { opacity: 0; transform: translateY(0.25rem); }
</style>
