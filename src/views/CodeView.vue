<template>
  <v-container>
    <v-row class="justify-center mt-4">
      <h1 class="mb-6 text-4xl font-bold text-primary">🦖 Code</h1>
    </v-row>
    <v-row class="justify-center">
      <v-col cols="14" md="12">
        <v-card class="pa-6">
          <v-row>
            <v-col cols="12" md="6">
              <v-select
                v-model="currentLanguage"
                :items="languages"
                item-text="name"
                item-value="id"
                label="Langage"
                class="mb-4"
              ></v-select>
              <CodeMirror
                v-model="codeInput"
                basic
                :extensions="[lang]"
                :theme="dark ? 'dark' : 'light'"
                height="300px"
                class="mb-4"
                @keydown.tab.prevent.stop="tab"
                @keydown.shift.tab.prevent.stop="tab"
                @keydown.ctrl.s.prevent.stop="runCode"
              />
              <v-btn color="primary" @click="runCode" class="mt-2">Run Code</v-btn>
            </v-col>
            <v-col cols="8" md="4" v-show="isLoading || error || result !== ''">
              <div v-show="!isLoading" class="text-primary mb-2">Résultats :</div>
              <div v-show="isLoading" class="text-backgroundColor mb-2">Compilation :</div>
              <Loading v-if="isLoading" />
              <div v-else-if="error" class="w-full h-fit rounded text-secondary">
                {{ error }}
              </div>
              <div v-else class="w-full p-4 h-fit rounded bg-gray-300" v-html="result"></div>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import Loading from '@/components/Loading.vue'
import CodeMirror from 'vue-codemirror6'
import { python } from '@codemirror/lang-python'
import { rust } from '@codemirror/lang-rust'
import { javascript } from '@codemirror/lang-javascript'
import { useCodeRunner } from '@/composables/useCodeRunner'

const { codeInput, result, isLoading, error, runCode, currentLanguage, languages } = useCodeRunner()
const dark = ref(window.matchMedia('(prefers-color-scheme: dark)').matches)

const lang = computed(() => {
  switch (currentLanguage.value) {
    case 'python':
      return python()
    case 'rust':
      return rust()
    case 'javascript':
      return javascript()
    default:
      return python()
  }
})

const tab = (e: KeyboardEvent) => {
  const cm = e.target as HTMLTextAreaElement
  const start = cm.selectionStart
  const end = cm.selectionEnd

  const insert = '  '
  cm.value = cm.value.substring(0, start) + insert + cm.value.substring(end)

  cm.selectionStart = cm.selectionEnd = start + insert.length
}
</script>

<style scoped>
.min-h-screen {
  min-height: 100vh;
}
</style>
