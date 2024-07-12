<template>
  <v-card>
    <v-card-title>Suggestions d'amis</v-card-title>
    <v-card-text>
      <v-list>
        <v-list-item v-for="friend in friends" :key="friend.id">
          <router-link :to="`/profile/${friend.username}`">
            <v-list-item-avatar class="mr-4">
              <v-avatar>
                <img :src="getAvatar(friend)" alt="Avatar" />
              </v-avatar>
            </v-list-item-avatar>
            <v-list-item-content>{{ friend.username }}</v-list-item-content>
          </router-link>
          <v-btn
            @click="sendFriendRequest(friend.id)"
            size="small"
            color="primary"
            class="ml-4 rounded"
            >Ajouter</v-btn
          >
        </v-list-item>
      </v-list>
      <div>
        <v-btn @click="previousPage" :disabled="offset === 0" class="mr-2">Précédent</v-btn>
        <v-btn @click="nextPage" :disabled="friends.length < limit">Suivant</v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useFriendshipStore } from '@/stores/useFriendshipStore'
import type { UserFriend } from '@/types/FriendshipTypes'
import { DEFAULT_AVATAR } from '@/config/constants'

const friends = ref([] as UserFriend[])
const limit = ref(5)
const offset = ref(0)

const friendshipStore = useFriendshipStore()

const fetchFriendSuggestions = async () => {
  await friendshipStore.fetchFriendSuggestions(limit.value, offset.value)
  friends.value = friendshipStore.friendSuggestions
}

const sendFriendRequest = async (friendId: number) => {
  await friendshipStore.sendFriendRequest(friendId)
  await fetchFriendSuggestions()
}

const nextPage = () => {
  offset.value += limit.value
  fetchFriendSuggestions()
}

const previousPage = () => {
  if (offset.value > 0) {
    offset.value -= limit.value
    fetchFriendSuggestions()
  }
}

const getAvatar = (friend: UserFriend) => {
  return DEFAULT_AVATAR
}

onMounted(fetchFriendSuggestions)
</script>
