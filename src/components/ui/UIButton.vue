<template>
  <button
    :class="[
      cssColor,
      textSize,
      cssShape,
      props.trailing && 'flex-row-reverse',
      props.round ? 'rounded-full' : 'rounded',
      props.block && 'w-full min-w-full',
      'flex items-center justify-center gap-2 font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-75'
    ]"
    type="button"
  >
    <Icon v-if="currentIcon" :class="[iconSize, 'leading-none']" :icon="currentIcon" />
    {{ props.label }}
  </button>
</template>

<script lang="ts" setup>
import type { UIButtonVariant, UIButtonColor } from '@/types'

const props = defineProps({
  icon: String,
  label: String,
  loading: Boolean,
  trailing: Boolean,
  round: Boolean,
  block: Boolean,
  square: Boolean,
  link: Boolean,
  outline: Boolean,
  variant: {
    type: String as PropType<UIButtonVariant>,
    default: 'solid'
  },
  color: {
    type: String as PropType<UIButtonColor>,
    default: 'default'
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
      default:
        'bg-white text-gray-300 ring-1 ring-inset ring-current hover:text-blue-600 disabled:bg-white',
      lightGray: 'bg-gray-300 text-white hover:bg-gray-400 disabled:bg-gray-300',
      darkGray: 'bg-gray-600 text-white hover:bg-gray-700 disabled:bg-gray-600',
      blue: 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-600',
      green: 'bg-green-600 text-white hover:bg-green-700 disabled:bg-green-600',
      red: 'bg-red-600 text-white hover:bg-red-700 disabled:bg-red-600'
    },
    outline: {
      default:
        'bg-transparent text-gray-300 ring-1 ring-inset ring-current hover:text-blue-600 hover:bg-blue-50 disabled:bg-transparent',
      lightGray:
        'bg-transparent text-gray-300 ring-1 ring-inset ring-current hover:bg-gray-50 disabled:bg-transparent',
      darkGray:
        'bg-transparent text-gray-600 ring-1 ring-inset ring-current hover:bg-gray-50 disabled:bg-transparent',
      blue: 'bg-transparent text-blue-600 ring-1 ring-inset ring-current hover:bg-blue-50 disabled:bg-transparent',
      green:
        'bg-transparent text-green-600 ring-1 ring-inset ring-current hover:bg-green-50 disabled:bg-transparent',
      red: 'bg-transparent text-red-600 ring-1 ring-inset ring-current hover:bg-red-50 disabled:bg-transparent'
    },
    link: {
      default:
        'text-gray-300 underline-offset-4 hover:text-blue-700 hover:underline disabled:text-gray-300 disabled:no-underline',
      lightGray:
        'text-gray-300 underline-offset-4 hover:text-gray-400 hover:underline disabled:text-gray-300 disabled:no-underline',
      darkGray:
        'text-gray-600 underline-offset-4 hover:text-gray-700 hover:underline disabled:text-gray-600 disabled:no-underline',
      blue: 'text-blue-600 underline-offset-4 hover:text-blue-700 hover:underline disabled:text-blue-600 disabled:no-underline',
      green:
        'text-green-600 underline-offset-4 hover:text-green-700 hover:underline disabled:text-green-600 disabled:no-underline',
      red: 'text-red-600 underline-offset-4 hover:text-red-700 hover:underline disabled:text-red-600 disabled:no-underline'
    },
    text: {
      default:
        'text-gray-300 underline-offset-4 hover:text-blue-700 disabled:text-gray-300 disabled:no-underline',
      lightGray:
        'text-gray-300 underline-offset-4 hover:text-gray-400 disabled:text-gray-300 disabled:no-underline',
      darkGray:
        'text-gray-600 underline-offset-4 hover:text-gray-700 disabled:text-gray-600 disabled:no-underline',
      blue: 'text-blue-600 underline-offset-4 hover:text-blue-700 disabled:text-blue-600 disabled:no-underline',
      green:
        'text-green-600 underline-offset-4 hover:text-green-700 disabled:text-green-600 disabled:no-underline',
      red: 'text-red-600 underline-offset-4 hover:text-red-700 disabled:text-red-600 disabled:no-underline'
    }
  }[props.variant][props.color]
})

const textSize = computed(() => {
  return {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  }[props.size]
})

const iconSize = computed(() => {
  return {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl'
  }[props.size]
})

const cssShape = computed(() => {
  return props.square
    ? { sm: 'h-6 w-6', md: 'h-8 w-8', lg: 'h-10 w-10' }[props.size]
    : {
        sm: 'px-2 py-1 min-w-12 gap-x-1',
        md: 'px-2.5 py-1.5 min-w-16 gap-x-1.5',
        lg: 'px-3 py-2 min-w-20 gap-x-2.5'
      }[props.size]
})
</script>
