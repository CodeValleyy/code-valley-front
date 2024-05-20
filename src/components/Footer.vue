<template>
  <v-footer app inset class="py-0 px-4 border-t border-gray-200 bg-primary">
    <v-container>
      <v-row justify="center" class="flex-wrap">
        <v-col class="text-center py-1" cols="12" sm="auto">
          <div class="flex justify-center space-x-2 mb-2 text-sm flex-wrap">
            <v-btn text href="#" class="text-white bg-transparent px-2 py-1">Terms</v-btn>
            <v-btn text href="#" class="text-white bg-transparent px-2 py-1">Privacy</v-btn>
            <v-btn text href="#" class="text-white bg-transparent px-2 py-1">Security</v-btn>
            <v-btn text href="#" class="text-white bg-transparent px-2 py-1">Status</v-btn>
            <v-btn text href="#" class="text-white bg-transparent px-2 py-1">Docs</v-btn>
            <v-btn text href="#" class="text-white bg-transparent px-2 py-1">Contact</v-btn>
            <v-btn text href="#" class="text-white bg-transparent px-2 py-1">Manage cookies</v-btn>
            <v-btn text href="#" class="text-white bg-transparent px-2 py-1"
              >Do not share my personal information</v-btn
            >
          </div>
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
