<template>
  <v-container class="fill-height d-flex align-center justify-center">
    <v-row class="justify-center">
      <v-col cols="12" md="6">
        <v-card class="pa-6 text-center">
          <h1 class="text-2xl font-bold mb-4">Changer l'email</h1>
          <v-form @submit.prevent="changeEmail">
            <v-text-field
              v-model="newEmail"
              label="Nouvel email"
              type="email"
              outlined
              class="mb-4"
            ></v-text-field>
            <v-btn type="submit" color="primary">Changer l'email</v-btn>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import { useAuth } from '@/composables/useAuth'

const { getToken } = useAuth()

const newEmail = ref('')
const errorMessage = ref('')

const changeEmail = async () => {
  try {
    await axios.post(
      `${import.meta.env.VITE_APP_USER_MANAGEMENT_URL}/auth/change-email`,
      {
        email: newEmail.value
      },
      {
        headers: { Authorization: `Bearer ${getToken()}` }
      }
    )
  } catch (error) {
    console.error('Error changing email:', error.response.data)
    errorMessage.value = error.response.data.message
  }
}
</script>
