<script setup lang="ts">
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import Button from '@/components/Button.vue'
import CodeInput from '@/components/CodeInput.vue'
import { ref } from 'vue'

const name = '"Nom du site"'

const codeInput = ref('')

const runCode = () => {
  if (!codeInput || codeInput.value === '') return
  console.log(codeInput.value)
}
</script>

<template>
  <Header />
  <div class="min-h-screen h-full flex flex-col justify-between">
    <div class="w-full h-full pt-40 p-4 flex flex-col items-center mb-20">
      <div class="mb-4 text-2xl p-8 font-semibold">Page de code</div>
      {{ codeInput }}
      <div class="mt-6 flex justify-center w-11/12 items-center mb-2">
        <div class="w-7/12 flex justify-between items-end rounded text-primary mr-4">
          <div>Code :</div>
          <select class="rounded px-3 text-black bg-backgroundColor">
            <option value="js" default>JS</option>
            <option value="js">C++</option>
            <option value="js">Python</option>
            <option value="js">Lua</option>
          </select>
        </div>
        <div class="w-3/12 rounded flex items-end text-primary">Compilation :</div>
      </div>
      <div class="flex justify-center h-80 w-11/12 items-start">
        <CodeInput v-model="codeInput" />
        <div class="w-3/12 p-4 h-full rounded bg-gray-300">Compilating...</div>
      </div>
      <div class="flex justify-center w-11/12 items-start">
        <div class="w-7/12 flex justify-end mr-2 mt-2">
          <Button
            @click="runCode()"
            label="Run Code"
            color="primary"
            class="ml-44 w-fit self-end"
          />
        </div>
        <div class="w-3/12 p-4 h-full"></div>
      </div>
    </div>
    <Footer />
  </div>
</template>
