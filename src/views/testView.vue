<template>
  <div class="container space-y-10 py-10">
    <UIButton label="++" color="green" size="lg" @click="add"></UIButton>

    <ul class="flex flex-col gap-4">
      <TransitionGroup name="list" @before-enter="beforeEnter" @enter="enter" @leave="leave">
        <li
          v-for="(li, index) in liArray"
          :key="li"
          class="inline-block w-56 cursor-pointer rounded border p-2 text-center"
          @click="remove(index)"
        >
          {{ li }}
        </li>
      </TransitionGroup>
    </ul>
  </div>
</template>

<script lang="ts" setup>
const gsap = getCurrentInstance()?.proxy?.$gsap
const box = ref(null)
const liArray = ref(
  Array(5)
    .fill(1)
    .map((_, i) => i + 1)
)
const current = ref(5)
const add = () => {
  liArray.value.splice(Math.floor(Math.random() * liArray.value.length), 0, current.value++)
}
const remove = (index: number) => {
  liArray.value.splice(index, 1)
}

// --------
// ENTERING
// --------
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
    onComplete: done
  })
}

// --------
// LEAVING
// --------
const leave = (el: any, done: any) => {
  gsap?.to(el, {
    duration: 0.3,
    x: 80,
    opacity: 0,
    onComplete: done
  })
}
</script>

<style lang="scss" scoped>
.list-move {
  transition: all 0.3s ease-in-out;
}
</style>
