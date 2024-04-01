<template>
  <TransitionGroup class="ui-message-list" name="ui-message-list" tag="ul">
    <UIMessage
      v-for="message in messageStore.messages"
      :key="message.id"
      v-bind="message"
      :message="message"
    />
  </TransitionGroup>
</template>

<script lang="ts" setup>
import UIMessage from '@/components/ui/UIMessage.vue'
import { useMessageStore } from '@/stores'

/* 全局屬性 */
const messageStore = useMessageStore()
</script>

<style lang="scss" scoped>
.ui-message-list {
  @apply pointer-events-none fixed top-6 z-[11] space-y-2;
}

.ui-message-list-move {
  transition: all 0.2s ease-in-out;
}

.ui-message-list-enter-active {
  transition: all 0.2s ease-out;
}

.ui-message-list-leave-active {
  transition: all 0.15s ease-in;
}

.ui-message-list-enter-from {
  opacity: 0;
  transform: translateY(1.5rem);
}

.ui-message-list-leave-to {
  opacity: 0;
  transform: translateY(1.5rem);
}

.ui-message-list-leave-active {
  position: absolute;
}
</style>
