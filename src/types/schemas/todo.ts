export interface Todo {
  editTodoRefs: HTMLTextAreaElement | null
  todoRefs: HTMLLIElement | null
  content: string
  createTime: number
  id: string
  status: boolean
  edit: boolean
  error: boolean
  tempContent: string
}
