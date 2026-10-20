import { afterEach, expect, it, vi } from 'vitest'
import { mount, flushPromises, type VueWrapper } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'
import dayjs from 'dayjs'
import TodoView from '@/views/TodoView.vue'
import { useCommonStore } from '@/stores/common'

let wrapper: VueWrapper
async function setup() {
  const pinia = createPinia(); setActivePinia(pinia)
  useCommonStore().auth = { token: 'qa-fixture', nickname: 'QA' }
  const router = createRouter({ history: createMemoryHistory(), routes: [{ path: '/', component: { template: '<div />' } }] })
  await router.push('/'); await router.isReady()
  const fetch = vi.fn(async () => new Response(JSON.stringify({ status: true, data: [{ id: 'a', content: 'Original', status: false, createTime: 1 }] })))
  vi.stubGlobal('fetch', fetch)
  wrapper = mount(TodoView, { attachTo: document.body, global: { plugins: [pinia, router, { install: (app) => { app.config.globalProperties.$dayjs = dayjs } }], stubs: { LayoutDefault: { template: '<div><slot /></div>' }, Icon: true } } })
  await flushPromises()
  return fetch
}
afterEach(() => { wrapper?.unmount(); vi.unstubAllGlobals() })
it('validates blank Ctrl+Enter without calling POST and ignores composition or held Enter', async () => {
  const fetch = await setup()
  const input = wrapper.get('[aria-label="新增待辦事項"]')
  await input.trigger('keydown', { key: 'Enter', ctrlKey: true })
  expect(wrapper.text()).toContain('Todo 為必填')
  await input.setValue('Draft')
  await input.trigger('keydown', { key: 'Enter', ctrlKey: true, isComposing: true })
  await input.trigger('keydown', { key: 'Enter', ctrlKey: true, repeat: true })
  expect(fetch).toHaveBeenCalledTimes(1)
})
it('does not save a readonly todo when its shortcut is pressed', async () => {
  const fetch = await setup()
  await wrapper.get('[aria-label="待辦事項"]').trigger('keydown', { key: 'Enter', ctrlKey: true })
  expect(fetch).toHaveBeenCalledTimes(1)
})
it('validates edits and restores saved content on cancel without sending a write', async () => {
  const fetch = await setup()
  await wrapper.get('[aria-label="編輯待辦"]').trigger('click')
  await wrapper.get('[aria-label="編輯待辦事項"]').setValue(' ')
  await wrapper.get('[aria-label="儲存待辦"]').trigger('click')
  expect(wrapper.text()).toContain('Todo 為必填')
  await wrapper.get('[aria-label="取消編輯"]').trigger('click')
  await flushPromises()
  expect((wrapper.get('[aria-label="待辦事項"]').element as HTMLTextAreaElement).value).toBe('Original')
  expect(document.activeElement).toBe(wrapper.get('[aria-label="編輯待辦"]').element)
  expect(fetch).toHaveBeenCalledTimes(1)
})
it('returns focus after saving or removing a row and preserves it if the visitor moves elsewhere', async () => {
  const fetch = await setup()
  await wrapper.get('[aria-label="編輯待辦"]').trigger('click')
  await wrapper.get('[aria-label="編輯待辦事項"]').setValue('Updated')
  await wrapper.get('[aria-label="儲存待辦"]').trigger('click')
  await flushPromises()
  expect(document.activeElement).toBe(wrapper.get('[aria-label="編輯待辦"]').element)
  let finish!: (value: Response) => void
  fetch.mockImplementationOnce(() => new Promise(resolve => { finish = resolve }))
  await wrapper.get('[aria-label="編輯待辦"]').trigger('click')
  await wrapper.get('[aria-label="儲存待辦"]').trigger('click')
  await vi.waitFor(() => expect(finish).toBeTypeOf('function'))
  const add = wrapper.get('[aria-label="新增待辦事項"]')
  ;(add.element as HTMLTextAreaElement).focus()
  finish(new Response(JSON.stringify({ status: true })))
  await flushPromises()
  expect(document.activeElement).toBe(add.element)
  ;(wrapper.get('[aria-label="刪除待辦"]').element as HTMLButtonElement).focus()
  await wrapper.get('[aria-label="刪除待辦"]').trigger('click')
  await flushPromises()
  expect(document.activeElement).toBe(add.element)
  expect(wrapper.text()).toContain('尚無待辦事項')
})
it('keeps a failed edit ready for correction with its draft intact', async () => {
  const fetch = await setup()
  fetch.mockResolvedValueOnce(new Response(JSON.stringify({ status: false, message: '更新失敗' }), { status: 503 }))
  await wrapper.get('[aria-label="編輯待辦"]').trigger('click')
  await wrapper.get('[aria-label="編輯待辦事項"]').setValue('Draft')
  await wrapper.get('[aria-label="儲存待辦"]').trigger('click')
  await flushPromises()
  const input = wrapper.get('[aria-label="編輯待辦事項"]')
  expect((input.element as HTMLTextAreaElement).value).toBe('Draft')
  expect(document.activeElement).toBe(input.element)
})
