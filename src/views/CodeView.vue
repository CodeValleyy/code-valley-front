<template>
  <v-container class="min-w-full min-h-full">
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
              <v-chip class="mb-4" v-if="error" color="error" dark>{{ error }}</v-chip>
              <v-chip class="mb-4" v-if="success" color="success" dark>{{ success }}</v-chip>
              <v-file-input
                v-model="file"
                label="Fichier Input"
                accept="*"
                class="mb-4"
              ></v-file-input>
              <v-autocomplete
                v-model="currentOutputExtension"
                :items="displayedExtensions"
                item-title="text"
                item-value="value"
                label="Extension de l'output"
                class="mb-4"
                clearable
                hide-details
                hide-selected
                solo
              ></v-autocomplete>
              <p class="mb-4">Extensions affichées : {{ displayedExtensions.length }}</p>
              <p class="text-green-700 mb-4">
                Ce système d'affichage d'extension permet de ne pas surcharger le menu déroulant
                avec des extensions inutiles.
              </p>
              <v-switch
                v-model="showAllExtensions"
                :label="
                  showAllExtensions
                    ? 'Extensons affichées : Toutes'
                    : 'Extensons affichées : Seulement les plus courantes'
                "
                :class="showAllExtensions ? 'text-green-700' : 'text-red-700'"
              ></v-switch>
              <v-switch
                v-model="useOneDarkTheme"
                :label="useOneDarkTheme ? 'Thème : One Dark' : 'Thème : Default'"
                :class="useOneDarkTheme ? 'text-green-700' : 'text-red-700'"
              ></v-switch>
              <v-btn color="primary" @click="runCode" class="mt-2 mb-4">Run Code</v-btn>
              <v-btn
                color="primaryLight"
                v-if="isCodeLoaded"
                @click="unloadCode"
                class="mt-2 mb-4 ml-4"
                :disabled="!isCodeLoaded"
                >Décharger</v-btn
              >
              <v-btn
                color="primaryLight"
                @click="openLoadDialog"
                class="mt-2 mb-4 ml-4"
                :disabled="isCodeLoaded"
                >Charger</v-btn
              >
              <v-btn color="primaryLight" v-if="codeInput" class="mt-2 mb-4 ml-4" @click="openModal"
                >Sauvegarder</v-btn
              >
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
        <!-- Save Dialog-->
        <v-dialog v-model="saveDialog" max-width="400">
          <v-card>
            <v-card-title>Sauvegarder le fichier</v-card-title>
            <v-text-field
              v-model="filename"
              :label="file_loaded ? file_loaded.name : filename ? filename : 'Nom du fichier'"
              outlined
              :disabled="file_loaded !== null || selectedSnippet !== ''"
            ></v-text-field>
            <v-card-actions>
              <v-btn color="primary" @click="saveCodeToFile">Télécharger</v-btn>
              <v-btn color="primary" @click="saveCodeToSnippet">Sauvegarder</v-btn>
              <v-btn @click="saveDialog = false">Annuler</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <!-- Load Dialog-->
        <v-dialog v-model="loadDialog" max-width="400">
          <v-card>
            <v-card-title>Charger le fichier</v-card-title>
            <v-card-text>
              <v-radio-group v-model="loadOption" row>
                <v-radio label="Charger depuis un fichier" value="file"></v-radio>
                <v-radio label="Sélectionner un snippet" value="snippet"></v-radio>
              </v-radio-group>
              <v-file-input
                v-if="loadOption === 'file'"
                v-model="file_loaded"
                label="Fichier Input"
                accept=".lua, .py, .js, .rs"
                class="mb-4"
              ></v-file-input>
              <v-select
                v-if="loadOption === 'snippet'"
                v-model="selectedSnippet"
                :items="snippets"
                item-title="filename"
                item-value="id"
                label="Sélectionner un snippet"
                class="mb-4"
              ></v-select>
            </v-card-text>
            <v-card-actions>
              <v-btn color="primary" @click="loadCode">Charger</v-btn>
              <v-btn @click="loadDialog = false">Annuler</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
    <!--Code View-->
    <v-container class="mt-4 min-h-screen">
      <CodeMirror
        v-model="codeInput"
        basic
        :extensions="[lang]"
        :style="{ height: '400px' }"
        height="400px"
        class="mb-4"
        :tab-size="2"
        :autofocus="true"
        :indent-with-tab="true"
        @keydown.tab.prevent.stop="handleTab"
        @keydown.shift.tab.prevent.stop="handleShiftTab"
        @keydown.ctrl.s.prevent.stop="runCode"
      />
    </v-container>
  </v-container>
</template>

<script setup lang="ts">
import Loading from '@/components/Loading.vue'
import CodeMirror from 'vue-codemirror6'
import { useCodeRunner } from '@/composables/useCodeRunner'
const {
  codeInput,
  result,
  isLoading,
  error,
  success,
  file,
  runCode,
  currentLanguage,
  currentOutputExtension,
  displayedExtensions,
  showAllExtensions,
  languages,
  downloadLink,
  fileContent,
  saveCodeToFile,
  saveDialog,
  filename,
  saveCodeToSnippet,
  openModal,
  openLoadDialog,
  loadDialog,
  snippets,
  file_loaded,
  isCodeLoaded,
  unloadCode,
  loadCode,
  loadOption,
  selectedSnippet,
  lang,
  useOneDarkTheme
} = useCodeRunner()

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

const handleShiftTab = (e: KeyboardEvent) => {
  const cm = e.target as HTMLDivElement

  if (cm.classList.contains('cm-content')) {
    const activeLine = cm.querySelector('.cm-activeLine')
    if (activeLine && activeLine.textContent !== null) {
      const range = document.createRange()
      const selection = window.getSelection()

      if (activeLine.textContent !== null) {
        const spaces = activeLine.textContent.match(/^ +/)
        if (spaces) {
          const spacesLength = spaces[0].length
          activeLine.textContent = activeLine.textContent.substring(spacesLength)
        }

        range.setStart(activeLine.childNodes[0], 0)
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
