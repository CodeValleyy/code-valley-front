<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="text-h5">Pipeline Orchestrator</v-card-title>
          <v-card-text>
            <ul>
              <li>
                <strong>Initial Input:</strong> The initial input for the pipeline must be a file.
              </li>
              <li>
                <strong>Step:</strong> Each step in the pipeline consists of a code snippet in a
                specific language.
              </li>
              <li>
                <strong>Output:</strong> The output of each step is passed as the input to the next
                step.
              </li>
              <li>
                <strong>Supported Languages:</strong>
                <ul>
                  <em>
                    <li v-for="language in languages" :key="language">{{ language }}</li>
                  </em>
                </ul>
              </li>
              <li>
                <strong>Usage:</strong> you must use
                <ul>
                  <li>
                    For <strong>Python</strong>, <strong>Javascript</strong> and
                    <strong>Lua</strong>: <code>(input_data, output_path)</code>
                  </li>
                  <li>For <strong>result</strong>: <code>(INPUT_PATH, OUTPUT_PATH)</code></li>
                </ul>
                variables for JS, PY et LUA as in the example below.
              </li>
            </ul>
          </v-card-text>
          <v-card-text>
            <v-form ref="form" @submit.prevent="submitPipeline">
              <v-row class="mb-4">
                <v-col cols="12">
                  <v-file-input
                    v-model="initialInput"
                    label="Initial Input File"
                    accept=".txt, .py, .js, .rs"
                  ></v-file-input>
                </v-col>
              </v-row>
              <v-container v-for="(step, index) in steps.steps" :key="index" class="mb-4 pa-4">
                <v-row>
                  <v-col cols="12">
                    <h3 class="text-h6">Step {{ index + 1 }}</h3>
                  </v-col>
                  <v-col cols="12">
                    <v-select
                      :items="snippets"
                      :hint="`Langage choisi (${step.payload.language})`"
                      return-object
                      item-title="filename"
                      label="Snippets"
                      v-model="step.payload.snippet"
                      :rules="[rules.required]"
                      @change="(value: Snippets) => updatePayload(step, value)"
                    >
                    </v-select>
                  </v-col>
                </v-row>
              </v-container>

              <v-btn :disabled="!formValid" @click="addStep" color="primary" class="mr-2">
                Add Step
              </v-btn>
              <v-btn :disabled="!formValid" type="submit" color="success" class="mr-2"
                >Execute Pipeline</v-btn
              >
              <v-btn :disabled="!formValid" color="warning" @click="savePipeline"
                >Save Pipeline</v-btn
              >
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12">
        <v-card>
          <v-card-title class="text-h5">Pipeline Results</v-card-title>
          <v-card-text>
            <v-list dense>
              <v-list-item v-for="result in results" :key="result.stepNumber">
                <v-list-item-content>
                  <v-list-item-title class="text-subtitle-1"
                    >Step {{ result.stepNumber }}</v-list-item-title
                  >
                  <v-list-item-subtitle>
                    <v-row>
                      <v-col cols="12">
                        <v-chip v-if="result.output_file_content" color="primary" class="mr-2"
                          >Output File</v-chip
                        >
                        <v-chip v-if="result.output" color="green" class="mr-2">Output</v-chip>
                        <v-chip v-if="result.error" color="red">Error</v-chip>
                      </v-col>
                      <v-col cols="12">
                        <div v-if="result.error">
                          <v-alert type="error" class="mb-2">
                            <v-card-text>{{ result.error }}</v-card-text>
                          </v-alert>
                        </div>
                        <div v-if="result.output">
                          <v-alert type="success" class="mb-2">Output: {{ result.output }}</v-alert>
                        </div>
                        <div v-if="result.output_file_content">
                          <v-alert type="info" class="mb-2"
                            >Output File Content:
                            <v-card-text>{{
                              decodeBase64(result.output_file_content)
                            }}</v-card-text>
                          </v-alert>
                          <v-btn
                            @click="downloadFile(result.output_file_content, result.stepNumber)"
                            color="primary"
                            outlined
                            >Download Output File</v-btn
                          >
                        </div>
                      </v-col>
                    </v-row>
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue'
import type { StepResultDto } from '@/types/Pipeline'
import { languages } from '@/config/languagesConfig'
import { usePipeline } from '@/composables/usePipeline'
import type { BufferData } from '@/types/buffer'
import type { Snippets } from '@/types'

const {
  contents,
  snippets,
  form,
  formValid,
  initialInput,
  steps,
  results,
  addStep,
  submitPipeline,
  validateForm,
  socket,
  rules,
  savePipeline,
  updatePayload
} = usePipeline()

watch(() => steps.steps, validateForm, { deep: true })
watch(initialInput, validateForm, { deep: true })

onMounted(() => {
  socket.on('pipelineUpdate', (update: StepResultDto) => {
    if (!update) return
    console.log('Pipeline update:', update)
    results.value.push(update)
  })

  socket.on('pipelineResult', (result: string) => {
    console.log('Pipeline execution completed:', result)
  })

  socket.on('pipelineError', (error: string) => {
    console.error('Pipeline execution error:', error)
  })
})

const decodeBase64 = (base64Content: string) => {
  try {
    const byteArray = Uint8Array.from(atob(base64Content), (char) => char.charCodeAt(0))
    return new TextDecoder().decode(byteArray)
  } catch (error) {
    console.error('Error decoding base64 content:', error)
    return ''
  }
}

const downloadFile = (base64Content: string, stepNumber: number) => {
  const decodedContent = Uint8Array.from(atob(base64Content), (char) => char.charCodeAt(0))
  const blob = new Blob([decodedContent], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `output_step_${stepNumber}.txt`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
</script>
