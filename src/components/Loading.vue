<template>
  <v-btn
    disabled
    class="text-primary focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 inline-flex items-center"
  >
    <v-icon class="inline w-6 h-6 me-3 animate-spin" aria-hidden="true" role="status">
      mdi-loading
    </v-icon>
    <div class="text-xl">Compilation...</div>
  </v-btn>
</template>

<script setup lang="ts">
import { VBtn, VIcon } from 'vuetify/components'
</script>

<style scoped>
.v-btn {
  display: inline-flex;
  align-items: center;
}
.v-icon {
  width: 1.5em;
  height: 1.5em;
  margin-right: 0.75rem;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
