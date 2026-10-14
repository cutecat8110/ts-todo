import type { UseFetchOptions } from '@vueuse/core'
import Http from './Http'
import { fetchLogin } from './demo-login'

export function loginAPI(options: UseFetchOptions) {
  return Http.post('/users/sign_in', { ...options, fetch: fetchLogin })
}

export function signupAPI(options: UseFetchOptions) {
  return Http.post('/users/sign_up', options)
}

export async function authAPI(options: UseFetchOptions) {
  return Http.get('/users/checkout', options)
}

export function logoutAPI(options: UseFetchOptions) {
  return Http.post('/users/sign_out', options)
}
