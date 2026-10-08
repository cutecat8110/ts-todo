import { ref, reactive, onScopeDispose } from 'vue'
import { addTodoAPI, deleteTodoAPI, getTodoAPI, toggleTodoAPI, updateTodoAPI } from '@/api'
import type { Todo } from '@/types'
import { apiFailure, type ApiFailure } from '@/utils/api-error'

// Every mutation owns its request and ID; response order must not select another row.
export function useTodos(onError: (error: ApiFailure) => void, onSuccess: (action: string) => void) {
  const todos = ref<Todo[]>([])
  const loading = ref(false)
  const adding = ref(false)
  const loadError = ref('')
  const pending = reactive(new Set<string>())
  const requests = new Set<{ abort: () => void }>()
  let active = true
  let loadVersion = 0
  onScopeDispose(() => {
    active = false
    requests.forEach((request) => request.abort())
  })

  function row(item: Pick<Todo, 'id' | 'content' | 'status' | 'createTime'>): Todo {
    return { ...item, tempContent: item.content, edit: false, error: false, editTodoRefs: null, todoRefs: null }
  }

  async function run(request: ReturnType<typeof getTodoAPI>) {
    requests.add(request)
    try {
      await request.execute()
      if (!active) return null
      if (request.error.value || request.data.value?.status === false) {
        throw apiFailure(request.data.value, request.error.value, request.statusCode.value)
      }
      return request.data.value
    } finally {
      requests.delete(request)
    }
  }

  async function load() {
    if (loading.value || adding.value || pending.size) return
    const version = ++loadVersion
    loading.value = true
    loadError.value = ''
    try {
      const data = await run(getTodoAPI({}))
      if (!active || version !== loadVersion || !data) return
      if (!Array.isArray(data.data)) throw apiFailure(null, null, 502)
      todos.value = data.data.map(row).reverse()
    } catch (error) {
      if (active && version === loadVersion) {
        loadError.value = (error as ApiFailure).message
        onError(error as ApiFailure)
      }
    } finally {
      if (version === loadVersion) loading.value = false
    }
  }

  async function add(content: string) {
    const value = content.trim()
    if (!value || adding.value || loading.value || loadError.value) return false
    adding.value = true
    try {
      const data = await run(addTodoAPI({}).post({ content: value }))
      if (!active || !data) return false
      if (!data.newTodo?.id) throw apiFailure(null, null, 502)
      todos.value.unshift(row(data.newTodo))
      onSuccess('add')
      return true
    } catch (error) {
      if (active) onError(error as ApiFailure)
      return false
    } finally {
      adding.value = false
    }
  }

  async function mutate(todo: Todo, action: 'delete' | 'toggle' | 'update') {
    const id = todo.id
    if (pending.has(id) || loading.value) return false
    if (action === 'toggle' && todo.edit) return false
    if (action === 'update' && (!todo.edit || !todo.tempContent.trim())) return false
    const content = todo.tempContent.trim()
    const status = todo.status
    pending.add(id)
    const options = { beforeFetch: ({ url }: { url: string }) => ({ url: url.replace('{id}', encodeURIComponent(id)) }) }
    const request = action === 'delete' ? deleteTodoAPI(options)
      : action === 'toggle' ? toggleTodoAPI(options)
        : updateTodoAPI(options).put({ content })
    try {
      const data = await run(request)
      if (!active || !data) return false
      const current = todos.value.find((item) => item.id === id)
      if (action === 'delete') todos.value = todos.value.filter((item) => item.id !== id)
      else if (current && action === 'toggle') current.status = !status
      else if (current) {
        current.content = content
        current.tempContent = content
        current.edit = false
        current.error = false
      }
      onSuccess(action)
      return true
    } catch (error) {
      if (active) onError(error as ApiFailure)
      return false
    } finally {
      pending.delete(id)
    }
  }

  return { todos, loading, adding, loadError, pending, load, add, mutate }
}
