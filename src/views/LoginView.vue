<template>
  <div class="login-view">
    <div class="container flex min-h-screen items-center justify-center py-12">
      <VForm
        ref="formRefs"
        v-slot="{ errors }"
        class="flex max-w-80 flex-1 flex-col gap-16 pb-16"
        @submit="submit"
      >
        <div class="tracking-widest">
          <h1 class="text-center text-4xl font-bold text-blue-600">TS Todo</h1>
          <h2 class="mt-2 text-center text-sm text-gray-400">Sign in to System</h2>
        </div>
        <div class="space-y-4">
          <div class="block">
            <label class="block font-bold" for="email">電子信箱</label>
            <div class="relative">
              <VField
                id="email"
                v-model.trim="fromData.email"
                :class="[
                  errors.email
                    ? 'ring-red-600'
                    : 'ring-gray-300 hover:ring-blue-600 focus:ring-blue-600',
                  'mt-2 w-full rounded-md py-2 pl-4 pr-10 outline-none ring-1 ring-inset transition-all'
                ]"
                name="email"
                label="電子信箱"
                type="email"
                autocomplete="username"
                rules="required|email"
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
                  aria-label="自動填入預設"
                  :disabled="apiFetching"
                  @click="autofill"
                />
              </UITooltip>
            </div>
            <ErrorMessage class="mt-2 block text-red-600" name="email" />
          </div>
          <div class="block">
            <label class="block font-bold" for="password">密碼</label>
            <div class="relative">
              <VField
                id="password"
                v-model="fromData.password"
                :class="[
                  errors.password
                    ? 'ring-red-600'
                    : 'ring-gray-300 hover:ring-blue-600 focus:ring-blue-600',
                  'mt-2 w-full rounded-md py-2 pl-4 pr-10 outline-none ring-1 ring-inset transition-all'
                ]"
                name="password"
                label="密碼"
                autocomplete="current-password"
                :type="typeIsPassword ? 'password' : 'text'"
                rules="required"
                :disabled="apiFetching"
              />

              <UIButton
                class="!absolute right-2 top-1/2 -translate-y-1/2 pt-2"
                :icon="typeIsPassword ? 'ic:round-visibility-off' : 'ic:round-visibility'"
                color="lightGray"
                size="sm"
                square
                variant="text"
                :aria-label="typeIsPassword ? '顯示密碼' : '隱藏密碼'"
                :aria-pressed="!typeIsPassword"
                @click="typeIsPassword = !typeIsPassword"
              />
            </div>
            <ErrorMessage class="mt-2 block text-red-600" name="password" />
          </div>
        </div>

        <div class="space-y-4">
          <UIButton
            label="登入"
            type="submit"
            block
            color="blue"
            size="lg"
            :disabled="apiFetching"
          />
          <RouterLink v-slot="{ navigate }" :to="{ name: 'signup' }" custom>
            <UIButton
              class="mx-auto"
              label="註冊"
              color="blue"
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
import { loginAPI } from '@/api'
import { useCommonStore, useMessageStore } from '@/stores'
import demoAccount from '@/config/demo-account.json'
import { apiFailure } from '@/utils/api-error'
import type { LoginForm } from '@/types'

/* 全局屬性 */
const commonStore = useCommonStore()
const messageStore = useMessageStore()
const router = useRouter()
const Swal = getCurrentInstance()?.proxy?.$Swal

/* 表單 */
const formRefs = ref<HTMLFormElement | null>(null)
const fromData = ref<LoginForm>({
  email: '',
  password: ''
})
const typeIsPassword = ref<boolean>(true)

/* 自動填入 */
const autofill = () => {
  if (apiFetching.value) return
  fromData.value = {
    email: demoAccount.email,
    password: demoAccount.password
  }
  messageStore.success({
    message: `已自動填入.`
  })
}

/* 登入 API */
let active = true
const { isFetching: apiFetching, execute: loginExecute, abort } = loginAPI({
  async afterFetch({ data }) {
    if (!active) return { data }
    const { token, nickname } = data
    commonStore.auth = {
      token,
      nickname
    }
    await router.push({ name: 'todo' })
    return { data }
  },
  onFetchError({ data, error, response }) {
    if (!active) return { data, error }
    Swal?.fire({
      title: apiFailure(data, error, response?.status ?? null).message,
      icon: 'error',
      showConfirmButton: true,
      confirmButtonText: '確認',
      willClose: () => {
        document.getElementById('email')?.focus()
      }
    })
    return { data, error }
  }
}).post(computed(() => fromData.value))
function submit() {
  if (!apiFetching.value) loginExecute()
}
onBeforeUnmount(() => { active = false; abort() })
</script>

<style lang="scss" scoped>
.login-view {
  background-color: #fff;
  background-image: linear-gradient(90deg, rgb(243 244 246) 1px, transparent 0),
    linear-gradient(180deg, rgb(243 244 246) 1px, transparent 0);

  background-position-x: center;
  background-size: 3.75rem 3.75rem;
}
</style>
