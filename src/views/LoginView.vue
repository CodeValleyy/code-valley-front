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

const { setToken } = useAuth()

const email = ref('')
const password = ref('')
const otp = ref('')
const errorMessage = ref('')

const apiBaseUrl = import.meta.env.VITE_APP_USER_MANAGEMENT_URL

const googleAuthUrl = ref('')
const microsoftAuthUrl = ref('')
const isOtpVisible = ref(false)
let token = ref('')

onMounted(async () => {
  try {
    const googleResponse = await axios.get(`${apiBaseUrl}/auth/google`, { withCredentials: true })
    googleAuthUrl.value = googleResponse.data.url

    console.log('Google auth URL:', googleAuthUrl.value)
  } catch (error) {
    console.error('Failed to fetch auth URLs:', error)
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
      return
    }

    setToken(token.value)
    await nextTick()
    router.push(`/?token=${token.value}`)
  } catch (error) {
    console.error('Login error:', error.response.data)
    errorMessage.value = error.response.data.message.toString() || 'Email or password is incorrect'
  } finally {
    password.value = ''
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
    setToken(token.value)
    router.push(`/?token=${token.value}`)
  } catch (error) {
    console.error('OTP authentication error:', error.response.data)
    errorMessage.value = error.response.data.message.toString() || 'Incorrect OTP'
  }
}

const signInWithGoogle = () => {
  if (googleAuthUrl.value) {
    window.location.href = googleAuthUrl.value
  } else {
    console.error('No Google auth URL available')
  }
}

const signInWithMicrosoft = () => {
  if (microsoftAuthUrl.value) {
    window.location.href = microsoftAuthUrl.value
  } else {
    console.error('No Microsoft auth URL available')
  }
}
</script>

<style scoped>
.min-h-screen {
  min-height: 100vh;
}
</style>
