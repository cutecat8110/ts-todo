<template>
  <TransitionGroup class="ui-message-list" name="list" tag="ul">
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

.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.list-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}

.list-leave-active {
  position: absolute;
}
</style>
