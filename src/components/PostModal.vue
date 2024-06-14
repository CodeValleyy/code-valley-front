<template>
  <v-card>
    <v-card-title class="headline">Quoi de neuf ?!</v-card-title>
    <v-card-text>
      <v-textarea v-model="content" label="Écrire un post..." outlined></v-textarea>
      <v-file-input v-model="file" label="Joindre un fichier" outlined></v-file-input>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="blue" @click="postContent">Poster</v-btn>
    </v-card-actions>
  </v-card>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import { useAuth } from '@/composables/useAuth'
import { usePostStore } from '@/stores/usePostStore'

const emit = defineEmits(['close', 'new-post'])

const { getToken } = useAuth()
const content = ref('')
const file = ref(null)
const postStore = usePostStore()

const postContent = async () => {
  if (!content.value) return

  try {
    await postStore.createPost(content.value, file.value)
    content.value = ''
    file.value = null
    emit('close')
    emit('new-post')
  } catch (error) {
    console.error('Error posting content:', error)
  }
}
</script>
