import { afterEach, describe, expect, it, vi } from 'vitest'
import { fetchLogin } from '@/api/services/demo-login'
import demoAccount from '@/config/demo-account.json'

const url = 'https://todolist-api.hexschool.io/users/sign_in'
const options = () => ({ method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: demoAccount.email, password: demoAccount.password }) })
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status })
const missing = () => json({ status: false, message: '帳號密碼驗證錯誤' }, 404)

afterEach(() => vi.unstubAllGlobals())

describe('Public demo account recovery', () => {
  it('recreates a cleared demo account and returns the subsequent login response', async () => {
    const signedIn = json({ status: true, token: 'demo-token', nickname: demoAccount.nickname })
    const request = vi.fn().mockResolvedValueOnce(missing()).mockResolvedValueOnce(json({ status: true }, 201)).mockResolvedValueOnce(signedIn)
    vi.stubGlobal('fetch', request)
    expect(await fetchLogin(url, options())).toBe(signedIn)
    expect(request.mock.calls.map(call => call[0])).toEqual([url, url.replace('sign_in', 'sign_up'), url])
    expect(JSON.parse(request.mock.calls[1][1].body)).toEqual(demoAccount)
  })

  it('does not register when the demo account already signs in', async () => {
    const response = json({ status: true, token: 'demo-token' })
    const request = vi.fn().mockResolvedValue(response)
    vi.stubGlobal('fetch', request)
    expect(await fetchLogin(url, options())).toBe(response)
    expect(request).toHaveBeenCalledTimes(1)
  })

  it.each([
    { email: 'visitor@example.com', password: demoAccount.password },
    { email: demoAccount.email, password: 'wrong-password' }
  ])('does not register other credentials: $email', async credentials => {
    const request = vi.fn().mockResolvedValue(missing())
    vi.stubGlobal('fetch', request)
    await fetchLogin(url, { ...options(), body: JSON.stringify(credentials) })
    expect(request).toHaveBeenCalledTimes(1)
  })

  it.each([400, 401, 429, 500])('does not register or retry after HTTP %i', async status => {
    const request = vi.fn().mockResolvedValue(json({ status: false, message: '服務錯誤' }, status))
    vi.stubGlobal('fetch', request)
    await fetchLogin(url, options())
    expect(request).toHaveBeenCalledTimes(1)
  })

  it('does not register on an unrelated or non-JSON 404', async () => {
    const request = vi.fn().mockResolvedValueOnce(new Response('Not found', { status: 404 })).mockResolvedValueOnce(json({ status: false, message: '路由不存在' }, 404))
    vi.stubGlobal('fetch', request)
    await fetchLogin(url, options())
    await fetchLogin(url, options())
    expect(request).toHaveBeenCalledTimes(2)
  })

  it('handles another tab creating the same account without registering twice', async () => {
    const signedIn = json({ status: true, token: 'demo-token' })
    const request = vi.fn().mockResolvedValueOnce(missing()).mockResolvedValueOnce(json({ status: false, message: '用戶已存在' }, 400)).mockResolvedValueOnce(signedIn)
    vi.stubGlobal('fetch', request)
    expect(await fetchLogin(url, options())).toBe(signedIn)
    expect(request).toHaveBeenCalledTimes(3)
  })

  it('returns a registration failure without retrying writes or logging in', async () => {
    const failed = json({ status: false, message: '服務暫時無法使用' }, 503)
    const request = vi.fn().mockResolvedValueOnce(missing()).mockResolvedValueOnce(failed)
    vi.stubGlobal('fetch', request)
    expect(await fetchLogin(url, options())).toBe(failed)
    expect(request).toHaveBeenCalledTimes(2)
  })

  it('stops after one recovery if the account still cannot sign in', async () => {
    const failed = missing()
    const request = vi.fn().mockResolvedValueOnce(missing()).mockResolvedValueOnce(json({ status: true }, 201)).mockResolvedValueOnce(failed)
    vi.stubGlobal('fetch', request)
    expect(await fetchLogin(url, options())).toBe(failed)
    expect(request).toHaveBeenCalledTimes(3)
  })

  it('does not register after leaving the page', async () => {
    const controller = new AbortController()
    const request = vi.fn(async () => { controller.abort(); return missing() })
    vi.stubGlobal('fetch', request)
    await expect(fetchLogin(url, { ...options(), signal: controller.signal })).rejects.toMatchObject({ name: 'AbortError' })
    expect(request).toHaveBeenCalledTimes(1)
  })

  it('does not sign in after cancellation during registration', async () => {
    const controller = new AbortController()
    const request = vi.fn().mockResolvedValueOnce(missing()).mockImplementationOnce(async () => { controller.abort(); return json({ status: true }, 201) })
    vi.stubGlobal('fetch', request)
    await expect(fetchLogin(url, { ...options(), signal: controller.signal })).rejects.toMatchObject({ name: 'AbortError' })
    expect(request.mock.calls[1][1].signal).toBe(controller.signal)
    expect(request).toHaveBeenCalledTimes(2)
  })
})
