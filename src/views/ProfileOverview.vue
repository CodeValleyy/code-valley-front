<template>
  <v-container class="fill-height d-flex align-center justify-center">
    <v-row>
      <v-col cols="12" md="8" lg="10">
        <v-card class="pa-6 text-center">
          <LoadingSpinner v-if="loading" />
          <template v-else>
            <v-avatar size="100" class="mb-4" @mouseover="hover = true" @mouseleave="hover = false">
              <img :src="userAvatar" alt="User Avatar" />
              <input
                v-if="hover"
                type="file"
                @change="postAvatar"
                class="avatar-upload"
                accept="image/*"
              />
            </v-avatar>
            <h1 class="text-2xl font-bold mb-4">{{ userProfile.username }}</h1>
            <p class="text-lg mb-4">{{ userProfile.email }}</p>
            <p class="text-lg mb-4">
              Inscrit depuis le {{ new Date(userProfile.createdAt).toLocaleDateString('fr-FR') }}
            </p>

            <v-btn @click="showFriendsModal = true">Amis ({{ friendsCount }})</v-btn>
            <v-btn @click="toggleFollow" v-if="userId !== me.id">
              {{ isFollowing ? 'Unfollow' : 'Follow' }}</v-btn
            >
            <v-btn icon class="absolute top-3 right-3" @click="goToSettings">
              <v-icon>mdi-cog</v-icon>
            </v-btn>
            <v-btn icon class="absolute right-2" @click="handleLogout">
              <v-icon>mdi-logout</v-icon>
            </v-btn>
          </template>
        </v-card>

        <v-divider class="my-4"></v-divider>
        <v-list>
          <template v-for="(post, index) in userPosts" :key="post.id">
            <PostItem :post="post" @refreshPosts="fetchUserPosts" @deletePost="confirmDelete" />
            <v-divider
              v-if="!isLastItem(index)"
              :key="`divider-${index}`"
              class="post-divider"
            ></v-divider>
          </template>
        </v-list>
      </v-col>
    </v-row>

    <v-dialog v-model="showFriendsModal" max-width="600">
      <FriendList @close="showFriendsModal = false" />
    </v-dialog>
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-title class="headline">Confirmer la suppression</v-card-title>
        <v-card-text>Voulez-vous vraiment supprimer ce post ?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text="Annuler" @click="deleteDialog = false">Annuler</v-btn>
          <v-btn color="red darken-1" text="Supprimer" @click="deletePost">Supprimer</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useFriendshipStore } from '@/stores/useFriendshipStore'
import { usePostStore } from '@/stores/usePostStore'
import FriendList from '@/components/FriendList.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import PostItem from '@/components/PostItem.vue'
import router from '@/router'
import type { Post } from '@/types'
import { useUserStore } from '@/stores/userStore'

const route = useRoute()
const userId = ref<number>(0)

const { fetchMe, getToken, logout, uploadAvatar, fetchProfile } = useAuth()
const friendsCount = ref(0)
const showFriendsModal = ref(false)
const loading = ref(true)
const userAvatar = ref('')
const hover = ref(false)
const isFollowing = ref(false)
const userPosts = ref([] as Post[])
const deleteDialog = ref(false)
const postToDelete = ref<Post | null>(null)

const friendshipStore = useFriendshipStore()
const postStore = usePostStore()
const userStore = useUserStore()

const me = (await userStore.user) || (await fetchMe())

const userProfile = ref({
  username: '',
  email: '',
  createdAt: ''
})

const goToSettings = () => {
  router.push('/profile/settings')
}

const handleLogout = async () => {
  await logoutAndRedirect()
}

const logoutAndRedirect = async () => {
  await logout()
  await nextTick()
  router.push('/login')
}

const postAvatar = async (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target && target.files && target.files[0]) {
    const file = target.files[0]
    try {
      const response = await uploadAvatar(file)
      userAvatar.value = response.avatarUrl
    } catch (error) {
      console.error('Error uploading avatar:', error)
    }
  }
}

const toggleFollow = async () => {
  if (userId.value !== null) {
    await friendshipStore.toggleFollowUser(userId.value)
    isFollowing.value = friendshipStore.isFollowing
  }
}

const fetchUserPosts = async () => {
  userPosts.value = postStore.posts.filter((post) => post.userId === userId.value)
}

const confirmDelete = (post: Post) => {
  postToDelete.value = post
  deleteDialog.value = true
}

const deletePost = async () => {
  if (postToDelete.value) {
    await postStore.deletePost(postToDelete.value.id)
    deleteDialog.value = false
    await fetchUserPosts()
  }
}

const isLastItem = (index: number) => {
  return index === userPosts.value.length - 1
}

onMounted(async () => {
  if (!getToken()) {
    logoutAndRedirect()
    return
  }

  try {
    userId.value = route.params.userId ? Number(route.params.userId) : me.id

    const profile = await fetchProfile(userId.value)
    userProfile.value = profile
    userAvatar.value = profile.avatar || 'https://via.placeholder.com/100'

    if (userId.value !== me.id) {
      await friendshipStore.fetchFriendshipFollowing(me.id, userId.value)
      isFollowing.value = friendshipStore.isFollowing
    }

    await friendshipStore.fetchFriendsByUserId(userId.value)
    friendsCount.value = friendshipStore.friends.length

    await fetchUserPosts()
  } catch (error) {
    logoutAndRedirect()
    console.error('Error fetching profile:', error)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.min-h-screen {
  min-height: 100vh;
}
.avatar-upload {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}
.post-divider {
  margin: 0;
}
</style>
