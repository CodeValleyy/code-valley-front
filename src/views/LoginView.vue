<template>
  <v-container class="fill-height d-flex align-center justify-center">
    <v-row class="justify-center">
      <v-col cols="12" md="6" class="text-center">
        <h1 class="mb-6 text-4xl font-bold text-primary">Se connecter</h1>
        <p class="text-lg text-center text-primary mb-4">Déjà inscrit? Connectez-vous</p>
        <v-card class="pa-6">
          <v-form>
            <v-text-field
              v-if="!isOtpVisible"
              v-model="email"
              label="Email"
              outlined
              class="mb-4"
            ></v-text-field>
            <v-text-field
              v-if="!isOtpVisible"
              v-model="password"
              type="password"
              label="Password"
              outlined
              class="mb-4"
            ></v-text-field>
            <v-text-field
              v-if="isOtpVisible"
              v-model="otp"
              label="Code OTP"
              outlined
              class="mb-4"
            ></v-text-field>
            <div class="text-red-500 text-sm mb-4">{{ errorMessage }}</div>
            <v-btn
              color="primary"
              @click="isOtpVisible ? authenticateOtp() : login()"
              class="mb-4 mr-4"
            >
              Se connecter
            </v-btn>
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
import { onMounted, ref } from 'vue'
import router from '@/router'

const email = ref('')
const password = ref('')
const otp = ref('')
const errorMessage = ref('')

const apiBaseUrl = import.meta.env.VITE_APP_USER_MANAGEMENT_URL

const authUrl = ref('')
const isOtpVisible = ref(false)
let token = ref('')

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
    errorMessage.value = ''
    const response = await axios.post(`${apiBaseUrl}/auth/login`, {
      email: email.value,
      password: password.value
    })

    token.value = response.data.accessToken

    if (response.status === 202) {
      isOtpVisible.value = true
    } else {
      router.push(`/?token=${token.value}`)
    }
  } catch (error) {
    console.error('Login error:', error.response.data)
    errorMessage.value = error.response.data.message.toString() || 'Email or password is incorrect'
  }
}

const authenticateOtp = async () => {
  try {
    errorMessage.value = ''
    const response = await axios.post(
      `${apiBaseUrl}/auth/2fa/authenticate`,
      {
        twoFactorAuthenticationCode: otp.value
      },
      { headers: { Authorization: `Bearer ${token.value}` } }
    )
    token.value = response.data.accessToken
    router.push(`/?token=${token.value}`)
  } catch (error) {
    console.error('OTP authentication error:', error.response.data)
    errorMessage.value = error.response.data.message.toString() || 'Incorrect OTP'
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

<style scoped>
.min-h-screen {
  min-height: 100vh;
}
</style>
