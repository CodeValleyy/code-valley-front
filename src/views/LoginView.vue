<template>
  <v-container class="fill-height d-flex align-center justify-center">
    <v-row class="justify-center">
      <v-col cols="12" md="6" class="text-center">
        <h1 class="mb-6 text-4xl font-bold text-primary">Se connecter</h1>
        <v-divider class="mb-6"></v-divider>
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
            <div class="text-green-500 text-sm mb-4">{{ successMessage }}</div>
            <v-btn
              color="primary"
              @click="isOtpVisible ? authenticateOtp() : login()"
              class="mb-4 mr-4"
            >
              Se connecter
            </v-btn>
            <v-divider class="my-4"></v-divider>
            <p class="text-sm mb-4">Ou connectez-vous avec</p>
            <div class="d-flex justify-center mb-4">
              <v-btn icon @click="signInWithGoogle" class="mx-2">
                <v-icon left>mdi-google</v-icon>
              </v-btn>

              <v-btn icon @click="signInWithMicrosoft" class="mx-2">
                <v-icon left>mdi-microsoft</v-icon>
              </v-btn>

              <v-btn icon class="mx-2">
                <v-icon left>mdi-apple</v-icon>
              </v-btn>
            </div>
          </v-form>
          <p class="text-sm text-center text-primary mb-4">
            Vous n'avez pas de compte ?
            <router-link to="/register" class="text-secondary underline">
              Inscrivez-vous
            </router-link>
          </p>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import axios from 'axios'
import { onMounted, ref, nextTick } from 'vue'
import router from '@/router'
import { useAuth } from '@/composables/useAuth'
import type { AxiosError } from 'axios'
import axiosInstance from '@/config/axiosInstance'

const { setToken, getGoogleAuthUrl } = useAuth()

const email = ref('')
const password = ref('')
const otp = ref('')
const errorMessage = ref('')
const successMessage = ref('')
const googleAuthUrl = ref('')
const microsoftAuthUrl = ref('')
const isOtpVisible = ref(false)
let token = ref('')

onMounted(async () => {
  const info = router.currentRoute.value.query.info
  if (info === 'login_needed') {
    successMessage.value = 'Inscription réussie. Connectez-vous pour continuer.'
  }
  try {
    const googleResponse = await getGoogleAuthUrl()
    googleAuthUrl.value = googleResponse.url
  } catch (error) {
    console.error('Failed to fetch auth URLs:', error)
    errorMessage.value = 'Failed to fetch auth URLs'
  }
})

const login = async () => {
  try {
    errorMessage.value = ''
    successMessage.value = ''
    const response = await axiosInstance.post('/auth/login', {
      email: email.value,
      password: password.value
    })

    token.value = response.data.accessToken

    if (response.status === 202) {
      isOtpVisible.value = true
      return
    }

    setToken(token.value)
    await nextTick()
    router.push(`/?token=${token.value}`)
  } catch (error) {
    const axiosError = error as AxiosError
    if (axiosError.response) {
      console.error('Login error:', axiosError.response.data)
      errorMessage.value =
        (axiosError.response.data as { message: string }).message ||
        'Email or password is incorrect'
    } else {
      console.error('Login error:', error)
      errorMessage.value = 'An unexpected error occurred'
    }
  } finally {
    password.value = ''
  }
}

const authenticateOtp = async () => {
  try {
    errorMessage.value = ''
    successMessage.value = ''
    const response = await axiosInstance.post(
      '/auth/2fa/authenticate',
      {
        twoFactorAuthenticationCode: otp.value
      },
      { headers: { Authorization: `Bearer ${token.value}` } }
    )
    token.value = response.data.accessToken
    setToken(token.value)
    router.push(`/?token=${token.value}`)
  } catch (error) {
    const axiosError = error as AxiosError
    if (axiosError.response) {
      console.error('OTP authentication error:', axiosError.response.data)
      errorMessage.value =
        (axiosError.response.data as { message: string }).message || 'Incorrect OTP'
    } else {
      console.error('OTP authentication error:', error)
      errorMessage.value = 'An unexpected error occurred'
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

const signInWithMicrosoft = () => {
  if (microsoftAuthUrl.value) {
    window.location.href = microsoftAuthUrl.value
  } else {
    console.error('No Microsoft auth URL available')
    errorMessage.value = 'Microsoft auth is not available'
  }
}
</script>

<style scoped>
.min-h-screen {
  min-height: 100vh;
}
</style>
