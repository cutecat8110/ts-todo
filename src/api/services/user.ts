import Http from './Http'
import type { UseFetchOptions } from '@vueuse/core'

export  function login(options: UseFetchOptions) {
  return Http.post('/users/sign_in', options)
}

export  function signup(options: UseFetchOptions) {
  return Http.post('/users/sign_up', options)
}

export async function auth(options: UseFetchOptions) {
  return Http.get('/users/checkout', options)
}

export  function logout(options: UseFetchOptions) {
  return Http.post('/users/sign_out', options)
}