<template>
  <div class="flex min-h-screen flex-col">
    <!-- Header -->
    <header class="sticky top-0 border-b bg-white/90 backdrop-blur-sm">
      <div
        class="container flex h-16 items-center justify-between gap-6 overflow-hidden text-nowrap text-4xl"
      >
        <h1 class="font-bold tracking-widest text-blue-600">TS Todo</h1>
        <UIButton
          label="登出"
          color="blue"
          icon="ic:baseline-logout"
          size="lg"
          trailing
          variant="link"
          :disabled="apiFetching"
          @click="logoutExecute"
        />
      </div>
    </header>

    <!-- Main Content -->
    <main class="my-bg flex-1 py-10">
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
              v-model="addTodoData"
              class="flex-1 resize-none rounded-md px-4 py-2 outline-none ring-1 ring-inset ring-gray-300 focus:ring-blue-600"
              placeholder="Todo"
              :disabled="apiFetching"
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
        <div
          v-for="(todo, index) in TodoList"
          :key="todo.id"
          :class="[
            todo.status && !todo.edit && 'line-through',
            todo.status ? 'border-transparent bg-gray-100 text-gray-500 ' : 'bg-white',
            'flex items-center rounded-xl border-2  p-[0.625rem] px-4 font-black transition-all hover:border-gray-300 hover:shadow '
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
            v-model="todo.tempContent"
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
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="border-t bg-white">
      <div class="container flex h-14 items-center justify-center">
        <h6 class="text-sm font-bold text-gray-600">Copyright © 2024 by Hao</h6>
      </div>
    </footer>

    <!-- Scroll Top -->
    <Transition>
      <div
        v-if="scrollTopIsShow"
        class="fixed bottom-10 right-10 z-10 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-black/20 text-[2.163rem] text-white transition-all hover:bg-black/40 hover:shadow"
        @click="scrollTop()"
      >
        <Icon icon="ic:round-vertical-align-top" />
      </div>
    </Transition>
  </div>
</template>

<script lang="ts" setup>
import {
  addTodoAPI,
  deleteTodoAPI,
  getTodoAPI,
  logoutAPI,
  toggleTodoAPI,
  updateTodoAPI
} from '@/api'
import { useCommonStore, useStyleStore } from '@/stores'
import type { Todo } from '@/types'
import { replaceParams } from '@/utils/url'
import { useNow, useTextareaAutosize, useWindowScroll, useWindowSize } from '@vueuse/core'

/* 全局屬性 */
const commonStore = useCommonStore()
const useStyle = useStyleStore()
const router = useRouter()
const Swal = getCurrentInstance()?.proxy?.$Swal
const dayjs = getCurrentInstance()?.proxy?.$dayjs

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

/* 至頂 */
const { height } = useWindowSize()
const { y } = useWindowScroll({ behavior: 'smooth' })
const scrollTop = () => {
  y.value = 0
}
// 至頂: 按鈕顯示
const scrollTopIsShow = computed(() => y.value > height.value / 2)

/* API 狀態 */
const apiFetching = computed(
  () =>
    logoutFetching.value ||
    addTodoFetching.value ||
    getTodoFetching.value ||
    deleteTodoFetching.value ||
    toggleTodoFetching.value ||
    updateTodoFetching.value
)

/* 登出 API */
const { isFetching: logoutFetching, execute: logoutExecute } = logoutAPI({
  afterFetch({ data }) {
    commonStore.auth = {
      token: '',
      nickname: ''
    }
    router.push({ name: 'login' })
    return { data }
  },
  onFetchError({ data }) {
    Swal?.fire({
      title: '驗證失敗',
      text: '請重新登入',
      icon: 'warning',
      confirmButtonText: '確認',
      confirmButtonColor: useStyle.confirmButtonColor,
      allowOutsideClick: false,
      willClose: () => {
        commonStore.auth = {
          token: '',
          nickname: ''
        }
        router.push({ name: 'login' })
      }
    })
    return data
  }
})

/* Todo */
const TodoList: Ref<Todo[]> = ref([])
const currentTodo: Ref<Todo> = ref({} as Todo)
const currentIndex: Ref<number> = ref(-1)

// Todo: 取得全部代辦 API
const { isFetching: getTodoFetching, execute: getTodoExecute } = getTodoAPI({
  immediate: true,
  afterFetch({ data }) {
    TodoList.value = data.data.map((i: Todo[]) => ({
      editTodoRefs: null,
      autosize: null,
      tempContent: '',
      edit: false,
      ...i
    }))

    return { data }
  }
})

// Todo: 新增代辦 - 輸入框自動大小
const { textarea: addTodoRefs, input: addTodoData } = useTextareaAutosize()
// Todo: 新增代辦 API
const { isFetching: addTodoFetching, execute: addTodoExecute } = addTodoAPI({
  afterFetch({ data }) {
    addTodoData.value = ''
    getTodoExecute()
    return { data }
  }
}).post(computed(() => ({ content: addTodoData.value })))

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
.my-bg {
  background-color: #fff;
  background-image: linear-gradient(90deg, rgb(243 244 246) 1px, transparent 0),
    linear-gradient(180deg, rgb(243 244 246) 1px, transparent 0);
  background-position-x: center;
  background-position-y: -1px;
  background-size: 45px 45px;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
