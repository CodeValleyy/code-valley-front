<script setup lang="ts">
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import Button from '@/components/Button.vue'
import Loading from '@/components/Loading.vue'
import CodeEditor from '@/components/CodeEditor.vue'
import { ref, watch } from 'vue'
import { fetchData } from '@/composables/code'
const codeInput = ref('')
const result = ref('')
const isLoading = ref(false)
const error = ref('')
const languages = [
  ['rust', 'Rust'],
  ['python', 'Python'],
  ['lua', 'Lua'],
  ['javascript', 'JS']
]
//const languages = [['python', 'Python']]

const currentLanguage = ref(languages[0][0])

const runCode = async () => {
  if (!codeInput || codeInput.value === '') return

  isLoading.value = true
  try {
    console.log(codeInput.value)
    const language = currentLanguage.value
    const fetchedResult = await fetchData(language, codeInput.value)
    result.value = fetchedResult
  } catch (err: any) {
    error.value = err
  } finally {
    isLoading.value = false
  }
}

const getLanguage = (language: string) => {
  currentLanguage.value = language
}
</script>

<template>
  <Header />
  <div class="min-h-screen h-full flex flex-col justify-between">
    <div class="w-full h-full pt-40 p-4 flex flex-col items-center mb-20">
      <div class="mb-4 text-2xl p-8 font-semibold">Page de code</div>
      <div class="flex justify-center h-96 w-11/12 items-start">
        <div class="w-7/12 h-full flex flex-col mr-6">
          <div class="text-primary mb-2">Code :</div>
          <CodeEditor
            class="mr-10"
            width="100%"
            height="100%"
            z-index="1"
            v-model="codeInput"
            :line-nums="true"
            :languages="languages"
            @lang="getLanguage"
          />
          <Button @click="runCode()" label="Run Code" color="primary" class="w-fit self-end mt-2" />
        </div>

        <div v-show="isLoading || error || result !== ''" class="w-3/12 h-full">
          <div v-show="!isLoading" class="text-primary mb-2">Compilation :</div>
          <div v-show="isLoading" class="text-backgroundColor mb-2">Compilation :</div>
          <Loading v-if="isLoading" />
          <div v-else-if="error" class="w-full h-fit rounded text-secondary">
            {{ error }}
          </div>
          <div v-else class="w-full p-4 h-fit rounded bg-gray-300">{{ result }}</div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>
