<script setup lang="ts">
import Header from '@/components/Header.vue'

const name = 'Exemple pour les bouffons'
</script>

<template>
  <Header />
  <div class="w-full h-full text-4xl p-4 text-primary">
    Ceci est un test pour vous montrer : {{ name }}
  </div>
</template>
