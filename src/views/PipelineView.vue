<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="text-h5">Pipeline Orchestrator</v-card-title>
          <v-card-text>
            <v-form ref="form" @submit.prevent="submitPipeline">
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
                    <v-text-field
                      label="Additional Input"
                      v-model="step.payload.input"
                      @input="validateForm"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <CodeMirror
                      v-model="step.payload.code"
                      basic
                      :extensions="[getLangExtension(step.payload.language)]"
                      @update="validateForm"
                      height="300px"
                      class="mb-4"
                    />
                  </v-col>
                </v-row>
              </v-container>
              <v-btn :disabled="!formValid" @click="addStep" color="primary" class="mr-2"
                >Add Step</v-btn
              >
              <v-btn :disabled="!formValid" type="submit" color="success">Execute Pipeline</v-btn>
            </v-form>
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
                    <div v-else>{{ result.output }}</div>
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
import { ref, reactive, onMounted, watch } from 'vue'
import { io } from 'socket.io-client'
import type { CreatePipelineDto, StepResultDto } from '@/types/Pipeline'
import { languages } from '@/config/languagesConfig'
import { python } from '@codemirror/lang-python'
import { rust } from '@codemirror/lang-rust'
import { javascript } from '@codemirror/lang-javascript'
import CodeMirror from 'vue-codemirror6'

const form = ref()
const formValid = ref(false)

const steps = reactive<CreatePipelineDto>({
  steps: [
    { service: 'dyno-code', endpoint: 'execute', payload: { code: '', language: languages[0] } }
  ]
})
const results = ref<StepResultDto[]>([])
const socket = io('ws://pipeline-orchestrator.code-valley.xyz')

const rules = {
  required: (v: any) => !!v || 'Field is required'
}

const addStep = () => {
  if (form.value && form.value.validate()) {
    steps.steps.push({
      service: 'dyno-code',
      endpoint: 'execute',
      payload: { code: '', language: languages[0], input: '' }
    })
  }
}

const submitPipeline = () => {
  if (form.value && form.value.validate()) {
    socket.emit('executePipeline', steps)
  }
}

const getLangExtension = (language: string) => {
  switch (language) {
    case 'python':
      return python()
    case 'rust':
      return rust()
    case 'javascript':
      return javascript()
    default:
      return python()
  }
}

const validateForm = () => {
  formValid.value = steps.steps.every((step) => step.payload.language && step.payload.code)
}

watch(() => steps.steps, validateForm, { deep: true })

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
</script>

<style scoped>
@import 'tailwindcss/tailwind.css';
</style>
