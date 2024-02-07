<template>
  <div class="min-h-screen container py-12 flex items-center justify-center">
    <VForm @submit="submit" class="max-w-96 flex flex-col flex-1 gap-16 pb-16" v-slot="{ errors }">
      <div>
        <h1 class="text-4xl font-bold text-center">TS Todo</h1>
        <h2 class="text-sm mt-4 text-center text-gray-400">Sign in to System</h2>
      </div>
      <div>
        <label for="email" class="block">
          <div class="font-bold">Email</div>
          <VField
            label="Email"
            type="text"
            name="email"
            id="email"
            :class="[
              errors.email ? 'ring-red-600' : 'ring-gray-300 focus:ring-blue-600',
              'mt-2 w-full outline-none rounded-md px-4 py-2 ring-1 ring-inset'
            ]"
            rules="required"
          />
          <ErrorMessage name="email" class="block mt-2 text-red-600" />
        </label>
        <label for="password" class="block mt-4">
          <div class="font-bold">Password</div>
          <VField
            label="Password"
            type="password"
            name="password"
            id="password"
            :class="[
              errors.password ? 'ring-red-600' : 'ring-gray-300 focus:ring-blue-600',
              'mt-2 w-full outline-none rounded px-4 py-2 ring-1 ring-inset'
            ]"
            rules="required"
          />
          <ErrorMessage name="password" class="block mt-2 text-red-600" />
        </label>
      </div>
      <div class="flex flex-col gap-4 items-center font-bold">
        <button
          type="submit"
          class="rounded w-full bg-blue-600 text-white py-2 transition-colors hover:bg-blue-700"
        >
          登入
        </button>
        <RouterLink class="text-blue-600 hover:underline" :to="{ name: 'signup' }">
          註冊
        </RouterLink>
      </div>
      <div class="text-sm text-center text-gray-600">Copyright © 2024 by Hao</div>
    </VForm>
  </div>
</template>

<script setup lang="ts">
const submit = () => {}
</script>
