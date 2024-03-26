<template>
  <LayoutDefault>
    <main class="flex-1 py-10">
      <div class="container space-y-4 lg:max-w-[50rem]">
        <div class="text-2xl font-black">
          {{ amPm }}，{{ commonStore.auth.nickname }}，歡迎回來👋
        </div>
        <div class="space-y-6 rounded-xl bg-gray-100 p-6">
          <div class="flex items-center justify-between font-black text-gray-600">
            <div class="flex gap-2 text-[2.5rem] leading-none">
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
            <div class="text-2xl text-gray-600">
              {{ $dayjs(now).format('dddd') }}
            </div>
          </div>

          <!-- Todo Input -->
          <div class="flex space-x-4">
            <textarea
              ref="addTodoRefs"
              v-model.trim="addTodoData"
              class="flex-1 resize-none rounded-md px-4 py-2 outline-none ring-1 ring-inset ring-gray-300 focus:ring-blue-600"
              placeholder="Todo"
              :disabled="apiFetching"
              @keydown="handleKeyDown"
            />
            <UIButton
              label="新增"
              color="blue"
              size="lg"
              :disabled="apiFetching"
              @click="addTodoExecute()"
            />
          </div>
        </div>

        <!-- Todo List -->
        <TransitionGroup
          class="relative flex flex-col gap-4"
          name="todo-list"
          tag="ul"
          @before-enter="beforeEnter"
          @before-leave="beforeLeave"
          @enter="enter"
          @leave="leave"
        >
          <li
            v-for="(todo, index) in TodoList"
            :key="todo.id"
            :class="[
              todo.status && !todo.edit && 'line-through',
              todo.status ? 'border-transparent bg-gray-100 text-gray-500 ' : 'bg-white',
              'flex w-full items-center rounded-xl border-2  p-[0.625rem] px-4 font-black transition-all hover:border-gray-300 hover:shadow '
            ]"
            @click="!todo.edit && toggleTodo(todo, index)"
          >
            <UIButton
              class="pointer-events-none shrink-0"
              :color="todo.status ? 'blue' : undefined"
              :icon="todo.status ? 'ic:round-radio-button-checked' : 'ic:outline-circle'"
              size="lg"
              square
              variant="text"
            />
            <div v-if="!todo.edit" class="overflow-hidden text-ellipsis">
              {{ todo.content }}
            </div>
            <textarea
              v-else
              :ref="(el) => (todo.editTodoRefs = el as HTMLTextAreaElement)"
              v-model.trim="todo.tempContent"
              class="flex-1 resize-none rounded-md px-4 py-2 outline-none ring-1 ring-inset ring-gray-300 focus:ring-blue-600"
              placeholder="Todo"
              :disabled="apiFetching"
              @click.stop
            />
            <div class="ml-auto flex shrink-0 gap-2 pl-2">
              <template v-if="!todo.edit">
                <UIButton
                  icon="ic:round-mode-edit-outline"
                  square
                  variant="text"
                  :disabled="apiFetching"
                  @click.stop="editTodoToggle(index)"
                />
                <UIButton
                  icon="ic:baseline-delete"
                  square
                  variant="text"
                  :disabled="apiFetching"
                  @click.stop="deleteTodo(todo, index)"
                />
              </template>
              <template v-else>
                <UIButton
                  color="lightGray"
                  icon="ic:round-close"
                  square
                  variant="text"
                  :disabled="apiFetching"
                  @click.stop="editTodoToggle(index)"
                />
                <UIButton
                  color="green"
                  icon="ic:round-done"
                  square
                  variant="text"
                  :disabled="apiFetching"
                  @click.stop="updateTodo(todo, index)"
                />
              </template>
            </div>
          </li>
        </TransitionGroup>
      </div>
    </main>
  </LayoutDefault>
</template>

<script lang="ts" setup>
import { addTodoAPI, deleteTodoAPI, getTodoAPI, toggleTodoAPI, updateTodoAPI } from '@/api'
import { useCommonStore } from '@/stores'
import type { Todo } from '@/types'
import { replaceParams } from '@/utils/url'
import { useNow, useTextareaAutosize } from '@vueuse/core'

/* 全局屬性 */
const commonStore = useCommonStore()
const dayjs = getCurrentInstance()?.proxy?.$dayjs
const gsap = getCurrentInstance()?.proxy?.$gsap

/* 當前時間 */
const now = useNow()

/* 問候語 */
const amPm = computed(() => {
  const currentHour = dayjs?.(now.value).hour()

  if (currentHour === undefined) return ''
  if (currentHour < 4) return '午夜好'
  if (currentHour < 12) return '早上好'
  if (currentHour < 18) return '下午好'
  if (currentHour < 21) return '傍晚好'
  return '晚上好'
})

/* API 狀態 */
const apiFetching = computed(
  () =>
    addTodoFetching.value ||
    getTodoFetching.value ||
    deleteTodoFetching.value ||
    toggleTodoFetching.value ||
    updateTodoFetching.value
)

/* Todo */
const TodoList: Ref<Todo[]> = ref([])
const currentTodo: Ref<Todo> = ref({} as Todo)
const currentIndex: Ref<number> = ref(-1)

// Todo: 動效
const beforeEnter = (el: any) => {
  gsap?.set(el, {
    x: -80,
    opacity: 0
  })
}
const enter = (el: any, done: any) => {
  gsap?.to(el, {
    duration: 0.3,
    x: 0,
    opacity: 1,
    ease: 'power1.in',
    onComplete: done
  })
}
const beforeLeave = (el: any) => {
  gsap?.set(el, {
    top: `${el.offsetTop}px`
  })
}
const leave = (el: any, done: any) => {
  gsap?.to(el, {
    duration: 0.3,
    x: 80,
    opacity: 0,
    ease: 'power1.out',
    onComplete: done
  })
}

// Todo: 取得全部代辦 API
const { isFetching: getTodoFetching, execute: getTodoExecute } = getTodoAPI({
  immediate: true,
  afterFetch({ data }) {
    TodoList.value = data.data
      .map((i: Todo[]) => ({
        editTodoRefs: null,
        autosize: null,
        tempContent: '',
        edit: false,
        ...i
      }))
      .reverse()

    return { data }
  }
})

// Todo: 新增代辦 - 輸入框自動大小
const { textarea: addTodoRefs, input: addTodoData } = useTextareaAutosize({ input: ref('') })
// Todo: 新增代辦 API
const { isFetching: addTodoFetching, execute: addTodoExecute } = addTodoAPI({
  afterFetch({ data }) {
    addTodoData.value = ''
    getTodoExecute()
    return { data }
  }
}).post(computed(() => ({ content: addTodoData.value })))
// Todo: 新增代辦 - Enter送出/換行
const handleKeyDown = (event: any) => {
  if (event.ctrlKey && event.key === 'Enter') return addTodoExecute()
}

// Todo: 刪除代辦
const deleteTodo = async (todo: Todo, index: number) => {
  currentTodo.value = todo
  currentIndex.value = index
  deleteTodoExecute()
}
// Todo: 刪除代辦 API
const { isFetching: deleteTodoFetching, execute: deleteTodoExecute } = deleteTodoAPI({
  beforeFetch({ url }) {
    return { url: replaceParams(url, { id: currentTodo.value.id }) }
  },
  afterFetch({ data }) {
    TodoList.value = TodoList.value.filter((_, i) => i !== currentIndex.value)
    return { data }
  }
})

// Todo: 切換代辦完成狀態
const toggleTodo = (todo: Todo, index: number) => {
  currentTodo.value = todo
  currentIndex.value = index
  toggleTodoExecute()
}
// Todo: 切換代辦完成狀態 API
const { isFetching: toggleTodoFetching, execute: toggleTodoExecute } = toggleTodoAPI({
  beforeFetch({ url }) {
    return { url: replaceParams(url, { id: currentTodo.value.id }) }
  },
  afterFetch({ data }) {
    TodoList.value[currentIndex.value].status = !currentTodo.value.status
    return { data }
  }
})

// Todo: 切換編輯代辦內容
const editTodoToggle = (index: number) => {
  TodoList.value[index].tempContent = TodoList.value[index].content
  TodoList.value[index].edit = !TodoList.value[index].edit
  if (TodoList.value[index].edit) {
    nextTick(() => {
      TodoList.value[index].editTodoRefs.focus()
    })
  }
}
// Todo: 編輯代辦內容 - 輸入框自動大小
watch(
  () => TodoList.value.map((todo) => todo.editTodoRefs),
  (newRefsArray, oldRefsArray) => {
    newRefsArray.forEach((newRefs, index) => {
      const oldRefs = oldRefsArray[index] ?? null
      TodoList.value[index].autosize =
        newRefs !== oldRefs
          ? newRefs !== null
            ? useTextareaAutosize({
                element: TodoList.value[index].editTodoRefs,
                input: TodoList.value[index].tempContent
              })
            : null
          : TodoList.value[index].autosize
    })
  },
  { deep: true }
)

// Todo: 更新代辦內容
const updateTodo = (todo: Todo, index: number) => {
  currentTodo.value = todo
  currentIndex.value = index
  updateTodoExecute()
}
// Todo: 更新代辦內容 API
const { isFetching: updateTodoFetching, execute: updateTodoExecute } = updateTodoAPI({
  beforeFetch({ url }) {
    return { url: replaceParams(url, { id: currentTodo.value.id }) }
  },
  afterFetch({ data }) {
    TodoList.value[currentIndex.value].content = currentTodo.value.tempContent
    editTodoToggle(currentIndex.value)
    return { data }
  }
}).post(computed(() => ({ content: currentTodo.value.tempContent })))
</script>

<style lang="scss" scoped>
.todo-list-leave-active {
  position: absolute;
}

.todo-list-move {
  transition: all 0.3s ease-in-out;
}
</style>
