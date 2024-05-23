<template>
  <v-card>
    <v-card-title>Quoi de neuf ?</v-card-title>
    <v-card-text>
      <v-textarea v-model="content" label="Écrire un post..." outlined></v-textarea>
    </v-card-text>
    <v-card-actions>
      <v-btn color="primary" @click="postContent">Poster</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import { useAuth } from '@/composables/useAuth'
import { defineEmits } from 'vue'

const { getToken } = useAuth()
const content = ref('')

const postContent = async () => {
  if (!content.value) return

  try {
    await axios.post(
      `${import.meta.env.VITE_APP_USER_MANAGEMENT_URL}/posts`,
      { content: content.value },
      {
        headers: { Authorization: `Bearer ${getToken()}` }
      }
    )
    content.value = ''

    defineEmits(['new-post'])
  } catch (error) {
    console.error('Error posting content:', error)
  }
}
</script>
