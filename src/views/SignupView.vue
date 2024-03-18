<template>
  <div class="container flex min-h-screen items-center justify-center py-12">
    <VForm
      ref="formRefs"
      v-slot="{ errors }"
      class="flex max-w-80 flex-1 flex-col gap-16 pb-16"
      @submit="signupExecute()"
    >
      <div class="tracking-widest">
        <h1 class="text-center text-4xl font-bold">TS Todo</h1>
        <h2 class="mt-2 text-center text-sm text-gray-400">Sign up for System</h2>
      </div>
      <div class="space-y-4">
        <label class="block" for="email">
          <div class="font-bold">電子信箱</div>
          <VField
            id="email"
            v-model="fromData.email"
            :class="[
              errors.email ? 'ring-red-600' : 'ring-gray-300 focus:ring-green-600',
              'mt-2 w-full rounded-md px-4 py-2 outline-none ring-1 ring-inset'
            ]"
            name="email"
            label="電子信箱"
            type="text"
            rules="required"
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
              errors.password ? 'ring-red-600' : 'ring-gray-300 focus:ring-green-600',
              'mt-2 w-full rounded px-4 py-2 outline-none ring-1 ring-inset'
            ]"
            name="password"
            label="密碼"
            type="password"
            rules="required|min:6"
            :disabled="apiFetching"
          />
          <ErrorMessage class="mt-2 block text-red-600" name="password" />
        </label>
        <label class="block" for="nickname">
          <div class="font-bold">暱稱</div>
          <VField
            id="nickname"
            v-model="fromData.nickname"
            :class="[
              errors.nickname ? 'ring-red-600' : 'ring-gray-300 focus:ring-green-600',
              'mt-2 w-full rounded px-4 py-2 outline-none ring-1 ring-inset'
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
import { signup } from '@/api/index'
import { useStyleStore } from '@/stores'
import type { SignupForm } from '@/types/index'

/* 全局屬性 */
const useStyle = useStyleStore()
const router = useRouter()
const Swal = getCurrentInstance()?.proxy?.$Swal

/* 表單 */
const formRefs = ref()
const fromData = ref<SignupForm>({
  email: 'test@example.com',
  password: 'test123456',
  nickname: '小明'
})

/* 註冊 API */
const { isFetching: apiFetching, execute: signupExecute } = signup({
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
}).post(fromData.value)
</script>
