<template>
  <v-card>
    <v-card-title>Suggestions d'amis</v-card-title>
    <v-card-text>
      <v-list>
        <v-list-item v-for="friend in friends" :key="friend.id">
          <v-list-item-content>{{ friend.username }}</v-list-item-content>
          <v-btn
            @click="sendFriendRequest(friend.id)"
            size="small"
            color="primary"
            class="ml-4 rounded"
            >Ajouter</v-btn
          >
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useFriendshipStore } from '@/stores/useFriendshipStore'

const friends = ref([])

const friendshipStore = useFriendshipStore()

const fetchFriendSuggestions = async () => {
  await friendshipStore.fetchFriendSuggestions()
  friends.value = friendshipStore.friendSuggestions
}

const sendFriendRequest = async (friendId: number) => {
  await friendshipStore.sendFriendRequest(friendId)
  await fetchFriendSuggestions()
}

onMounted(fetchFriendSuggestions)
</script>
