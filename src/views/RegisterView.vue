<template>
  <v-container class="fill-height d-flex align-center justify-center">
    <v-row class="justify-center">
      <v-col cols="12" md="6" class="text-center">
        <h1 class="mb-6 text-4xl font-bold text-primary">S'inscrire</h1>
        <p class="text-lg text-center text-primary mb-4">Pour commencer, créer un compte</p>
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
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import axios from 'axios'
import { ref } from 'vue'
import router from '@/router'

const email = ref('')
const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const errorMessage = ref('')

const apiBaseUrl = import.meta.env.VITE_APP_USER_MANAGEMENT_URL

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
    console.log('Registered:', response.data)
    router.push('/')
  } catch (error) {
    console.error('Registration error:', error.response.data)
    errorMessage.value = error.response.data.message.toString() || 'Problème lors de l’inscription'
  }
}

const signInWithGoogle = () => {
  // TODO : Logique de connexion avec Google
}
</script>

<style scoped>
.min-h-screen {
  min-height: 100vh;
}
</style>
