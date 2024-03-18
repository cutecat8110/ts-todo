import Http from './Http'
import type { UseFetchOptions } from '@vueuse/core'

export function getTodo(options: UseFetchOptions) {
  return Http.get('/todos', options)
}

export function addTodo(options: UseFetchOptions) {
  return Http.post('/todos', options)
}

export function updateTodo(options: UseFetchOptions) {
  return Http.put('/todos', options)
}

export function deleteTodo(options: UseFetchOptions) {
  return Http.delete('/todos', options)
}

export function toggleTodo(options: UseFetchOptions) {
  return Http.patch('/todos/{id}/toggle', options)
}
