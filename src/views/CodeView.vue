<template>
  <Header />
  <div class="min-h-screen h-full flex flex-col justify-between">
    <div class="w-full h-full pt-40 p-4 flex flex-col items-center mb-20">
      <div class="mb-4 text-2xl p-8 font-semibold">Page de code</div>
      <div class="flex justify-center h-full w-11/12 items-start">
        <div class="w-7/12 h-full flex flex-col mr-6">
          <div class="text-primary mb-2">Langage :</div>
          <select v-model="currentLanguage" class="mb-4">
            <option v-for="language in languages" :key="language[0]" :value="language[0]">
              {{ language[1] }}
            </option>
          </select>
          <div class="text-primary mb-2">Code :</div>
          <div class="code-editor-container">
            <code-mirror
              v-model="codeInput"
              basic
              :dark="dark"
              :lang="lang"
              class="border"
              @keyup.alt.s="runCode"
            />
          </div>
          <Button
            @click="runCode"
            label="Run Code"
            primary
            size="large"
            class="w-fit self-end mt-2"
          />
        </div>
        <div v-show="isLoading || error || result !== ''" class="w-3/12 h-full">
          <div v-show="!isLoading" class="text-primary mb-2">Résultats :</div>
          <div v-show="isLoading" class="text-backgroundColor mb-2">Compilation :</div>
          <Loading v-if="isLoading" />
          <div v-else-if="error" class="w-full h-fit rounded text-secondary">
            {{ error }}
          </div>
          <div v-else class="w-full p-4 h-fit rounded bg-gray-300">
            {{ result }}
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import Button from '@/components/Button.vue'
import Loading from '@/components/Loading.vue'
import CodeMirror from 'vue-codemirror6'
import { python } from '@codemirror/lang-python'
import { rust } from '@codemirror/lang-rust'
//import { lua } '@codemirror/lang-lua';
import { javascript } from '@codemirror/lang-javascript'
import { useCodeRunner } from '@/composables/useCodeRunner'

const { codeInput, result, isLoading, error, runCode, currentLanguage, languages } = useCodeRunner()

const dark = ref(window.matchMedia('(prefers-color-scheme: dark)').matches)

// Watch for changes in currentLanguage and update the editor's language mode
const lang = computed(() => {
  switch (currentLanguage.value) {
    case 'python':
      return python()
    case 'rust':
      return rust()
    //case 'lua': return "lua()";
    case 'javascript':
      return javascript()
    default:
      return python()
  }
})
</script>

<style scoped>
.min-h-screen {
  min-height: 100vh;
}

.code-editor-container {
  height: 500px;
  overflow-y: auto;
  border: 1px solid grey;
  border-radius: 4px;
}

.border {
  border: 1px solid grey;
}
</style>
