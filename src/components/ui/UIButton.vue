<template>
  <button
    :class="[
      cssColor,
      cssSize,
      props.trailing && 'flex-row-reverse',
      props.round ? 'rounded-full' : 'rounded',
      props.block && 'w-full min-w-full',
      'flex items-center justify-center gap-2 font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-75'
    ]"
    type="button"
  >
    <Icon v-if="currentIcon" :icon="currentIcon" />
    {{ props.label }}
  </button>
</template>

<script lang="ts" setup>
type UIButtonVariant = 'solid' | 'outline' | 'link'
type UIButtonColor = 'blue' | 'green' | 'red'

const props = defineProps({
  icon: String,
  label: String,
  loading: Boolean,
  trailing: Boolean,
  round: Boolean,
  block: Boolean,
  link: Boolean,
  outline: Boolean,
  variant: {
    type: String as PropType<UIButtonVariant>,
    default: 'solid'
  },
  color: {
    type: String as PropType<UIButtonColor>,
    default: 'blue'
  },
  size: {
    type: String,
    default: 'md'
  }
})

const currentIcon = computed(() => {
  return props.loading ? 'line-md:loading-twotone-loop' : props.icon
})

const cssColor = computed(() => {
  return {
    solid: {
      blue: 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-600',
      green: 'bg-green-600 text-white hover:bg-green-700 disabled:bg-green-600',
      red: 'bg-red-600 text-white hover:bg-red-700 disabled:bg-red-600'
    },
    outline: {
      blue: 'bg-white text-blue-600 ring-1 ring-inset ring-current hover:bg-blue-50 disabled:bg-white',
      green:
        'bg-white text-green-600 ring-1 ring-inset ring-current hover:bg-green-50 disabled:bg-white',
      red: 'bg-white text-red-600 ring-1 ring-inset ring-current hover:bg-red-50 disabled:bg-white'
    },
    link: {
      blue: 'text-blue-600 underline-offset-4 hover:text-blue-700 hover:underline disabled:text-blue-600 disabled:no-underline',
      green:
        'text-green-600 underline-offset-4 hover:text-green-700 hover:underline disabled:text-green-600 disabled:no-underline',
      red: 'text-red-600 underline-offset-4 hover:text-red-700 hover:underline disabled:text-red-600 disabled:no-underline'
    }
  }[props.variant][props.color]
})

const cssSize = computed(() => {
  return {
    sm: 'px-2 py-1 text-xs gap-x-1',
    md: 'px-2.5 py-1.5 text-sm gap-x-1.5 min-w-16',
    lg: 'px-3 py-2 text-base gap-x-2.5 min-w-20'
  }[props.size]
})
</script>
