<template>
  <div class="signup-view">
    <div class="container flex min-h-screen items-center justify-center py-12">
      <VForm
        ref="formRefs"
        v-slot="{ errors }"
        class="flex max-w-80 flex-1 flex-col gap-16 pb-16"
        @submit="signupExecute()"
      >
        <div class="tracking-widest">
          <h1 class="text-center text-4xl font-bold text-green-600">TS Todo</h1>
          <h2 class="mt-2 text-center text-sm text-gray-400">Sign up for System</h2>
        </div>
        <div class="space-y-4">
          <label class="block" for="email">
            <div class="font-bold">電子信箱</div>
            <div class="relative">
              <VField
                id="email"
                v-model.trim="fromData.email"
                :class="[
                  errors.email
                    ? 'ring-red-600'
                    : 'ring-gray-300 hover:ring-green-600 focus:ring-green-600',
                  'mt-2 w-full rounded-md py-2 pl-4 pr-10 outline-none ring-1 ring-inset transition-all'
                ]"
                name="email"
                label="電子信箱"
                type="text"
                rules="required"
                :disabled="apiFetching"
              />

              <UITooltip
                class="!absolute right-2 top-1/2 -translate-y-1/2 pt-2"
                text="自動填入預設"
              >
                <UIButton
                  color="lightGray"
                  icon="ic:round-vpn-key"
                  size="sm"
                  square
                  variant="text"
                  @click="autofill"
                />
              </UITooltip>
            </div>
            <ErrorMessage class="mt-2 block text-red-600" name="email" />
          </label>
          <label class="block" for="password">
            <div class="font-bold">密碼</div>
            <div class="relative">
              <VField
                id="password"
                v-model.trim="fromData.password"
                :class="[
                  errors.password
                    ? 'ring-red-600'
                    : 'ring-gray-300 hover:ring-green-600 focus:ring-green-600',
                  'mt-2 w-full rounded-md py-2 pl-4 pr-10 outline-none ring-1 ring-inset transition-all'
                ]"
                name="password"
                label="密碼"
                :type="typeIsPassword ? 'password' : 'text'"
                rules="required|min:6"
                :disabled="apiFetching"
              />
              <UIButton
                class="!absolute right-2 top-1/2 -translate-y-1/2 pt-2"
                :icon="typeIsPassword ? 'ic:round-visibility-off' : 'ic:round-visibility'"
                color="lightGray"
                size="sm"
                square
                variant="text"
                @click="typeIsPassword = !typeIsPassword"
              />
            </div>
            <ErrorMessage class="mt-2 block text-red-600" name="password" />
          </label>
          <label class="block" for="nickname">
            <div class="font-bold">暱稱</div>
            <VField
              id="nickname"
              v-model.trim="fromData.nickname"
              :class="[
                errors.nickname
                  ? 'ring-red-600'
                  : 'ring-gray-300 hover:ring-green-600 focus:ring-green-600',
                'mt-2 w-full rounded-md px-4 py-2 outline-none ring-1 ring-inset transition-all'
              ]"
              name="nickname"
              label="暱稱"
              type="text"
              rules="required"
              :disabled="apiFetching"
            />
            <ErrorMessage class="mt-2 block text-red-600" name="nickname" />
          </label>
        </div>
        <div class="space-y-4">
          <UIButton
            label="註冊"
            type="submit"
            block
            color="green"
            size="lg"
            :disabled="apiFetching"
          />
          <RouterLink v-slot="{ navigate }" :to="{ name: 'login' }" custom>
            <UIButton
              class="mx-auto"
              label="登入"
              color="green"
              size="lg"
              variant="link"
              :disabled="apiFetching"
              @click="navigate"
            />
          </RouterLink>
        </div>
        <PageCopyright />
      </VForm>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { signupAPI } from '@/api'
import { useStyleStore, useMessageStore } from '@/stores'
import type { SignupForm } from '@/types'

/* 全局屬性 */
const useStyle = useStyleStore()
const messageStore = useMessageStore()
const router = useRouter()
const Swal = getCurrentInstance()?.proxy?.$Swal

/* 表單 */
const formRefs = ref<HTMLFormElement | null>(null)
const fromData = ref<SignupForm>({
  email: '',
  password: '',
  nickname: ''
})
const typeIsPassword = ref<boolean>(true)

/* 自動填入 */
const autofill = () => {
  fromData.value = {
    email: 'test@example.com',
    password: 'test123456',
    nickname: '小明'
  }
  messageStore.success({
    message: `已自動填入.`
  })
}

/* 註冊 API */
const { isFetching: apiFetching, execute: signupExecute } = signupAPI({
  afterFetch({ data }) {
    Swal?.fire({
      title: '註冊成功!',
      text: '登入你的 TS Todo 帳戶',
      icon: 'success',
      confirmButtonText: '前往',
      confirmButtonColor: useStyle.confirmButtonColor,
      willClose: () => {
        router.push({ name: 'login' })
      }
    })
    return data
  },
  onFetchError({ data }) {
    Swal?.fire({
      title: data.message,
      icon: 'error',
      showConfirmButton: false,
      timer: 2000,
      willClose: () => {
        document.getElementById('email')?.focus()
      }
    })
    return data
  }
}).post(computed(() => fromData.value))
</script>

<style lang="scss" scoped>
.signup-view {
  background-color: #fff;
  background-image: linear-gradient(90deg, rgb(243 244 246) 1px, transparent 0),
    linear-gradient(180deg, rgb(243 244 246) 1px, transparent 0);
  background-position-x: center;
  background-size: 3.75rem 3.75rem;
}
</style>
