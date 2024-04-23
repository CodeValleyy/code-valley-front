<script setup lang="ts">
import Prism from 'prismjs'
import { onMounted } from 'vue'

const insertTab = (event: KeyboardEvent) => {
  if (event.key === 'Tab') {
    event.preventDefault()
    const textarea = event.target as HTMLTextAreaElement
    const start = textarea.value.slice(0, textarea.selectionStart)
    const end = textarea.value.slice(textarea.selectionEnd)
    textarea.value = start + '  ' + end
    const newPosition = start.length + 2
    textarea.setSelectionRange(newPosition, newPosition)
  }
}

onMounted(() => {
  Prism.highlightAll()
})

const model = defineModel<string>()
</script>

<template>
  <textarea
    v-model="model"
    rows="10"
    cols="50"
    @keydown.tab.prevent="insertTab"
    class="language-javascript w-7/12 p-4 h-full rounded bg-gray-700 mr-4 text-white text-lg"
  ></textarea>
</template>
