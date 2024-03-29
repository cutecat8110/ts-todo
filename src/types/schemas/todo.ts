export interface Todo {
  editTodoRefs: HTMLTextAreaElement
  todoRefs: HTMLLIElement
  autosize: any
  content: string
  createTime: number
  id: string
  status: boolean
  edit: boolean
  error: boolean
  tempContent: string
}
