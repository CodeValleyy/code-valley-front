<template>
  <v-container class="fill-height d-flex align-center justify-center">
    <v-row class="justify-center">
      <v-col cols="12" md="6" class="text-center">
        <h1 class="mb-8 text-4xl font-bold text-primary">Bienvenue sur Code Valley</h1>

        <v-card class="pa-6">
          <v-form>
            <v-text-field
              v-model="username"
              label="Nom d'utilisateur"
              outlined
              class="mb-4"
            ></v-text-field>
            <v-text-field
              v-model="email"
              label="Email"
              type="email"
              outlined
              class="mb-4"
            ></v-text-field>
            <v-text-field
              v-model="password"
              type="password"
              label="Password"
              outlined
              class="mb-4"
            ></v-text-field>
            <v-text-field
              v-model="confirmPassword"
              type="password"
              label="Confirm Password"
              outlined
              class="mb-4"
            ></v-text-field>
            <div class="text-red-500 text-sm mb-4">{{ errorMessage }}</div>
            <v-btn color="primary" @click="register" class="mb-4 mr-4">Créer un compte</v-btn>
            <v-btn color="secondary" @click="signInWithGoogle" class="mb-4">
              Se connecter avec Google
            </v-btn>
          </v-form>
          <p class="text-lg text-center text-primary mb-4">
            Déjà inscris ?
            <router-link to="/login" class="text-secondary underline">Connectez-vous</router-link>
          </p>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import axios from 'axios'
import { onMounted, ref } from 'vue'
import router from '@/router'
import { useAuth } from '@/composables/useAuth'
import type { AxiosError } from 'axios'

const { getGoogleAuthUrl } = useAuth()
const email = ref('')
const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const errorMessage = ref('')
const googleAuthUrl = ref('')

const apiBaseUrl = import.meta.env.VITE_APP_USER_MANAGEMENT_URL

onMounted(async () => {
  try {
    const googleResponse = await getGoogleAuthUrl()
    googleAuthUrl.value = googleResponse.url
  } catch (error) {
    console.error('Failed to fetch auth URLs:', error)
    errorMessage.value = 'Failed to fetch auth URLs'
  }
})

const register = async () => {
  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Les mots de passe ne correspondent pas'
    return
  }

  try {
    const response = await axios.post(`${apiBaseUrl}/auth/register`, {
      email: email.value,
      username: username.value,
      password: password.value
    })
    router.push('/?token=' + response.data.accessToken)
  } catch (error) {
    const axiosError = error as AxiosError

    if (axiosError.response?.status === 409) {
      errorMessage.value = 'Cet email est déjà utilisé'
      return
    }

    if (axiosError.response?.status === 400) {
      errorMessage.value = 'Veuillez remplir tous les champs'
      return
    }

    if (axiosError.response?.status === 500) {
      errorMessage.value = 'Problème lors de l’inscription'
      return
    }

    if (axiosError.response) {
      errorMessage.value = (axiosError.response.data as { message: string }).message || 'Une erreur inattendue est survenue'
      return
    }
  }
}

const signInWithGoogle = () => {
  if (googleAuthUrl.value) {
    window.location.href = googleAuthUrl.value
  } else {
    console.error('No Google auth URL available')
    errorMessage.value = 'Google auth is not available'
  }
}
</script>

<style scoped>
.min-h-screen {
  min-height: 100vh;
}
</style>
