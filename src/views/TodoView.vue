<template>
  <div class="flex min-h-screen flex-col">
    <header class="backdrop-blur-sm bg-white/90 sticky top-0 mb-4">
      <div
        class="container border-b-2 border-black flex h-16 items-center justify-between gap-6 overflow-hidden text-nowrap text-4xl"
      >
        <h1 class="font-bold text-blue-600 tracking-widest">TS Todo</h1>
        <UIButton
          icon="ic:baseline-logout"
          trailing
          label="登出"
          variant="link"
          size="lg"
          @click="logoutExecute"
        />
      </div>
    </header>

    <main class="flex-1 py-10 my-bg">
      <div class="container lg:max-w-[50rem] space-y-4">
        <section class="font-black text-2xl">
          {{ amPm }}，{{ commonStore.auth.nickname }}，歡迎你回來👋
        </section>
        <section class="bg-gray-100 rounded-xl p-6 space-y-6">
          <div class="text-gray-600 font-black flex justify-between items-center">
            <div class="flex gap-2 text-[2.5rem] leading-none">
              {{ $dayjs(now).format('DD') }}
              <div class="text-sm">
                <div>
                  {{ $dayjs(now).format('MMM YYYY') }}
                </div>
                <div class="text-end">
                  {{ $dayjs(now).format('HH:mm:ss') }}
                </div>
              </div>
            </div>
            <div class="text-2xl text-gray-600">
              {{ $dayjs(now).format('dddd') }}
            </div>
          </div>
          <div class="space-x-4 flex">
            <textarea
              ref="textarea"
              v-model="input"
              class="resize-none ring-gray-300 flex-1 focus:ring-blue-600 rounded-md px-4 py-2 outline-none ring-1 ring-inset"
              placeholder="Todo"
            />
            <UIButton label="新增" size="lg" />
          </div>
        </section>
        <section
          class="font-black rounded-xl border-2 bg-white items-center gap-2 flex p-3 hover:border-gray-300 hover:shadow transition-all cursor-pointer"
          v-for="(item, index) in 100"
          :key="index"
        >
          <Icon icon="ic:round-done" class="text-xl text-gray-300" />
          吃飯飯、嗑藥藥、睡覺覺、打東東
        </section>
      </div>
    </main>

    <footer class="bg-white border-t">
      <div class="container flex h-14 items-center justify-center">
        <h6 class="text-sm font-bold text-gray-600">Copyright © 2024 by Hao</h6>
      </div>
    </footer>
  </div>
</template>

<script lang="ts" setup>
import { logout } from '@/api/index'
import { useCommonStore, useStyleStore } from '@/stores'
import { useNow, useTextareaAutosize } from '@vueuse/core'

/* 全局屬性 */
const commonStore = useCommonStore()
const useStyle = useStyleStore()
const router = useRouter()
const Swal = getCurrentInstance()?.proxy?.$Swal
const dayjs = getCurrentInstance()?.proxy?.$dayjs

/* Textarea 自動調整大小 */
const { textarea, input } = useTextareaAutosize()

/* 當前時間 */
const now = useNow()

/* 時間問候 */
const amPm = computed(() => {
  const currentHour = dayjs?.(now.value).hour()

  if (currentHour === undefined) return ''
  if (currentHour < 4) return '午夜好'
  if (currentHour < 12) return '早上好'
  if (currentHour < 18) return '下午好'
  if (currentHour < 21) return '傍晚好'
  return '晚上好'
})

/* API 狀態 */
const apiFetching = computed(() => logoutFetching.value)

/* 登出 API */
const { isFetching: logoutFetching, execute: logoutExecute } = logout({
  afterFetch({ data }) {
    commonStore.auth = {
      token: '',
      nickname: ''
    }
    router.push({ name: 'login' })
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
.my-bg {
  background-color: #fff;
  background-image: linear-gradient(90deg, rgba(9, 9, 9, 0.05) 1px, transparent 0),
    linear-gradient(180deg, rgba(9, 9, 9, 0.05) 1px, transparent 0);
  background-position-x: center;
  background-position-y: 0;
  background-size: 45px 45px;
}
</style>
