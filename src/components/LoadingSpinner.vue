<template>
  <v-container class="d-flex justify-center align-center" style="height: 100%">
    <v-btn disabled icon>
      <v-icon class="mdi-spin">mdi-loading</v-icon>
    </v-btn>
  </v-container>
</template>

<script setup lang="ts">
import { VContainer, VBtn, VIcon } from 'vuetify/components'
</script>

<style scoped>
.v-btn {
  display: inline-flex;
  align-items: center;
}
.v-icon {
  width: 1.5em;
  height: 1.5em;
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
