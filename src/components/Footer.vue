<template>
  <v-footer app inset class="py-0 px-4 border-t border-gray-200 bg-primaryTailwind">
    <v-container>
      <v-row justify="center" class="flex-wrap">
        <v-col class="text-center py-1" cols="12" sm="auto">
          <div class="text-sm text-white">© {{ currentYear }} Tous droits réservés.</div>
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const currentYear = ref(new Date().getFullYear())
</script>

<style scoped>
.v-footer {
  background-color: var(--v-primary-base);
}
</style>
