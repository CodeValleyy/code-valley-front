<template>
  <v-card>
    <v-btn icon @click="emit('close')" class="absolute top-0 right-0 mt-1 mr-2" color="red">
      <v-icon>mdi-close</v-icon>
    </v-btn>

    <v-card-title class="headline">Quoi de neuf ?!</v-card-title>
    <v-card-text>
      <v-textarea v-model="content" label="Écrire un post..." outlined></v-textarea>
      <v-file-input v-model="file" label="Joindre un fichier" outlined></v-file-input>
      <OutputExtensionSelector v-model="currentOutputExtension" />
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="blue" @click="postContent" size="large" class="mr-2" variant="tonal"
        >Poster</v-btn
      >
    </v-card-actions>
    <v-alert v-model="error" type="error" dismissible v-if="error">{{ error }}</v-alert>
  </v-card>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { usePostStore } from '@/stores/usePostStore'
import OutputExtensionSelector from '@/components/OutputExtensionSelector.vue'

const emit = defineEmits(['close', 'new-post'])

const content = ref('')
const file = ref(null)
const postStore = usePostStore()
const error = ref('')
const currentOutputExtension = ref('.txt')

const postContent = async () => {
  error.value = ''

  if (!content.value) {
    error.value = 'Le contenu du post ne peut pas être vide'
    return
  }

  try {
    await postStore.createPost(content.value, currentOutputExtension.value, file.value)
    if (postStore.error) {
      console.log('Error posting content:', postStore.error.message)
      error.value = postStore.error.message
      return
    }
    content.value = ''
    file.value = null
    emit('close')
    emit('new-post')
  } catch (error) {
    console.error('Error posting content:', error)
  }
}
</script>
