<template>
  <v-card>
    <v-card-title class="headline">Mes Amis</v-card-title>
    <v-card-text>
      <LoadingSpinner v-if="loading" />
      <v-container v-else>
        <v-list>
          <v-list-item v-for="friend in friends" :key="friend.id">
            <v-list-item-content>
              <router-link :to="`/profile/${friend.username}`">{{ friend.username }}</router-link>
            </v-list-item-content>
            <v-btn icon @click="removeFriend(friend.id)" class="transparent-btn">
              <v-icon color="red">mdi-close</v-icon>
            </v-btn>
            <v-divider class="my-2 mx-4" :thickness="2" color="grey"></v-divider>
          </v-list-item>
        </v-list>
        <h2 class="headline mt-4">Demandes d'Amitié</h2>
        <v-list>
          <v-list-item v-for="friendRequest in friendRequests" :key="friendRequest.id">
            <v-list-item-content>
              <router-link :to="`/profile/${friendRequest.username}`">{{
                friendRequest.username
              }}</router-link>
            </v-list-item-content>
            <v-btn icon class="transparent-btn" @click="acceptFriendRequest(friendRequest.id)">
              <v-icon color="green">mdi-check</v-icon>
            </v-btn>
            <v-btn icon class="transparent-btn" @click="declineFriendRequest(friendRequest.id)">
              <v-icon color="red">mdi-close</v-icon>
            </v-btn>
          </v-list-item>
        </v-list>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-btn text @click="$emit('close')">Fermer</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useFriendshipStore } from '@/stores/useFriendshipStore'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const friendshipStore = useFriendshipStore()
const friends = ref([])
const friendRequests = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    await friendshipStore.fetchFriends()
    await friendshipStore.fetchFriendRequests()
    friends.value = friendshipStore.friends
    friendRequests.value = friendshipStore.friendRequests
  } finally {
    loading.value = false
  }
})

const removeFriend = async (friendId: number) => {
  await friendshipStore.removeFriend(friendId)
  friends.value = friendshipStore.friends
}

const acceptFriendRequest = async (requestId: number) => {
  await friendshipStore.acceptFriendRequest(requestId)
  friendRequests.value = friendshipStore.friendRequests
  friends.value = friendshipStore.friends
}

const declineFriendRequest = async (requestId: number) => {
  await friendshipStore.declineFriendRequest(requestId)
  friendRequests.value = friendshipStore.friendRequests
}
</script>

<style scoped>
.transparent-btn {
  background-color: transparent !important;
  box-shadow: none !important;
}
</style>
