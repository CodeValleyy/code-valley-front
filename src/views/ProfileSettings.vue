<template>
  <v-container class="fill-height d-flex align-center justify-center">
    <v-row>
      <v-col cols="12" sm="10" md="8" lg="10 ">
        <v-card class="pa-6 text-center relative">
          <v-btn icon @click="goBack" class="absolute top-4 left-4 text-primary">
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
          <h1 class="text-2xl font-bold mb-4">Paramètres du Profil</h1>
          <router-link to="/profile/settings/change-password">
            <v-btn class="mb-4" block>Changer le mot de passe</v-btn>
          </router-link>
          <router-link to="/profile/settings/change-email">
            <v-btn class="mb-4" block>Changer l'email</v-btn>
          </router-link>
          <v-btn @click="toggle2FA" :color="isTwoFactorEnabled ? 'red' : 'green'" block>
            {{ isTwoFactorEnabled ? 'Désactiver' : 'Activer' }}
            l'authentification à deux facteurs (2FA)
          </v-btn>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="showQrCodeModal" max-width="400" @update:modelValue="handleModalClose">
      <v-card>
        <v-card-title class="headline">Scan QR Code</v-card-title>
        <v-card-text>
          <p>Utilisez votre application d'authentification pour scanner le QR code ci-dessous :</p>
          <v-img :src="qrCodeUrl" aspect-ratio="1"></v-img>
          <v-text-field v-model="otpCode" label="Code OTP" outlined class="mt-4"></v-text-field>
          <v-btn color="primary" @click="authenticate2FA" class="mt-2">Vérifier le Code</v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useUserStore } from '@/stores/userStore'
import { useTwoFactorAuth } from '@/composables/useTwoFactorAuth'
import router from '@/router'

const { getToken, resetToken } = useAuth()
const userStore = useUserStore()

const {
  showQrCodeModal,
  qrCodeUrl,
  otpCode,
  isTwoFactorEnabled,
  toggle2FA,
  authenticate2FA,
  handleModalClose
} = useTwoFactorAuth()

onMounted(async () => {
  const token = getToken()
  if (!token) {
    logout()
    return
  }

  try {
    await userStore.fetchUserProfile(token)
    console.log('Profile:', userStore.user.isTwoFactorAuthenticationEnabled)
  } catch (error) {
    console.error('Error fetching profile:', error)
  }
})

const logout = () => {
  resetToken()
  router.push('/login')
}

const goBack = () => {
  router.back()
}
</script>

<style scoped>
.text-primary {
  color: #1976d2;
}
.relative {
  position: relative;
}
.absolute {
  position: absolute;
}
.top-4 {
  top: 1em;
}
.left-4 {
  left: 1em;
}
</style>
