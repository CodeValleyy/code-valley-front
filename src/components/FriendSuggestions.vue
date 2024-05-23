<template>
  <v-card>
    <v-card-title>Suggestions d'amis</v-card-title>
    <v-card-text>
      <v-list>
        <v-list-item v-for="friend in friends" :key="friend.id">
          <v-list-item-content>{{ friend.username }}</v-list-item-content>
          <v-btn @click="sendFriendRequest(friend.id)" color="primary">Ajouter</v-btn>
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useAuth } from '@/composables/useAuth'

const { getToken } = useAuth()
const friends = ref([])

const fetchFriendSuggestions = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_APP_USER_MANAGEMENT_URL}/friendships/suggestions`,
      {
        headers: { Authorization: `Bearer ${getToken()}` }
      }
    )
    friends.value = response.data
  } catch (error) {
    console.error('Error fetching friend suggestions:', error)
  }
}

const sendFriendRequest = async (friendId: number) => {
  try {
    await axios.post(
      `${import.meta.env.VITE_APP_USER_MANAGEMENT_URL}/friendships/send/${friendId}`,
      {},
      {
        headers: { Authorization: `Bearer ${getToken()}` }
      }
    )
  } catch (error) {
    console.error('Error sending friend request:', error)
  }
}

onMounted(fetchFriendSuggestions)
</script>
