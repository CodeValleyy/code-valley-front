<template>
  <v-card>
    <v-card-title class="headline">{{ title }}</v-card-title>
    <v-card-text>
      <LoadingSpinner v-if="loading" />
      <v-container v-else>
        <v-list>
          <v-list-item v-for="friend in displayList" :key="friend.id">
            <v-list-item-content>
              <router-link :to="`/profile/${String(friend.username)}`">{{
                friend.username
              }}</router-link>
            </v-list-item-content>
            <v-btn
              icon
              @click="removeFriend(friend.id)"
              class="transparent-btn ml-4"
              v-if="isCurrentUser"
            >
              <v-icon color="red">mdi-close</v-icon>
            </v-btn>
            <v-btn
              class="ml-4"
              v-if="isCurrentUser && friend.status === 'pending' && props.type === 'followers'"
              @click="followBack(friend)"
            >
              Follow Back
            </v-btn>
            <v-divider class="my-2 mx-4" :thickness="2" color="grey"></v-divider>
          </v-list-item>
        </v-list>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-btn @click="$emit('close')">Fermer</v-btn>
    </v-card-actions>
  </v-card>
</template>
<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useFriendshipStore } from '@/stores/useFriendshipStore'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import { FriendshipStatus, type UserFriend } from '@/types/FriendshipTypes'
import { useUserStore } from '@/stores/userStore'
import { useAuth } from '@/composables/useAuth'
const { fetchMe } = useAuth()

const props = defineProps({
  type: {
    type: String,
    required: true,
    validator: (value: string) => ['followers', 'following'].includes(value)
  },
  isCurrentUser: {
    type: Boolean,
    default: false
  },
  userId: {
    type: Number,
    default: 0
  }
})

const title = ref(props.type === 'followers' ? 'Followers' : 'Following')

const emit = defineEmits(['close'])
const friendshipStore = useFriendshipStore()
const userStore = useUserStore()

const followers = ref([] as UserFriend[])
const followings = ref([] as UserFriend[])
const friendRequests = ref([] as UserFriend[])
const sentFriendRequests = ref([] as UserFriend[])
const displayList = ref([] as UserFriend[])

const loading = ref(true)
const me = (await userStore.user) || (await fetchMe())
const userId = props.userId || me.id

const updateLists = () => {
  if (props.type === 'followers') {
    followers.value = friendshipStore.followers
    friendRequests.value = friendshipStore.friendRequests
    displayList.value = followers.value
  }
  if (props.type === 'following') {
    followings.value = friendshipStore.followings
    sentFriendRequests.value = friendshipStore.sentFriendRequests
    displayList.value = followings.value
  }
}

onMounted(async () => {
  try {
    await friendshipStore.fetchFollowings(userId)
    await friendshipStore.fetchFollowers(userId)
    updateLists()
  } finally {
    loading.value = false
  }
})

watch(
  () => [
    friendshipStore.followers,
    friendshipStore.followings,
    friendshipStore.friendRequests,
    friendshipStore.sentFriendRequests
  ],
  updateLists,
  { deep: true }
)

const removeFriend = async (friendId: number) => {
  await friendshipStore.removeFriend(friendId)
  if (props.type === 'followers') {
    followers.value = followers.value.filter((f) => f.id !== friendId)
    displayList.value = followers.value
  } else if (props.type === 'following') {
    followings.value = followings.value.filter((f) => f.id !== friendId)
    displayList.value = followings.value
  }
}

const followBack = async (friend: UserFriend) => {
  await friendshipStore.acceptFriendRequest(friend.id)
  friend.status = FriendshipStatus.ACCEPTED
  displayList.value = displayList.value.map((f) => (f.id === friend.id ? friend : f))
}

const declineFriendRequest = async (senderId: number) => {
  await friendshipStore.declineFriendRequest(senderId)
  friendRequests.value = friendRequests.value.filter((f) => f.id !== senderId)
  displayList.value = friendRequests.value
}

const removeSentRequest = async (requestId: number) => {
  await friendshipStore.cancelSentRequest(requestId)
  sentFriendRequests.value = sentFriendRequests.value.filter((f) => f.id !== requestId)
  displayList.value = sentFriendRequests.value
}
</script>
