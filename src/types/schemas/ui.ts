export type UIButtonVariant = 'solid' | 'outline' | 'link' | 'text'
export type UIButtonColor =
  | 'default'
  | 'lightGray'
  | 'darkGray'
  | 'blue'
  | 'green'
  | 'red'
  | 'yellow'

export type MessageType = 'success' | 'error' | 'warn' | 'info'

export interface UIMessage {
  message: string
  duration?: number
  close?: boolean
}

export interface UIMessageConfig extends UIMessage {
  id: string
  type: MessageType
  duration: number
  close: boolean
}
