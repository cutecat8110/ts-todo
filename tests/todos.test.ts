import { afterEach, describe, expect, it, vi } from 'vitest'
import { effectScope, nextTick, type EffectScope } from 'vue'
import { createPinia, setActivePinia } from 'pinia'
import { useTodos } from '@/composables/useTodos'
import { useCommonStore } from '@/stores/common'

const original = [
  { id: 'a', content: 'First', createTime: 1, status: false },
  { id: 'b', content: 'Second', createTime: 2, status: false }
]
const json = (data: unknown, status = 200) => new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } })
let scope: EffectScope
function setup(fetcher?: (url: string, options: RequestInit) => Promise<Response>) {
  setActivePinia(createPinia())
  useCommonStore().auth = { token: 'fixture-only', nickname: 'QA' }
  const fetch = vi.fn(fetcher ?? (async () => json({ status: true, data: original })))
  vi.stubGlobal('fetch', fetch)
  const error = vi.fn(), success = vi.fn()
  scope = effectScope()
  const todos = scope.run(() => useTodos(error, success))!
  return { ...todos, fetch, error, success }
}
afterEach(() => { scope?.stop(); vi.unstubAllGlobals() })

 describe('Todo requests and state', () => {
  it('updates the captured ID using PUT and leaves other rows untouched', async () => {
    const s = setup(async (_url, options) => options.method === 'GET' ? json({ data: original }) : json({ status: true }))
    await s.load()
    const todo = s.todos.value[0]
    todo.edit = true; todo.tempContent = 'Updated'
    expect(await s.mutate(todo, 'update')).toBe(true)
    const [url, options] = s.fetch.mock.calls[1]
    expect(url).toBe('http://fixture.test/todos/b')
    expect(options.method).toBe('PUT')
    expect(JSON.parse(options.body as string)).toEqual({ content: 'Updated' })
    expect(s.todos.value.map(t => t.content)).toEqual(['Updated', 'First'])
  })
  it('keeps concurrent operations on different IDs correct in reverse response order', async () => {
    const finish = new Map<string, (response: Response) => void>()
    const s = setup(async (url, options) => options.method === 'GET' ? json({ data: original }) : new Promise(resolve => finish.set(url, resolve)))
    await s.load()
    const remove = s.mutate(s.todos.value[0], 'delete')
    const toggle = s.mutate(s.todos.value[1], 'toggle')
    await vi.waitFor(() => expect(finish.size).toBe(2))
    finish.get('http://fixture.test/todos/a/toggle')!(json({ status: true }))
    await toggle
    finish.get('http://fixture.test/todos/b')!(json({ status: true }))
    await remove
    expect(s.todos.value.map(t => [t.id, t.status])).toEqual([['a', true]])
  })
  it('suppresses duplicate requests on one row and duplicate creates', async () => {
    let finish!: (response: Response) => void
    const s = setup(async (_url, options) => options.method === 'GET' ? json({ data: original }) : new Promise(resolve => { finish = resolve }))
    await s.load()
    const first = s.mutate(s.todos.value[0], 'toggle')
    expect(await s.mutate(s.todos.value[0], 'toggle')).toBe(false)
    await vi.waitFor(() => expect(finish).toBeTypeOf('function'))
    finish(json({ status: true })); await first
    const add = s.add('New')
    expect(await s.add('New')).toBe(false)
    await vi.waitFor(() => expect(s.fetch).toHaveBeenCalledTimes(3))
    finish(json({ newTodo: { ...original[0], id: 'c', content: 'New' } })); await add
    expect(s.todos.value.filter(t => t.id === 'c')).toHaveLength(1)
  })
  it('preserves another row draft when creating a todo', async () => {
    const s = setup(async (_url, options) => options.method === 'GET' ? json({ data: original }) : json({ newTodo: { ...original[0], id: 'c', content: 'New' } }, 201))
    await s.load()
    s.todos.value[0].edit = true; s.todos.value[0].tempContent = 'Unsaved draft'
    await s.add('New')
    expect(s.todos.value[1].tempContent).toBe('Unsaved draft')
    expect(s.todos.value[1].edit).toBe(true)
    expect(s.fetch.mock.calls.filter(([, options]) => options.method === 'GET')).toHaveLength(1)
  })
  it('rejects blank content and updates outside edit mode without any write', async () => {
    const s = setup(); await s.load()
    expect(await s.add(' \n ')).toBe(false)
    expect(await s.mutate(s.todos.value[0], 'update')).toBe(false)
    s.todos.value[0].edit = true; s.todos.value[0].tempContent = ' '
    expect(await s.mutate(s.todos.value[0], 'update')).toBe(false)
    expect(s.fetch).toHaveBeenCalledTimes(1)
  })
  it('preserves draft and server state after a failed save and allows retry', async () => {
    const s = setup(async (_url, options) => options.method === 'GET' ? json({ data: original }) : json({ status: false, message: '更新失敗' }, 400))
    await s.load(); const todo = s.todos.value[0]; todo.edit = true; todo.tempContent = 'Draft'
    expect(await s.mutate(todo, 'update')).toBe(false)
    expect(todo.content).toBe('Second'); expect(todo.tempContent).toBe('Draft'); expect(todo.edit).toBe(true)
    expect(s.pending.size).toBe(0)
    expect(s.error).toHaveBeenCalledWith({ status: 400, message: '更新失敗' })
  })
  it('handles offline and non-JSON failures without success messages', async () => {
    const s = setup(async () => { throw new TypeError('Failed to fetch') })
    await s.load()
    expect(s.loadError.value).toContain('無法連線'); expect(s.loading.value).toBe(false)
    s.fetch.mockResolvedValueOnce(new Response('<html>Gateway failure</html>', { status: 502 }))
    await s.load()
    expect(s.loadError.value).toContain('服務暫時'); expect(s.success).not.toHaveBeenCalled()
  })
  it('ignores a response after leaving the page', async () => {
    let finish!: (response: Response) => void
    const s = setup(async () => new Promise(resolve => { finish = resolve }))
    const load = s.load(); await vi.waitFor(() => expect(finish).toBeTypeOf('function'))
    scope.stop(); finish(json({ data: original })); await load; await nextTick()
    expect(s.todos.value).toEqual([]); expect(s.error).not.toHaveBeenCalled()
  })
})
