<script setup lang="ts">
import { getExtensionFromUrl, getNameFromUrl } from '@/config/languagesConfig'
import type { User } from '@/types'
import type { MessageResponse } from '@/types/MessageResponse'
import { formatCreatedAt } from '@/utils/date-utils'
import { onMounted, ref } from 'vue'

const props = defineProps<{
  message: MessageResponse
  user?: User
}>()

const extension = ref<string>()
const file_name = ref<string>()

const isAuthor = ref(props.user?.id === props.message.author.id ? true : false)
const hasImage = ref(false)
const hasFile = ref(false)

function downloadPage(url: string, filename: string) {
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      return response.text()
    })
    .then((html) => {
      const blob = new Blob([html], { type: 'text/html' })
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = filename + '.' + extension.value
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    })
    .catch((error) => {
      console.error('There was a problem with the fetch operation:', error)
    })
}

onMounted(() => {
  let result: string | null = ''
  if (props.message.file) {
    result = getExtensionFromUrl(props.message.file)
    file_name.value = getNameFromUrl(props.message.file)
  }
  extension.value = result != null ? result : ''

  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif']
  const scriptExtensions = ['js', 'rs', 'lua', 'py', 'ts', 'java', 'cpp', 'cs']

  if (imageExtensions.includes(extension.value)) {
    hasImage.value = true
    hasFile.value = false
  } else if (scriptExtensions.includes(extension.value)) {
    hasImage.value = false
    hasFile.value = true
  } else {
    hasImage.value = false
    hasFile.value = false
  }
})
</script>

<template>
  <div v-if="!isAuthor" class="w-full">
    <div class="text-xs text-gray-400 mb-1">
      {{ message?.author.username }} - {{ formatCreatedAt(message.createdAt) }}
    </div>
    <div class="w-fit flex flex-col py-2 px-4 border rounded-lg">
      <div>{{ message.value }}</div>
      <div class="mt-2" v-if="message.file">
        <img v-if="hasImage" :src="message.file" />
        <div v-if="hasFile">
          <div v-if="hasFile">
            <div
              v-if="file_name"
              class="cursor-pointer bg-gray-100 text-black p-4 rounded flex items-center hover:bg-gray-400 shadow"
              @click="downloadPage(message.file, file_name)"
            >
              <v-icon color="primary" class="mr-2"> mdi-download </v-icon>
              <div>{{ file_name }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="w-full flex flex-col items-end">
    <div class="text-xs text-gray-400 mb-1">
      {{ formatCreatedAt(message.createdAt) }}
    </div>
    <div class="w-fit flex flex-col py-2 px-4 bg-primaryTailwind rounded-lg text-white">
      <div>{{ message.value }}</div>
      <div class="mt-2" v-if="message.file">
        <img v-if="hasImage" :src="message.file" />
        <div v-if="hasFile">
          <div
            v-if="file_name"
            class="cursor-pointer bg-gray-100 text-black p-4 rounded flex items-center hover:bg-gray-400 shadow"
            @click="downloadPage(message.file, file_name)"
          >
            <v-icon color="primary" class="mr-2"> mdi-download </v-icon>
            <div>{{ file_name }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
