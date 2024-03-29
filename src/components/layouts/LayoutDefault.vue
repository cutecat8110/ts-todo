<template>
  <div class="layout-default">
    <!-- Header -->
    <header class="sticky top-0 z-10 border-b bg-white/90 backdrop-blur-sm">
      <div
        class="container flex h-16 items-center justify-between gap-6 overflow-hidden text-nowrap text-4xl"
      >
        <h1 class="select-none font-bold tracking-widest text-blue-600">TS Todo</h1>
        <UIButton
          label="登出"
          color="blue"
          icon="ic:baseline-logout"
          size="lg"
          trailing
          variant="link"
          :disabled="logoutFetching"
          @click="logoutExecute"
        />
      </div>
    </header>

    <!-- Main Content -->
    <slot />

    <!-- Footer -->
    <footer class="border-t bg-white">
      <div class="container flex h-14 items-center justify-center">
        <h6 class="text-sm font-bold text-gray-600">Copyright © 2024 by Hao</h6>
      </div>
    </footer>
  </div>
</template>

<script lang="ts" setup>
import { logoutAPI } from '@/api'
import { useCommonStore, useStyleStore, useMessageStore } from '@/stores'

/* 全局屬性 */
const commonStore = useCommonStore()
const messageStore = useMessageStore()
const useStyle = useStyleStore()
const router = useRouter()
const Swal = getCurrentInstance()?.proxy?.$Swal

/* 登出 API */
const { isFetching: logoutFetching, execute: logoutExecute } = logoutAPI({
  afterFetch({ data }) {
    commonStore.auth = {
      token: '',
      nickname: ''
    }
    router.push({ name: 'login' })
    messageStore.info({
      message: `${data.message}.`
    })
    return { data }
  },
  onFetchError({ data }) {
    Swal?.fire({
      title: '驗證失敗',
      text: '請重新登入',
      icon: 'warning',
      confirmButtonText: '確認',
      confirmButtonColor: useStyle.confirmButtonColor,
      allowOutsideClick: false,
      willClose: () => {
        commonStore.auth = {
          token: '',
          nickname: ''
        }
        router.push({ name: 'login' })
      }
    })
    return data
  }
})
</script>

<style lang="scss" scoped>
.layout-default {
  @apply flex min-h-screen flex-col;
  background-color: #fff;
  background-image: linear-gradient(90deg, rgb(243 244 246) 1px, transparent 0),
    linear-gradient(180deg, rgb(243 244 246) 1px, transparent 0);
  background-position-x: center;
  background-position-y: -1px;
  background-size: 45px 45px;
}
</style>
