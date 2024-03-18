<template>
  <div class="container flex min-h-screen items-center justify-center py-12">
    <VForm
      ref="formRefs"
      v-slot="{ errors }"
      class="flex max-w-80 flex-1 flex-col gap-16 pb-16"
      @submit="loginExecute()"
    >
      <div class="tracking-widest">
        <h1 class="text-center text-4xl font-bold">TS Todo</h1>
        <h2 class="mt-2 text-center text-sm text-gray-400">Sign in to System</h2>
      </div>
      <div class="space-y-4">
        <label class="block" for="email">
          <div class="font-bold">電子信箱</div>
          <VField
            id="email"
            v-model="fromData.email"
            :class="[
              errors.email ? 'ring-red-600' : 'ring-gray-300 focus:ring-blue-600',
              'mt-2 w-full rounded-md px-4 py-2 outline-none ring-1 ring-inset'
            ]"
            name="email"
            label="電子信箱"
            type="text"
            rules="required|email"
            :disabled="apiFetching"
          />
          <ErrorMessage class="mt-2 block text-red-600" name="email" />
        </label>
        <label class="block" for="password">
          <div class="font-bold">密碼</div>
          <VField
            id="password"
            v-model="fromData.password"
            :class="[
              errors.password ? 'ring-red-600' : 'ring-gray-300 focus:ring-blue-600 ',
              'mt-2 w-full rounded  px-4 py-2 outline-none ring-1 ring-inset'
            ]"
            name="password"
            label="密碼"
            type="password"
            rules="required"
            :disabled="apiFetching"
          />
          <ErrorMessage class="mt-2 block text-red-600" name="password" />
        </label>
      </div>

      <div class="space-y-4">
        <UIButton label="登入" type="submit" block size="lg" :disabled="apiFetching" />
        <RouterLink v-slot="{ navigate }" :to="{ name: 'signup' }" custom>
          <UIButton
            class="mx-auto"
            label="註冊"
            role="link"
            size="lg"
            variant="link"
            :disabled="apiFetching"
            @click="navigate"
          />
        </RouterLink>
      </div>
      <div class="text-center text-xs text-gray-600">Copyright © 2024 by Hao</div>
    </VForm>
  </div>
</template>

<script lang="ts" setup>
import { login } from '@/api/index'
import { useCommonStore } from '@/stores'
import type { LoginForm } from '@/types/index'

/* 全局屬性 */
const commonStore = useCommonStore()
const router = useRouter()
const Swal = getCurrentInstance()?.proxy?.$Swal

/* 表單 */
const formRefs = ref()
const fromData = ref<LoginForm>({
  email: 'test@example.com',
  password: 'test123456'
})

/* 登入 API */
const { isFetching: apiFetching, execute: loginExecute } = login({
  afterFetch({ data }) {
    const { token, nickname } = data
    commonStore.auth = {
      token,
      nickname
    }
    router.push({ name: 'todo' })
    return { data }
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
}).post(fromData.value)
</script>
