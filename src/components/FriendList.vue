<template>
  <v-container>
    <v-row>
      <v-col>
        <h2>Mes Amis</h2>
        <v-list>
          <v-list-item v-for="friend in friends" :key="friend.id">
            <v-list-item-content>{{ friend.username }}</v-list-item-content>
            <v-btn color="red" @click="removeFriend(friend.id)">Supprimer</v-btn>
          </v-list-item>
        </v-list>
      </v-col>
      <v-col>
        <h2>Demandes d'Amitié</h2>
        <v-list>
          <v-list-item v-for="request in friendRequests" :key="request.id">
            <v-list-item-content>{{ request.sender.username }}</v-list-item-content>
            <v-btn color="green" @click="acceptFriendRequest(request.id)">Accepter</v-btn>
            <v-btn color="red" @click="declineFriendRequest(request.id)">Refuser</v-btn>
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useFriendshipStore } from '@/stores/useFriendshipStore'

const friendshipStore = useFriendshipStore()
const friends = ref([])
const friendRequests = ref([])

onMounted(async () => {
  await friendshipStore.fetchFriends()
  friends.value = friendshipStore.friends
  friendRequests.value = friendshipStore.friendRequests
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
