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
              <v-file-input
                v-model="file"
                label="Fichier Input"
                accept=".txt, .py, .js, .rs"
                class="mb-4"
              ></v-file-input>
              <CodeMirror
                v-model="codeInput"
                basic
                :extensions="[lang]"
                height="300px"
                class="mb-4"
                @keydown.tab.prevent.stop="handleTab"
                @keydown.shift.tab.prevent.stop="handleTab"
                @keydown.ctrl.s.prevent.stop="runCode"
              />
              <v-btn color="primary" @click="runCode" class="mt-2">Run Code</v-btn>
              <v-btn
                v-if="downloadLink"
                :href="downloadLink"
                download="output.txt"
                class="mt-2 ml-4"
              >
                Download Output File
              </v-btn>
            </v-col>
            <v-col cols="8" md="4" v-show="isLoading || error || result !== '' || fileContent">
              <div v-show="!isLoading" class="text-primary mb-2">Résultats :</div>
              <div v-show="isLoading" class="text-backgroundColor mb-2">Compilation :</div>
              <Loading v-if="isLoading" />
              <div v-else-if="error" class="w-full h-fit rounded text-secondary">
                {{ error }}
              </div>
              <div v-else class="w-full p-4 h-fit rounded bg-gray-300" v-html="result"></div>
              <v-card v-if="fileContent" class="mt-4">
                <v-card-title>Output File Content</v-card-title>
                <v-card-text>{{ fileContent }}</v-card-text>
              </v-card>
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

const {
  codeInput,
  result,
  isLoading,
  error,
  file,
  runCode,
  currentLanguage,
  languages,
  downloadLink,
  fileContent
} = useCodeRunner()

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

const handleTab = (e: KeyboardEvent) => {
  const cm = e.target as HTMLDivElement

  if (cm.classList.contains('cm-content')) {
    const activeLine = cm.querySelector('.cm-activeLine')
    if (activeLine && activeLine.textContent !== null) {
      const range = document.createRange()
      const selection = window.getSelection()

      if (activeLine.textContent !== null) {
        activeLine.textContent = '  ' + activeLine.textContent
        const spaces = activeLine.textContent.match(/^ +/)
        if (spaces) {
          const spacesLength = spaces[0].length
          const spacesText = ' '.repeat(spacesLength)
          activeLine.textContent = spacesText + activeLine.textContent.substring(spacesLength)
        }

        range.setStart(activeLine.childNodes[0], spaces ? spaces[0].length : 0)
        range.collapse(true)

        if (selection) {
          selection.removeAllRanges()
          selection.addRange(range)
        }
      }
    }
  }
}
</script>

<style scoped>
.min-h-screen {
  min-height: 100vh;
}
</style>
