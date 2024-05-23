<template>
  <v-container class="fill-height d-flex align-center justify-center">
    <v-row>
      <v-col cols="12" md="8" lg="10">
        <v-card class="pa-6 text-center">
          <LoadingSpinner v-if="loading" />
          <template v-else>
            <v-avatar size="100" class="mb-4">
              <img
                src="https://image.noelshack.com/fichiers/2024/21/4/1716483099-image-2024-05-23-185151555.jpg"
                alt="User Avatar"
              />
            </v-avatar>
            <h1 class="text-2xl font-bold mb-4">{{ userProfile.username }}</h1>
            <p class="text-lg mb-4">{{ userProfile.email }}</p>
            <p class="text-lg mb-4">
              Inscrit depuis le {{ new Date(userProfile.createdAt).toLocaleDateString('fr-FR') }}
            </p>
            <v-btn @click="showFriendsModal = true">Amis ({{ friendsCount }})</v-btn>

            <v-btn icon class="absolute top-3 right-3" @click="goToSettings">
              <v-icon>mdi-cog</v-icon>
            </v-btn>
            <v-btn icon class="absolute right-2" @click="handleLogout">
              <v-icon>mdi-logout</v-icon>
            </v-btn>
          </template>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="showFriendsModal" max-width="600">
      <FriendList @close="showFriendsModal = false" />
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue'
import { useAuth } from '@/composables/useAuth'
import router from '@/router'
import { useFriendshipStore } from '@/stores/useFriendshipStore'
import FriendList from '@/components/FriendList.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const { fetchMe, getToken, logout } = useAuth()
const friendsCount = ref(0)
const showFriendsModal = ref(false)
const loading = ref(true)

const friendshipStore = useFriendshipStore()

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
    logoutAndRedirect()
    return
  }

  try {
    const profile = await fetchMe()
    userProfile.value = profile
    await friendshipStore.fetchFriends()
    await friendshipStore.fetchFriendRequests()
    friendsCount.value = friendshipStore.friends.length
  } catch (error) {
    logoutAndRedirect()
    console.error('Error fetching profile:', error)
  } finally {
    loading.value = false
  }
})
const handleLogout = async () => {
  await logoutAndRedirect()
}

const logoutAndRedirect = async () => {
  await logout()
  await nextTick()
  router.push('/login')
}
</script>
<style scoped>
.min-h-screen {
  min-height: 100vh;
}
</style>
