<script setup lang="ts">
import { ref } from 'vue'

const currentYear = ref(new Date().getFullYear())
</script>

<template>
  <div
    class="w-full pt-4 pb-1 px-4 flex flex-col items-center justify-between shadow-lg bg-primary bottom-0 text-white text-xl"
  >
    <div class="flex justify-around w-full mb-4">
      <RouterLink to="/" class="hover:underline">Accueil</RouterLink>
      <RouterLink to="/help" class="hover:underline">Aide</RouterLink>
      <div class="hover:underline">Autre lien</div>
    </div>
    <div class="flex items-center justify-center mb-4 text-sm space-x-2">
      <div class="mr-1"><a href="https://github.com/jabibamman" target="_blank">ABIB James</a></div>
      <div class="mr-1">
        <a href="https://github.com/chikatetsu" target="_blank">KIELT Ronan</a>
      </div>
      <div class="mr-1">
        <a href="https://github.com/carlito0605" target="_blank">CRETOIS Charles</a>
      </div>
    </div>
    <!-- Copyright -->
    <div class="text-sm">© {{ currentYear }} Tous droits réservés.</div>
  </div>
</template>
