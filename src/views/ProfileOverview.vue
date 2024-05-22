<template>
  <v-container class="fill-height d-flex align-center justify-center">
    <v-row>
      <v-col cols="12" md="8" lg="10">
        <v-card class="pa-6 text-center">
          <v-avatar size="100" class="mb-4">
            <img src="https://via.placeholder.com/100" alt="User Avatar" />
          </v-avatar>
          <h1 class="text-2xl font-bold mb-4">{{ userProfile.username }}</h1>
          <p class="text-lg mb-4">{{ userProfile.email }}</p>
          <p class="text-lg mb-4">
            Inscrit depuis le {{ new Date(userProfile.createdAt).toLocaleDateString() }}
          </p>
          <v-btn color="primary" @click="logout">Se déconnecter</v-btn>
          <v-btn icon class="absolute top-0 right-0" @click="goToSettings">
            <v-icon>mdi-cog</v-icon>
          </v-btn>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useAuth } from '@/composables/useAuth'
import router from '@/router'

const { fetchProfile, getToken, resetToken } = useAuth()

const userProfile = ref({
  username: '',
  email: '',
  createdAt: ''
})

const goToSettings = () => {
  router.push('/profile/settings')
}

onMounted(async () => {
  if (!getToken()) {
    logout()
    return
  }

  try {
    const profile = await fetchProfile()
    userProfile.value = profile
  } catch (error) {
    logout()
    console.error('Error fetching profile:', error)
  }
})

const logout = () => {
  resetToken()
  router.push('/login')
}
</script>

<style scoped>
.min-h-screen {
  min-height: 100vh;
}
</style>
