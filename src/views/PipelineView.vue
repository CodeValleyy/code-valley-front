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
                <strong>Step:</strong> Each step in the pipeline consists of a code snippet in a specific language.
              </li>
              <li>
                <strong>Output:</strong> The output of each step is passed as the input to the next step.
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
                  <li>For <strong>Python</strong>, <strong>Javascript</strong> and <strong>Lua</strong>: <code>(input_data, output_path)</code></li>
                  <li>For <strong>result</strong>: <code>(INPUT_PATH, OUTPUT_PATH)</code></li>
                </ul>
                variables for JS, PY et LUA as in the example below.
              </li>
            </ul>
          </v-card-text>
          <v-card-text>
            <v ref="form" @submit.prevent="submitPipeline">
              <v-row class="mb-4">
                <v-col cols="12">
                  <v-file-input
                    label="Initial Input File"
                    v-model="initialInput.file"
                    @change="handleFileChange"
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
                      :items="languages"
                      label="Language"
                      v-model="step.payload.language"
                      :rules="[rules.required]"
                      @change="validateForm"
                      required
                    ></v-select>
                  </v-col>
                  <v-col cols="12">
                    <v-select
                      :items="snippets"
                      item-title="filename"
                      item-value="code"
                      label="Snippets"
                      v-model="step.payload.code"
                      :rules="[rules.required]"
                      @change="validateForm"
                    >
                    </v-select>
                  </v-col>
                </v-row>
              </v-container>

              <v-btn :disabled="!formValid" @click="addStep" color="primary" class="mr-2">
                Add Step
              </v-btn>
              <v-btn :disabled="!formValid" type="submit" @click="submitPipeline" color="success">Execute Pipeline</v-btn>
            </v>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12">
        <v-card>
          <v-card-title class="text-h5">Pipeline Results</v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item v-for="result in results" :key="result.stepNumber">
                <v-list-item-content>
                  <v-list-item-title>Step {{ result.stepNumber }}</v-list-item-title>
                  <v-list-item-subtitle>
                    <div v-if="result.error" class="text-red-500">{{ result.error }}</div>
                    <div v-else>
                      <div v-if="result.output">Output: {{ result.output }}</div>
                      <div v-if="result.output_file_content">Output File Content: {{ decodeBase64(result.output_file_content) }}</div>
                      <v-btn v-if="result.output_file_content" @click="downloadFile(result.output_file_content, result.stepNumber)" color="primary">Download Output File</v-btn>
                    </div>
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
import type { BufferData } from '@/types/buffer';

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
  rules
} = usePipeline()

watch(() => steps.steps, validateForm, { deep: true })
watch(initialInput, validateForm, { deep: true })

onMounted(() => {
  socket.on('pipelineUpdate', (update: StepResultDto) => {
    results.value.push(update)
  })

  socket.on('pipelineResult', (result: string) => {
    console.log('Pipeline execution completed:', result)
  })

  socket.on('pipelineError', (error: string) => {
    console.error('Pipeline execution error:', error)
  })
})

const handleFileChange = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (file) {
    const arrayBuffer = await file.arrayBuffer();
    const bufferData: BufferData = {
      bufferInput: {
        data: Array.from(new Uint8Array(arrayBuffer))
      }
    };

    initialInput.file = bufferData;
    validateForm();
  } else {
    console.error('The selected input is not a file or is not a valid Blob.');
  }
};

const decodeBase64 = (base64Content: string) => {
  try {
    return atob(base64Content);
  } catch (error) {
    console.error('Error decoding base64 content:', error);
    return '';
  }
};

const downloadFile = (base64Content: string, stepNumber: number) => {
  const decodedContent = atob(base64Content);
  const blob = new Blob([decodedContent], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `output_step_${stepNumber}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
</script>
