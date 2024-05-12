<script setup lang="ts">
import axios from 'axios'
import { ref } from 'vue'
import router from '@/router'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import Button from '@/components/Button.vue'

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

const signInWithGoogle = () => {}
</script>

<template>
  <Header />
  <div class="min-h-screen h-full flex flex-col justify-between">
    <div class="w-full h-full text-xl pt-40 p-4 text-primary">
      <div class="container mx-auto">
        <div class="flex flex-col items-center">
          <h1 class="text-4xl font-bold text-primary">S'inscrire</h1>
          <p class="text-lg text-center text-primary">Pour commencer, créer un compte</p>
          <div class="p-2">
            <div class="flex flex-col">
              <label for="username" class="text-primary">Nom d'utilisateur</label>
              <input
                type="text"
                id="username"
                v-model="username"
                class="border border-primary rounded"
              />
            </div>
            <div class="flex flex-col">
              <label for="email" class="text-primary">Email</label>
              <input
                type="email"
                id="email"
                v-model="email"
                class="border border-primary rounded"
              />
            </div>
            <div class="flex flex-col">
              <label for="password" class="text-primary">Password</label>
              <input
                type="password"
                id="password"
                v-model="password"
                class="border border-primary rounded"
              />
            </div>
            <div class="flex flex-col">
              <label for="confirmPassword" class="text-primary">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                v-model="confirmPassword"
                class="border border-primary rounded"
              />
            </div>
            <div class="text-red-500 text-sm">{{ errorMessage }}</div>
            <div class="flex flex-col p-4">
              <Button @click="register" label="Créer un compte" />
            </div>
            <div class="flex flex-col p-4">
              <Button @click="signInWithGoogle" label="Se connecter avec Google" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>
