<template>
  <v-container class="fill-height d-flex align-center justify-center">
    <v-row class="justify-center">
      <v-col cols="12" md="6">
        <v-card class="pa-6 text-center">
          <h1 class="text-2xl font-bold mb-4">Changer le mot de passe</h1>
          <v-form @submit.prevent="changePassword">
            <v-text-field
              v-model="currentPassword"
              label="Mot de passe actuel"
              type="password"
              outlined
              class="mb-4"
            ></v-text-field>
            <v-text-field
              v-model="newPassword"
              label="Nouveau mot de passe"
              type="password"
              outlined
              class="mb-4"
            ></v-text-field>
            <v-text-field
              v-model="confirmPassword"
              label="Confirmer le mot de passe"
              type="password"
              outlined
              class="mb-4"
            ></v-text-field>
            <v-btn type="submit" color="primary">Changer le mot de passe</v-btn>
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
import type { AxiosError } from 'node_modules/axios/index.cjs';

const { getToken } = useAuth()

const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const errorMessage = ref('')

const changePassword = async () => {
  if (newPassword.value !== confirmPassword.value) {
    errorMessage.value = 'Les mots de passe ne correspondent pas'
    return
  }

  try {
    await axios.post(
      `${import.meta.env.VITE_APP_USER_MANAGEMENT_URL}/auth/change-password`,
      {
        currentPassword: currentPassword.value,
        newPassword: newPassword.value
      },
      {
        headers: { Authorization: `Bearer ${getToken()}` }
      }
    )
  } catch (error) {
    const axiosError = error as AxiosError
    if (axiosError.response?.status === 401) {
      errorMessage.value = 'Mot de passe actuel incorrect'
      return
    }

    if (axiosError.response?.status === 400) {
      errorMessage.value = 'Le nouveau mot de passe doit être différent de l\'ancien'
      return
    }

    if (axiosError.response?.status === 409) {
      errorMessage.value = 'Le mot de passe actuel est incorrect'
      return
    }

    if (axiosError.response?.status === 422) {
      errorMessage.value = 'Le mot de passe doit contenir au moins 8 caractères'
      return
    }

    console.error('Error changing password:', axiosError.response?.data)
    errorMessage.value = (axiosError.response?.data as { message: string })?.message;
  }
}
</script>
