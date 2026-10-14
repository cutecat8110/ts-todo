import demoAccount from '@/config/demo-account.json'

function isDemoLogin(body: BodyInit | null | undefined) {
  if (typeof body !== 'string') return false
  try {
    const credentials = JSON.parse(body)
    return credentials?.email === demoAccount.email && credentials?.password === demoAccount.password
  } catch {
    return false
  }
}

async function responseData(response: Response) {
  try {
    return await response.clone().json()
  } catch {
    return null
  }
}

// The course API clears data daily. Recovery is limited to the public demo account.
export const fetchLogin: typeof fetch = async (input, options) => {
  const response = await fetch(input, options)
  if (response.status !== 404 || !isDemoLogin(options?.body) || typeof input !== 'string') {
    return response
  }
  const url = new URL(input)
  const data = await responseData(response)
  if (!url.pathname.endsWith('/users/sign_in') || data?.status !== false || data?.message !== '帳號密碼驗證錯誤') {
    return response
  }

  options?.signal?.throwIfAborted()
  url.pathname = url.pathname.replace(/\/sign_in$/, '/sign_up')
  const registration = await fetch(url.toString(), {
    ...options,
    method: 'POST',
    body: JSON.stringify(demoAccount)
  })
  const registrationData = await responseData(registration)
  const created = registration.ok && registrationData?.status === true
  const createdElsewhere = registration.status === 400 && registrationData?.message === '用戶已存在'
  if (!created && !createdElsewhere) return registration.ok ? response : registration

  options?.signal?.throwIfAborted()
  return fetch(input, options)
}
