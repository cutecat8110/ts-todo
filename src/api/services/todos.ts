import type { UseFetchOptions } from '@vueuse/core'

import Http from './Http'

export function getTodoAPI(options: UseFetchOptions) {
  return Http.get('/todos', options)
}

export function addTodoAPI(options: UseFetchOptions) {
  return Http.post('/todos', options)
}

export function updateTodoAPI(options: UseFetchOptions) {
  return Http.put('/todos/{id}', options)
}

export function deleteTodoAPI(options: UseFetchOptions) {
  return Http.delete('/todos/{id}', options)
}

export function toggleTodoAPI(options: UseFetchOptions) {
  return Http.patch('/todos/{id}/toggle', options)
}
