<template>
  <LayoutDefault>
    <main class="flex-1 py-10">
      <div class="container lg:max-w-[50rem]">
        <!-- 歡迎訊息 -->
        <div class="text-2xl font-black">
          {{ amPm }}，{{ commonStore.auth.nickname }}，歡迎回來👋
        </div>

        <!-- 新增代辦輸入框 -->
        <div class="mt-4 space-y-6 rounded-xl bg-gray-100 p-6">
          <div class="flex flex-wrap items-center justify-between font-black text-gray-600">
            <!-- 當前日期 -->
            <div class="flex flex-wrap gap-2 text-[2.5rem] leading-none">
              {{ $dayjs(now).format('DD') }}
              <div class="text-sm">
                <div>
                  {{ $dayjs(now).format('MMM YYYY') }}
                </div>
                <div class="text-end text-gray-400">
                  {{ $dayjs(now).format('HH:mm:ss') }}
                </div>
              </div>
            </div>
            <!-- 當前星期幾 -->
            <div class="text-2xl text-gray-600">
              {{ $dayjs(now).format('dddd') }}
            </div>
          </div>

          <!-- Todo 輸入框 -->
          <div class="flex flex-wrap gap-x-4 gap-y-2">
            <textarea
              ref="addTodoRefs"
              v-model.trim="addTodoData"
              :class="[
                addTodoDataError ? 'ring-red-600' : 'ring-gray-300 focus:ring-blue-600 ',
                'flex-1 resize-none rounded-md px-4 py-2 outline-none ring-1 ring-inset'
              ]"
              placeholder="Todo"
              :disabled="addTodoFetching"
              @keydown="(event) => onKeyboardSubmit(event, -1, () => addTodoExecute())"
            />
            <UIButton
              label="新增"
              color="blue"
              size="lg"
              :disabled="addTodoFetching"
              @click="onTodoSubmit()"
            />
            <div v-if="addTodoDataError" class="w-full text-red-600">Todo 為必填</div>
          </div>
        </div>

        <div
          class="relative mt-4 h-6 overflow-hidden rounded-full bg-gray-300 text-sm font-black tracking-wide text-white"
        >
          <div
            v-if="TodoList.length !== 0"
            class="progress-bar h-full bg-red-800 text-center"
            :style="{ width: (doneTodos / TodoList.length) * 100 + '%' }"
          />
          <span class="absolute inset-0 flex items-center justify-center">
            {{ doneTodos }} / {{ TodoList.length }} Todo 完成
          </span>
        </div>

        <!-- 代辦清單 -->
        <TransitionGroup class="relative mt-4 space-y-4" name="todo-list" tag="ul">
          <li
            v-for="(todo, index) in TodoList"
            :ref="(el) => (todo.todoRefs = el as HTMLLIElement)"
            :key="todo.id"
            :class="[
              todo.status && !todo.edit && 'line-through',
              todo.status ? 'border-transparent bg-gray-100 text-gray-500' : 'bg-white',
              'flex w-full flex-wrap items-center gap-y-2 overflow-hidden rounded-xl border-2 p-[0.625rem] px-4 font-black transition-all hover:border-gray-300 hover:shadow'
            ]"
          >
            <!-- 代辦完成狀態 -->
            <UIButton
              class="shrink-0"
              :color="todo.status ? 'blue' : undefined"
              :icon="todo.status ? 'ic:round-radio-button-checked' : 'ic:outline-circle'"
              size="lg"
              square
              variant="text"
              :disabled="
                currentIndex == index &&
                (updateTodoFetching || deleteTodoFetching || toggleTodoFetching)
              "
              @click="!todo.edit && handleTodo(todo, index, 'toggle')"
            />

            <!-- 編輯代辦輸入框 -->
            <textarea
              :ref="(el) => (todo.editTodoRefs = el as HTMLTextAreaElement)"
              v-model.trim="todo.tempContent"
              :class="[
                todo.edit ? 'bg-white ring-1 ring-inset ' : 'cursor-default',
                todo.edit && todo.error ? 'ring-red-600' : 'ring-gray-300 focus:ring-blue-600',
                'flex-1 resize-none rounded-md bg-transparent px-4 py-2 outline-none'
              ]"
              placeholder="Todo"
              :readonly="!todo.edit"
              :disabled="currentIndex == index && updateTodoFetching"
              @keydown="
                (event) => onKeyboardSubmit(event, index, () => handleTodo(todo, index, 'update'))
              "
            />

            <!-- 按鈕組 -->
            <div class="ml-auto flex shrink-0 gap-2 pl-2">
              <!--  編輯&刪除 -->
              <template v-if="!todo.edit">
                <UIButton
                  icon="ic:round-mode-edit-outline"
                  square
                  variant="text"
                  :disabled="currentIndex == index && (deleteTodoFetching || toggleTodoFetching)"
                  @click="editTodoToggle(index)"
                />
                <UIButton
                  icon="ic:baseline-delete"
                  square
                  variant="text"
                  :disabled="currentIndex == index && (deleteTodoFetching || toggleTodoFetching)"
                  @click="handleTodo(todo, index, 'delete')"
                />
              </template>

              <!--  取消/完成編輯 -->
              <template v-else>
                <UIButton
                  color="lightGray"
                  icon="ic:round-close"
                  square
                  variant="text"
                  :disabled="currentIndex == index && updateTodoFetching"
                  @click="editTodoToggle(index)"
                />
                <UIButton
                  color="blue"
                  icon="ic:round-done"
                  square
                  variant="text"
                  :disabled="currentIndex == index && updateTodoFetching"
                  @click="handleTodo(todo, index, 'update')"
                />
              </template>
            </div>
            <div v-if="todo.error" class="ml-10 w-full text-red-600">Todo 為必填</div>
          </li>
        </TransitionGroup>
      </div>
    </main>
  </LayoutDefault>
</template>

<script lang="ts" setup>
import { addTodoAPI, deleteTodoAPI, getTodoAPI, toggleTodoAPI, updateTodoAPI } from '@/api'
import { useCommonStore, useMessageStore } from '@/stores'
import type { Todo } from '@/types'
import { replaceParams } from '@/utils/url'
import { useNow, useTextareaAutosize } from '@vueuse/core'

/* 全局屬性 */
const commonStore = useCommonStore()
const messageStore = useMessageStore()
const dayjs = getCurrentInstance()?.proxy?.$dayjs

/* 當前時間 */
const now = useNow()

/* 問候語 */
const amPm = computed<string>(() => {
  const currentHour = dayjs?.(now.value).hour()

  if (currentHour === undefined) return ''
  if (currentHour < 4) return '午夜好'
  if (currentHour < 12) return '早上好'
  if (currentHour < 18) return '下午好'
  if (currentHour < 21) return '傍晚好'
  return '晚上好'
})

/* 待辦事項 */
const TodoList = ref<Todo[]>([])
const doneTodos = computed<number>(() => TodoList.value.filter((i) => i.status == true).length)
const currentTodo = ref<Todo>({} as Todo)
const currentIndex = ref<number>(-1)

// 取得全部代辦 API
const { execute: getTodoExecute } = getTodoAPI({
  immediate: true,
  afterFetch({ data }) {
    TodoList.value = data.data
      .map((i: any) => ({
        editTodoRefs: null,
        todoRefs: null,
        autosize: null,
        tempContent: i.content,
        edit: false,
        error: false,
        ...i
      }))
      .reverse()
    nextTick(() => {
      TodoList.value.forEach((_, i) => {
        TodoList.value[i].autosize = useTextareaAutosize({
          element: TodoList.value[i].editTodoRefs,
          input: TodoList.value[i].tempContent
        })
      })
      addTodoRefs.value.focus()
    })
    return { data }
  }
})

// 新增代辦 - ref/refs 宣告 & 輸入框自動大小
const { textarea: addTodoRefs, input: addTodoData } = useTextareaAutosize({
  input: ref<string>('')
})
// 新增代辦 - 錯誤訊息
const addTodoDataError = ref(false)
// 新增代辦
const onTodoSubmit = () => {
  if (addTodoData.value == '') {
    addTodoDataError.value = true
    addTodoRefs.value.focus()
    return
  }
  addTodoExecute()
}
// 消除錯誤訊息 & 輸入框快捷
const onKeyboardSubmit = (event: KeyboardEvent, index: number, fn: () => void) => {
  if (index == -1) {
    addTodoDataError.value = false
  } else {
    TodoList.value[index].error = false
  }
  if (event.ctrlKey && event.key === 'Enter') return fn()
}

// 新增代辦 API
const { isFetching: addTodoFetching, execute: addTodoExecute } = addTodoAPI({
  afterFetch({ data }) {
    addTodoData.value = ''
    messageStore.success({
      message: `Todo 已新增.`
    })
    getTodoExecute()
    return { data }
  }
}).post(computed(() => ({ content: addTodoData.value })))

// 操作代辦
const handleTodo = (todo: Todo, index: number, action: string) => {
  currentTodo.value = todo
  currentIndex.value = index

  switch (action) {
    case 'delete':
      deleteTodoExecute()
      break
    case 'toggle':
      toggleTodoExecute()
      break
    case 'update':
      if (TodoList.value[index].tempContent == '') {
        TodoList.value[index].error = true
        TodoList.value[index].editTodoRefs.focus()
        return
      }
      updateTodoExecute()
      break

    default:
      break
  }
}

// 刪除代辦 API
const { isFetching: deleteTodoFetching, execute: deleteTodoExecute } = deleteTodoAPI({
  beforeFetch({ url }) {
    return { url: replaceParams(url, { id: currentTodo.value.id }) }
  },
  afterFetch({ data }) {
    TodoList.value = TodoList.value.filter((_, i) => i !== currentIndex.value)
    messageStore.warn({
      message: `Todo 已刪除.`
    })
    return { data }
  }
})

// 切換代辦完成狀態 API
const { isFetching: toggleTodoFetching, execute: toggleTodoExecute } = toggleTodoAPI({
  beforeFetch({ url }) {
    return { url: replaceParams(url, { id: currentTodo.value.id }) }
  },
  afterFetch({ data }) {
    TodoList.value[currentIndex.value].status = !currentTodo.value.status
    messageStore.success({
      message: `Todo 狀態更新.`
    })
    return { data }
  }
})

// 切換編輯代辦內容
const editTodoToggle = (index: number) => {
  TodoList.value[index].edit = !TodoList.value[index].edit
  TodoList.value[index].error = false
  if (TodoList.value[index].edit) {
    nextTick(() => {
      TodoList.value[index].editTodoRefs.focus()
    })
  } else {
    TodoList.value[index].autosize.triggerResize()
    TodoList.value[index].tempContent = TodoList.value[index].content
  }
}

// 更新代辦內容 API
const { isFetching: updateTodoFetching, execute: updateTodoExecute } = updateTodoAPI({
  beforeFetch({ url }) {
    return { url: replaceParams(url, { id: currentTodo.value.id }) }
  },
  afterFetch({ data }) {
    TodoList.value[currentIndex.value].content = currentTodo.value.tempContent
    messageStore.info({
      message: `Todo ${data.message}.`
    })
    editTodoToggle(currentIndex.value)
    return { data }
  }
}).post(computed(() => ({ content: currentTodo.value.tempContent })))
</script>

<style lang="scss" scoped>
.progress-bar,
.todo-list-move,
.todo-list-enter-active,
.todo-list-leave-active {
  transition: all 0.3s ease-in-out;
}

.todo-list-enter-from {
  opacity: 0;
  transform: translateX(-80px);
}

.todo-list-leave-to {
  opacity: 0;
  transform: translateX(80px);
}

.todo-list-leave-active {
  position: absolute;
}
</style>
