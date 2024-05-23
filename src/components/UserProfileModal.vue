<template>
  <v-card>
    <v-card-title class="headline">Profil</v-card-title>
    <v-card-text class="text-center">
      <v-avatar size="100">
        <v-img :src="userAvatar" alt="User Avatar" />
      </v-avatar>
      <h2>{{ username }}</h2>
      <v-btn @click="logoutUser" color="red" class="mt-4">Déconnexion</v-btn>
    </v-card-text>
  </v-card>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useRouter } from 'vue-router'

const emit = defineEmits(['close'])

const { getToken, logout, fetchMe } = useAuth()
const router = useRouter()
const userAvatar = ref('https://via.placeholder.com/50')
const username = ref('')

const fetchUserProfile = async () => {
  try {
    const user = await fetchMe()
    username.value = user.username
    userAvatar.value = user.avatar || 'https://via.placeholder.com/50'
  } catch (error) {
    console.error('Error fetching user profile:', error)
  }
}

onMounted(() => {
  if (getToken()) {
    fetchUserProfile()
  }
})

const logoutUser = async () => {
  try {
    await logout()
    emit('close')
    router.push('/login')
  } catch (error) {
    console.error('Error logging out:', error)
  }
}
</script>
