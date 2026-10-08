export interface ApiFailure {
  status: number | null
  message: string
}

export function apiFailure(data: unknown, error: unknown, status: number | null): ApiFailure {
  const message = data && typeof data === 'object' && 'message' in data
    ? (data as { message: unknown }).message
    : null
  return {
    status,
    message: typeof message === 'string' && message.trim()
      ? message
      : Array.isArray(message) && message.every((item) => typeof item === 'string')
        ? message.join('、')
        : !status
          ? '目前無法連線，請檢查網路後再試一次。'
          : status >= 500
            ? '服務暫時無法使用，請稍後再試。'
            : '操作失敗，請稍後再試。'
  }
}
