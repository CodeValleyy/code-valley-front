<template>
  <v-card>
    <v-card-title>{{ title }}</v-card-title>
    <v-card-text>
      <LoadingSpinner v-if="loading" />
      <v-container v-else>
        <v-list>
          <v-list-item v-for="friend in displayList" :key="friend.id">
            <v-list-item-content class="d-flex align-center pointer">
              <v-btn
                variant="plain"
                :to="`/profile/${String(friend.username)}`"
                @click="navigateToProfile(friend.username)"
              >
                {{ friend.username }}
              </v-btn>
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
        <v-btn @click="previousPage" :disabled="offset === 0" class="mr-2">Précédent</v-btn>
        <v-btn @click="nextPage" :disabled="displayList.length < limit">Suivant</v-btn>
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
import { useRouter } from 'vue-router'

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
const emit = defineEmits(['close', 'update-count'])
const friendshipStore = useFriendshipStore()
const router = useRouter()

const limit = ref(5)
const offset = ref(0)
const loading = ref(true)
const displayList = ref([] as UserFriend[])

const fetchFollowers = async () => {
  loading.value = true
  await friendshipStore.fetchFollowers(props.userId, limit.value, offset.value)
  displayList.value = friendshipStore.followers
  loading.value = false
}

const fetchFollowings = async () => {
  loading.value = true
  await friendshipStore.fetchFollowings(props.userId, limit.value, offset.value)
  displayList.value = friendshipStore.followings
  loading.value = false
}

const nextPage = () => {
  offset.value += limit.value
  if (props.type === 'followers') {
    fetchFollowers()
  } else {
    fetchFollowings()
  }
}

const previousPage = () => {
  if (offset.value > 0) {
    offset.value -= limit.value
    if (props.type === 'followers') {
      fetchFollowers()
    } else {
      fetchFollowings()
    }
  }
}

const navigateToProfile = (username: string) => {
  emit('close')
  router.push(`/profile/${username}`)
}

const removeFriend = async (friendId: number) => {
  await friendshipStore.removeFriend(friendId)
  if (props.type === 'followers') {
    displayList.value = displayList.value.filter((f) => f.id !== friendId)
  } else {
    displayList.value = displayList.value.filter((f) => f.id !== friendId)
  }
  emit('update-count', props.type, displayList.value.length)
}

const followBack = async (friend: UserFriend) => {
  await friendshipStore.acceptFriendRequest(friend.id)
  friend.status = FriendshipStatus.ACCEPTED
  displayList.value = displayList.value.map((f) => (f.id === friend.id ? friend : f))
}

onMounted(() => {
  if (props.type === 'followers') {
    fetchFollowers()
  } else {
    fetchFollowings()
  }
})

watch(
  () => props.userId,
  () => {
    offset.value = 0
    if (props.type === 'followers') {
      fetchFollowers()
    } else {
      fetchFollowings()
    }
  }
)
</script>
