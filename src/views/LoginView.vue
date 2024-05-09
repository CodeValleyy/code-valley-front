<script setup lang="ts">
import axios from 'axios'
import { onMounted, ref } from 'vue'
import router from '@/router'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import Button from '@/components/Button.vue'

const email = ref('')
const password = ref('')
const errorMessage = ref('')

const apiBaseUrl = import.meta.env.VITE_APP_USER_MANAGEMENT_URL

const authUrl = ref('')

onMounted(async () => {
  try {
    const response = await axios.get(`${apiBaseUrl}/auth/google`, { withCredentials: true })
    authUrl.value = response.data.url
    console.log('Google auth URL:', authUrl.value)
  } catch (error) {
    console.error('Failed to fetch Google auth URL:', error)
  }
})

const login = async () => {
  try {
    const response = await axios.post(`${apiBaseUrl}/auth/login`, {
      email: email.value,
      password: password.value
    })
    router.push('/')
  } catch (error) {
    console.error('Login error:', error.response.data)
    errorMessage.value = error.response.data.message || 'Email or password is incorrect'
  }
}

const signInWithGoogle = () => {
  if (authUrl.value) {
    window.location.href = authUrl.value
  } else {
    console.error('No auth URL available')
  }
}
</script>
<template>
  <Header />
  <div class="min-h-screen h-full flex flex-col justify-between">
    <div class="w-full h-full text-xl pt-40 p-4 text-primary">
      <div class="container mx-auto">
        <div class="flex flex-col items-center">
          <h1 class="text-4xl font-bold text-primary">Se connecter</h1>
          <p class="text-lg text-center text-primary">Déjà inscrit? Connectez-vous</p>
          <div class="p-2">
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
            <div class="text-red-500 text-sm">{{ errorMessage }}</div>
            <div class="flex flex-col p-4">
              <Button :onClick="login" label="Se connecter" />
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
