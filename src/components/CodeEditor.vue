<template>
  <div class="code-editor">
    <div class="language-selector">
      <select v-model="currentLanguage" @change="changeLanguage">
        <option v-for="language in languages" :key="language[0]" :value="language[0]">
          {{ language[1] }}
        </option>
      </select>
    </div>
    <code-mirror
      v-model="codeInput"
      :lang="lang"
      @keydown.tab.prevent.stop="tab"
      @keydown.shift.tab.prevent.stop="tab"
      @keydown.ctrl.s.prevent.stop="runCode"
    />
    <button @click="runCode">Run Code</button>
  </div>
  
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import CodeMirror from 'vue-codemirror6';
import { useCodeRunner } from '@/composables/useCodeRunner'
import { python } from '@codemirror/lang-python';
import { rust } from '@codemirror/lang-rust';
import { javascript } from '@codemirror/lang-javascript';

const { codeInput, result, isLoading, error, runCode, currentLanguage, languages } = useCodeRunner()
const tab = () => {}
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
