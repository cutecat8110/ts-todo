import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount, flushPromises, type VueWrapper } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'
import { Field, Form, ErrorMessage, defineRule } from 'vee-validate'
import { required, email, min } from '@vee-validate/rules'
import Login from '@/views/LoginView.vue'
import Signup from '@/views/SignupView.vue'
import { useCommonStore } from '@/stores/common'
import demoAccount from '@/config/demo-account.json'

let wrapper: VueWrapper
const fire = vi.fn()
const json = (data: unknown, status = 200) => new Response(JSON.stringify(data), { status })
async function setup(component = Login) {
  defineRule('required', required); defineRule('email', email); defineRule('min', min)
  const pinia = createPinia(); setActivePinia(pinia)
  const router = createRouter({ history: createMemoryHistory(), routes: ['login', 'signup', 'todo'].map(name => ({ name, path: name === 'todo' ? '/' : `/${name}`, component: { template: '<div />' } })) })
  await router.push('/login'); await router.isReady()
  wrapper = mount(component, { global: { plugins: [pinia, router, { install: (app) => { app.config.globalProperties.$Swal = { fire } } }], components: { VForm: Form, VField: Field, ErrorMessage }, stubs: { Icon: true }, mocks: { $Swal: { fire } } } })
  return { router, store: useCommonStore() }
}
beforeEach(() => { fire.mockReset() })
afterEach(() => { wrapper?.unmount(); vi.unstubAllGlobals() })

describe('Authentication forms', () => {
  it('only fills credentials until submitted and keeps recovery locked until sign-in completes', async () => {
    let finishRegistration!: (response: Response) => void
    const request = vi.fn()
      .mockResolvedValueOnce(json({ status: false, message: '帳號密碼驗證錯誤' }, 404))
      .mockImplementationOnce(() => new Promise<Response>(resolve => { finishRegistration = resolve }))
      .mockResolvedValueOnce(json({ status: true, token: 'demo-token', nickname: demoAccount.nickname }))
    vi.stubGlobal('fetch', request)
    const { router, store } = await setup()
    await wrapper.get('[aria-label="自動填入預設"]').trigger('click')
    expect((wrapper.get('#email').element as HTMLInputElement).value).toBe(demoAccount.email)
    expect((wrapper.get('#password').element as HTMLInputElement).value).toBe(demoAccount.password)
    expect(request).not.toHaveBeenCalled()
    await wrapper.get('form').trigger('submit'); await flushPromises()
    await vi.waitFor(() => expect(request).toHaveBeenCalledTimes(2))
    expect(wrapper.get('[aria-label="自動填入預設"]').attributes('disabled')).toBeDefined()
    expect(wrapper.get('button[type="submit"]').attributes('disabled')).toBeDefined()
    await wrapper.get('form').trigger('submit'); await flushPromises()
    expect(request).toHaveBeenCalledTimes(2)
    finishRegistration(json({ status: true }, 201))
    await flushPromises()
    await vi.waitFor(() => expect(router.currentRoute.value.name).toBe('todo'))
    expect(store.auth).toEqual({ token: 'demo-token', nickname: demoAccount.nickname })
    expect(request).toHaveBeenCalledTimes(3)
    expect(fire).not.toHaveBeenCalled()
  })
  it('reports a non-JSON server failure without throwing from its error handler', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('Bad Gateway', { status: 502 })))
    await setup()
    await wrapper.get('[aria-label="自動填入預設"]').trigger('click')
    await wrapper.get('form').trigger('submit'); await flushPromises()
    await vi.waitFor(() => expect(fire).toHaveBeenCalled())
    expect(fire.mock.calls[0][0].title).toContain('服務暫時')
    expect(wrapper.get('button[type="submit"]').attributes('disabled')).toBeUndefined()
  })
  it('keeps whitespace in passwords and locks autofill during a request', async () => {
    let finish!: (response: Response) => void
    const fetch = vi.fn(async () => new Promise<Response>(resolve => { finish = resolve }))
    vi.stubGlobal('fetch', fetch); await setup()
    await wrapper.get('#email').setValue('test@example.com')
    await wrapper.get('#password').setValue(' test123456 ')
    await wrapper.get('form').trigger('submit'); await flushPromises()
    await vi.waitFor(() => expect(fetch).toHaveBeenCalledTimes(1))
    expect(JSON.parse(fetch.mock.calls[0][1].body).password).toBe(' test123456 ')
    expect(wrapper.get('[aria-label="自動填入預設"]').attributes('disabled')).toBeDefined()
    finish(json({ status: false, message: '帳號密碼驗證錯誤' }, 404)); await flushPromises(); await vi.waitFor(() => expect(fire).toHaveBeenCalled())
    expect(fire.mock.calls[0][0].title).toBe('帳號密碼驗證錯誤')
  })
  it('does not update the signed-in account after leaving the login page', async () => {
    let finish!: (response: Response) => void
    vi.stubGlobal('fetch', vi.fn(async () => new Promise<Response>(resolve => { finish = resolve })))
    const { store } = await setup()
    await wrapper.get('[aria-label="自動填入預設"]').trigger('click')
    await wrapper.get('form').trigger('submit'); await flushPromises()
    await vi.waitFor(() => expect(finish).toBeTypeOf('function'))
    wrapper.unmount(); finish(json({ token: 'late-token', nickname: 'Late' })); await flushPromises()
    expect(store.auth.token).toBe('')
  })
  it('rejects an invalid signup email without calling the API', async () => {
    const fetch = vi.fn(); vi.stubGlobal('fetch', fetch); await setup(Signup)
    await wrapper.get('#email').setValue('not-an-email')
    await wrapper.get('#password').setValue('valid-password')
    await wrapper.get('#nickname').setValue('QA')
    await wrapper.get('form').trigger('submit'); await flushPromises()
    expect(fetch).not.toHaveBeenCalled()
    expect(wrapper.findAll('[role="alert"]').length + wrapper.text().includes('email')).toBeTruthy()
  })
})
