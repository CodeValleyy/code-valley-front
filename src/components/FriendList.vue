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
        <h2 class="headline mt-4">Demandes Envoyées</h2>
        <v-list>
          <v-list-item v-for="sentRequest in sentFriendRequests" :key="sentRequest.id">
            <v-list-item-content>
              <router-link :to="`/profile/${sentRequest.username}`">{{
                sentRequest.username
              }}</router-link>
            </v-list-item-content>
            <v-btn icon class="transparent-btn" @click="removeSentRequest(sentRequest.id)">
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
import { ref, onMounted, watch } from 'vue'

import { useFriendshipStore } from '@/stores/useFriendshipStore'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const emit = defineEmits(['close'])
const friendshipStore = useFriendshipStore()
const friends = ref([])
const friendRequests = ref([])
const sentFriendRequests = ref([])
const loading = ref(true)

const updateLists = () => {
  friends.value = friendshipStore.friends
  friendRequests.value = friendshipStore.friendRequests
  sentFriendRequests.value = friendshipStore.sentFriendRequests
}

onMounted(async () => {
  try {
    await friendshipStore.fetchFriends()
    await friendshipStore.fetchFriendRequests()
    await friendshipStore.fetchSentFriendRequests()
    updateLists()
  } finally {
    loading.value = false
  }
})

watch(
  () => [
    friendshipStore.friends,
    friendshipStore.friendRequests,
    friendshipStore.sentFriendRequests
  ],
  updateLists,
  { deep: true }
)

const removeFriend = async (friendId: number) => {
  await friendshipStore.removeFriend(friendId)
  updateLists()
  emit('close')
}

const acceptFriendRequest = async (requestId: number) => {
  await friendshipStore.acceptFriendRequest(requestId)
  updateLists()
  emit('close')
}

const declineFriendRequest = async (requestId: number) => {
  await friendshipStore.declineFriendRequest(requestId)
  updateLists()
  emit('close')
}

const removeSentRequest = async (requestId: number) => {
  await friendshipStore.cancelSentRequest(requestId)
  await updateLists()
  emit('close')
}
</script>

<style scoped>
.transparent-btn {
  background-color: transparent !important;
  box-shadow: none !important;
}
</style>
