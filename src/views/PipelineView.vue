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
                <strong>(Usage)</strong> you must use the following variables to read and write
                files:
                <ul>
                  <li>
                    For <strong>Python</strong>, <strong>Javascript</strong>,
                    <strong>Rust</strong> and <strong>Lua</strong>:
                    <code>(INPUT_PATH, OUTPUT_PATH)</code>
                  </li>
                </ul>
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
                    accept=".*"
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
                      @change="validateForm()"
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
              <v-btn color="info" @click="openMyPipelinesDialog" class="mr-2"> My Pipelines </v-btn>
              <v-btn :disabled="!formValid" color="warning" @click="openSaveDialog">
                Save Pipeline</v-btn
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
                        <v-chip
                          v-if="
                            result.output_file_content && result.output_file_content.length < 1000
                          "
                          color="primary"
                          class="mr-2"
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
                            @click="
                              downloadFile(
                                result.output_file_content,
                                result.stepNumber,
                                result.output_file_path
                              )
                            "
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
      <!-- Save Pipeline Dialog -->
      <v-dialog v-model="saveDialog" persistent max-width="600px">
        <v-card>
          <v-card-title>
            <span class="text-h5">Save Pipeline</span>
          </v-card-title>
          <v-card-text>
            <v-form ref="saveDialogForm">
              <v-text-field v-model="pipelineName" label="Pipeline Name" required></v-text-field>
              <v-text-field
                v-model="pipelineDescription"
                label="Pipeline Description"
                required
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-chip v-if="errorDialog" color="red">{{ errorDialog }}</v-chip>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" @click="closeSaveDialog">Cancel</v-btn>
            <v-btn color="blue darken-1" @click="saveDialogPipeline">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- Pipeline Dialog -->
      <v-dialog v-model="myPipelinesDialog" persistent max-width="800px">
        <v-card>
          <v-card-title>
            <span class="text-h5">My Pipelines</span>
          </v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item v-for="pipeline in myPipelines" :key="pipeline.id">
                <v-list-item-content @click="loadPipeline(pipeline)" class="cursor-pointer">
                  <v-list-item-title>{{ pipeline.name }}</v-list-item-title>
                  <v-list-item-subtitle>{{ pipeline.description }}</v-list-item-subtitle>
                </v-list-item-content>
                <v-spacer></v-spacer>
                <v-list-item-action>
                  <v-btn icon @click.stop="deletePipeline(pipeline.id)">
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" @click="closeMyPipelinesDialog">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue'
import type { StepResultDto } from '@/types/Pipeline'
import { getExtensionFromPath, getMimeType, languages } from '@/config/languagesConfig'
import { usePipeline } from '@/composables/usePipeline'
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
  pipelineName,
  pipelineDescription,
  saveDialog,
  openSaveDialog,
  closeSaveDialog,
  saveDialogPipeline,
  openMyPipelinesDialog,
  closeMyPipelinesDialog,
  myPipelinesDialog,
  myPipelines,
  errorDialog,
  error,
  fetchMyPipelines,
  loadPipeline,
  deletePipeline
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

  socket.on('pipelineError', (pipelineError: string) => {
    console.error('Pipeline execution error:', pipelineError)
    error.value = pipelineError
  })

  socket.on('pipelineSaved', (pipelineSaved: string) => {
    console.log('Pipeline saved:', pipelineSaved)
    fetchMyPipelines()
    closeSaveDialog()

    pipelineName.value = ''
    pipelineDescription.value = ''
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

const downloadFile = (base64Content: string, stepNumber: number, outputFilePath: string) => {
  const decodedContent = Uint8Array.from(atob(base64Content), (char) => char.charCodeAt(0))
  let finalOutputFileExtension = getExtensionFromPath(outputFilePath)
  console.log('Final output file extension:', finalOutputFileExtension)

  const blob = new Blob([decodedContent], {
    type: 'application/octet-stream'
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `output_step_${stepNumber}${finalOutputFileExtension}`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
</script>
