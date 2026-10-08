<template>
  <LayoutDefault>
    <main class="todo-view">
      <div class="container lg:max-w-[50rem]">
        <!-- 歡迎訊息 -->
        <div class="break-words text-2xl font-bold">
          {{ amPm }}，{{ commonStore.auth.nickname }}，歡迎回來👋
        </div>

        <!-- 新增代辦輸入框 -->
        <div class="mt-4 space-y-6 rounded-xl bg-gray-100 p-6">
          <div class="flex flex-wrap items-center justify-between font-bold text-gray-600">
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
                'min-w-0 flex-1 resize-none rounded-md px-4 py-2 outline-none ring-1 ring-inset'
              ]"
              placeholder="Todo"
              aria-label="新增待辦事項"
              :disabled="addTodoFetching || loading || !!loadError"
              @keydown="(event) => onKeyboardSubmit(event, onTodoSubmit)"
            />
            <UIButton
              label="新增"
              color="blue"
              size="lg"
              :disabled="addTodoFetching || loading || !!loadError"
              @click="onTodoSubmit()"
            />
            <div v-if="addTodoDataError" class="w-full text-red-600">Todo 為必填</div>
          </div>
        </div>

        <div
          class="relative mt-4 h-6 overflow-hidden rounded-full bg-gray-300 text-sm font-bold tracking-wide text-white"
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

        <p v-if="loading" class="mt-4 text-center text-gray-500" role="status">載入中…</p>
        <div v-else-if="loadError" class="mt-4 text-center" role="alert">
          <p class="text-red-600">{{ loadError }}</p>
          <UIButton class="mx-auto mt-2" label="重新載入" color="blue" variant="link" @click="load" />
        </div>
        <p v-else-if="!TodoList.length" class="mt-4 text-center text-gray-500">尚無待辦事項</p>
        <!-- 代辦清單 -->
        <TransitionGroup class="relative mt-4 space-y-4" name="todo-list" tag="ul">
          <li
            v-for="todo in TodoList"
            :ref="(el) => (todo.todoRefs = el as HTMLLIElement)"
            :key="todo.id"
            :class="[
              todo.status && !todo.edit && 'line-through',
              todo.status ? 'border-transparent bg-gray-100 text-gray-500' : 'bg-white',
              'flex w-full flex-wrap items-center gap-y-2 overflow-hidden rounded-xl border-2 p-[0.625rem] px-4  transition-all hover:border-gray-300 hover:shadow'
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
              :aria-label="todo.status ? '標記為未完成' : '標記為完成'"
              :aria-pressed="todo.status"
              :disabled="pending.has(todo.id) || todo.edit"
              @click="handleTodo(todo, 'toggle')"
            />

            <!-- 編輯代辦輸入框 -->
            <textarea
              :ref="(el) => (todo.editTodoRefs = el as HTMLTextAreaElement)"
              v-model.trim="todo.tempContent"
              :class="[
                todo.edit ? 'bg-white ring-1 ring-inset ' : 'cursor-default',
                todo.edit && todo.error ? 'ring-red-600' : 'ring-gray-300 focus:ring-blue-600',
                'min-w-0 flex-1 resize-none rounded-md bg-transparent px-4 py-2 outline-none'
              ]"
              :aria-label="todo.edit ? '編輯待辦事項' : '待辦事項'"
              placeholder="Todo"
              @input="todo.error = false"
              :readonly="!todo.edit"
              :disabled="pending.has(todo.id)"
              @keydown="
                (event) => onKeyboardSubmit(event, () => handleTodo(todo, 'update'))
              "
            />

            <!-- 按鈕組 -->
            <div class="ml-auto flex shrink-0 gap-2 pl-2">
              <!--  編輯&刪除 -->
              <template v-if="!todo.edit">
                <UIButton
                  icon="ic:round-mode-edit-outline"
                  aria-label="編輯待辦"
                  square
                  variant="text"
                  :disabled="pending.has(todo.id)"
                  @click="editTodoToggle(todo)"
                />
                <UIButton
                  icon="ic:baseline-delete"
                  aria-label="刪除待辦"
                  square
                  variant="text"
                  :disabled="pending.has(todo.id)"
                  @click="handleTodo(todo, 'delete')"
                />
              </template>

              <!--  取消/完成編輯 -->
              <template v-else>
                <UIButton
                  color="lightGray"
                  icon="ic:round-close"
                  aria-label="取消編輯"
                  square
                  variant="text"
                  :disabled="pending.has(todo.id)"
                  @click="editTodoToggle(todo)"
                />
                <UIButton
                  color="blue"
                  icon="ic:round-done"
                  aria-label="儲存待辦"
                  square
                  variant="text"
                  :disabled="pending.has(todo.id)"
                  @click="handleTodo(todo, 'update')"
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
import { useCommonStore, useMessageStore } from '@/stores'
import { useTodos } from '@/composables/useTodos'
import type { Todo } from '@/types'
import { useNow, useTextareaAutosize, useWindowSize } from '@vueuse/core'

const commonStore = useCommonStore()
const messageStore = useMessageStore()
const router = useRouter()
const dayjs = getCurrentInstance()?.proxy?.$dayjs
const now = useNow({ interval: 1000 })
const { width: windowWidth } = useWindowSize()
const amPm = computed(() => {
  const hour = dayjs?.(now.value).hour()
  if (hour === undefined) return ''
  if (hour < 4) return '午夜好'
  if (hour < 12) return '早上好'
  if (hour < 18) return '下午好'
  if (hour < 21) return '傍晚好'
  return '晚上好'
})
const token = commonStore.auth.token
const { todos: TodoList, loading, adding: addTodoFetching, loadError, pending, load, add, mutate } = useTodos(
  (error) => {
    if (error.status === 401 && commonStore.auth.token === token) {
      commonStore.auth = { token: '', nickname: '' }
      router.replace({ name: 'login' })
      messageStore.error({ message: '登入已失效，請重新登入。' })
    } else messageStore.error({ message: error.message })
  },
  (action) => {
    const messages: Record<string, string> = { add: 'Todo 已新增.', delete: 'Todo 已刪除.', toggle: 'Todo 狀態更新.', update: 'Todo 更新成功.' }
    if (action === 'delete') messageStore.warn({ message: messages[action] })
    else messageStore.success({ message: messages[action] })
  }
)
const doneTodos = computed(() => TodoList.value.filter((todo) => todo.status).length)
const { textarea: addTodoRefs, input: addTodoData } = useTextareaAutosize({ input: ref('') })
const addTodoDataError = ref(false)
watch(addTodoData, () => { addTodoDataError.value = false })

async function onTodoSubmit() {
  if (addTodoFetching.value || loading.value) return
  if (!addTodoData.value.trim()) {
    addTodoDataError.value = true
    addTodoRefs.value?.focus()
    return
  }
  if (await add(addTodoData.value)) {
    addTodoData.value = ''
    addTodoRefs.value?.focus()
  }
}
function onKeyboardSubmit(event: KeyboardEvent, submit: () => void) {
  if (event.isComposing || event.repeat || !(event.ctrlKey || event.metaKey) || event.key !== 'Enter') return
  event.preventDefault()
  submit()
}
function editTodoToggle(todo: Todo) {
  if (pending.has(todo.id)) return
  todo.edit = !todo.edit
  todo.error = false
  todo.tempContent = todo.content
  if (todo.edit) nextTick(() => todo.editTodoRefs?.focus())
}
function handleTodo(todo: Todo, action: 'delete' | 'toggle' | 'update') {
  if (action === 'update') {
    if (!todo.edit) return
    if (!todo.tempContent.trim()) {
      todo.error = true
      todo.editTodoRefs?.focus()
      return
    }
  }
  mutate(todo, action)
}
// Resize after content or edit mode changes, without creating watchers on each refresh.
watch([() => TodoList.value.map((todo) => [todo.tempContent, todo.edit]), windowWidth], async () => {
  await nextTick()
  TodoList.value.forEach((todo) => {
    const el = todo.editTodoRefs
    if (el) { el.style.height = 'auto'; el.style.height = `${el.scrollHeight}px` }
  })
}, { flush: 'post' })
onMounted(load)
</script>

<style lang="scss" scoped>
.todo-view {
  @apply flex-1 py-10;
}

.progress-bar,
.todo-list-move {
  transition: all 0.3s ease-in-out;
}

.todo-list-enter-active {
  transition: all 0.3s ease-out;
}

.todo-list-leave-active {
  transition: all 0.2s ease-in;
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
