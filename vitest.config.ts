import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'

export default defineConfig({
  plugins: [vue(), AutoImport({ imports: ['vue', 'vue-router'], dts: false }), Components({ dirs: ['src/components'], dts: false })],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  test: { environment: 'jsdom', include: ['tests/**/*.test.ts'], env: { VITE_BASE_API: 'http://fixture.test' } }
})
