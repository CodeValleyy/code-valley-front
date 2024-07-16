<template>
  <v-container class="fill-height d-flex align-center justify-center">
    <v-row>
      <v-col cols="12" md="8" lg="10">
        <v-card class="pa-6 text-center">
          <LoadingSpinner v-if="loading" />
          <template v-else>
            <v-avatar
              size="100"
              class="mb-4 relative"
              @mouseover="hover = true"
              @mouseleave="hover = false"
            >
              <img :src="userAvatar" alt="User Avatar" class="rounded-full object-cover" />
              <input
                v-if="hover && profile.id === me.id"
                type="file"
                @change="postAvatar"
                class="absolute inset-0 opacity-0 cursor-pointer"
                accept="image/*"
              />
            </v-avatar>
            <h1 class="text-2xl font-bold mb-4">{{ userProfile.username }}</h1>
            <p class="text-lg mb-4">{{ userProfile.email }}</p>
            <p class="text-lg mb-4">
              Inscrit depuis le {{ new Date(userProfile.createdAt).toLocaleDateString('fr-FR') }}
            </p>
            <v-divider class="my-4"></v-divider>

            <v-btn @click="toggleFollow" v-if="profile.id !== me.id">
              {{ isFollowing ? 'Unfollow' : 'Follow' }}</v-btn
            >
            <v-divider class="my-4"></v-divider>

            <div
              class="inline-block text-center bg-white bg-opacity-50 p-2 rounded cursor-pointer mr-5"
              @click="showFollowersModal = true"
            >
              <div class="text-2xl font-bold">{{ followers }}</div>
              <div class="text-sm text-gray-700">Followers</div>
            </div>

            <div class="inline-block text-center bg-white bg-opacity-50 p-2 rounded mr-5">
              <div class="text-2xl font-bold">{{ userPosts.length }}</div>
              <div class="text-sm text-gray-700">Posts</div>
            </div>

            <div
              class="inline-block text-center bg-white bg-opacity-50 p-2 rounded cursor-pointer"
              @click="showFollowingsModal = true"
            >
              <div class="text-2xl font-bold">{{ followings }}</div>
              <div class="text-sm text-gray-700">Following</div>
            </div>
            <v-btn
              icon
              class="absolute top-3 right-3"
              @click="goToSettings"
              v-if="profile.id === me.id"
            >
              <v-icon>mdi-cog</v-icon>
            </v-btn>
            <v-btn icon class="absolute right-2" @click="handleLogout" v-if="profile.id === me.id">
              <v-icon>mdi-logout</v-icon>
            </v-btn>
          </template>
        </v-card>

        <v-btn-toggle v-model="viewMode" mandatory>
          <v-btn value="posts">Posts</v-btn>
          <v-btn value="snippets">Snippets</v-btn>
        </v-btn-toggle>

        <v-divider class="my-4"></v-divider>

        <v-list v-if="viewMode === 'posts'">
          <template v-for="(post, index) in userPosts" :key="post.id">
            <PostItem
              :post="post"
              @refreshPosts="fetchUserPosts"
              @deletePost="confirmDelete"
              @click="viewPost(post.id)"
            />
            <v-divider
              v-if="!isLastItem(index)"
              :key="`divider-${index}`"
              class="post-divider"
            ></v-divider>
          </template>
        </v-list>

        <v-list v-else-if="viewMode === 'snippets'">
          <v-list-item v-for="snippet in userSnippets" :key="snippet.id">
            <v-list-item-content>
              <v-list-item-title>{{ filenameShort(snippet.filename) }}</v-list-item-title>
              <v-chip :color="getLanguageColor(snippet.language)">{{ snippet.language }}</v-chip>
              <v-chip :color="getLanguageColor(snippet.output_type.split('.')[1])" class="ml-2">{{
                snippet.output_type.split('.')[1]
              }}</v-chip>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn icon @click="editSnippet(snippet)">
                <v-icon size="small">mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon @click="deleteSnippet(snippet)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-col>
      <div class="pagination-buttons">
        <v-btn @click="previousPage" :disabled="offset === 0">Précédent</v-btn>
        <v-btn @click="nextPage" :disabled="userPosts.length < limit">Suivant</v-btn>
      </div>
    </v-row>
    <v-dialog v-model="showFollowersModal" max-width="600">
      <FriendList
        @close="showFollowersModal = false"
        :type="'followers'"
        :isCurrentUser="profile.id === me.id"
        :userId="profile.id"
        @update-count="updateCount"
      />
    </v-dialog>
    <v-dialog v-model="showFollowingsModal" max-width="600">
      <FriendList
        @close="showFollowingsModal = false"
        :type="'following'"
        :isCurrentUser="profile.id === me.id"
        :userId="profile.id"
        @update-count="updateCount"
      />
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
import { ref, onMounted, nextTick, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useFriendshipStore } from '@/stores/useFriendshipStore'
import { usePostStore } from '@/stores/usePostStore'
import FriendList from '@/components/FriendList.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import PostItem from '@/components/PostItem.vue'
import router from '@/router'
import type { Post, Snippets } from '@/types'
import { useUserStore } from '@/stores/useUserStore'
import type { UserFriend } from '@/types/FriendshipTypes'
import { useContentStore } from '@/stores/useContentStore'
import { getLanguageColor } from '@/config/languagesConfig'
import { filenameShort } from '@/utils/file-utils'
import { useCodeRunner } from '@/composables/useCodeRunner'
import { DEFAULT_AVATAR } from '@/config/constants'

const route = useRoute()

const { editSnippet } = useCodeRunner()
const { fetchMe, getToken, logout, uploadAvatar, fetchProfile } = useAuth()
const followers = ref(0)
const followings = ref(0)
const showFollowersModal = ref(false)
const showFollowingsModal = ref(false)
const loading = ref(true)
const userAvatar = ref('')
const hover = ref(false)
const isFollowing = ref(false)
const userPosts = ref([] as Post[])
const userSnippets = ref([] as Snippets[])
const deleteDialog = ref(false)
const postToDelete = ref<Post | null>(null)

const friendshipStore = useFriendshipStore()
const postStore = usePostStore()
const userStore = useUserStore()
const contentStore = useContentStore()

const friendRequests = ref([] as UserFriend[])
const sentFriendRequests = ref([] as UserFriend[])

const me = (await userStore.user) || (await fetchMe())
const profile = ref()
const userProfile = ref({
  username: '',
  email: '',
  createdAt: ''
})

const limit = ref(1)
const offset = ref(0)

const viewMode = ref('posts')

const fetchUserSnippets = async () => {
  await contentStore.fetchContentsByOwner(profile.value.id)
  userSnippets.value = contentStore.snippets
}

const goToSettings = async () => {
  await nextTick()
  router.push({ name: 'profile-settings', params: { userId: me.id } })
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
  if (profile.value !== null) {
    await friendshipStore.toggleFollowUser(profile.value.id)
    isFollowing.value = friendshipStore.isFollowing
  }
}

const fetchUserPosts = async () => {
  if (postStore.posts.length === 0) {
    await postStore.fetchPosts()
  }
  userPosts.value = postStore.posts.filter((post) => post.userId === profile.value.id)
}

const confirmDelete = (post: Post) => {
  postToDelete.value = post
  deleteDialog.value = true
}

const viewPost = (postId: number) => {
  router.push({ name: 'PostDetail', params: { id: postId } })
}

const deletePost = async () => {
  if (postToDelete.value) {
    await postStore.deletePost(postToDelete.value.id)
    const confirm = window.confirm('Voulez-vous supprimer la snippet liée à ce post ?')
    if (confirm) {
      await contentStore.deleteContent(postToDelete.value.fileId || '')
    }
    deleteDialog.value = false
    await fetchUserPosts()
  }
}

const isLastItem = (index: number) => {
  return index === userPosts.value.length - 1
}

const updateCount = (type: string, count: number) => {
  if (type === 'followers') {
    followers.value = count
  } else if (type === 'following') {
    followings.value = count
  }
}

const fetchUserData = async (username?: string) => {
  if (!getToken()) {
    logoutAndRedirect()
    return
  }

  fetchUserPosts()
  fetchUserSnippets()

  try {
    if (!username) {
      profile.value = me
    } else {
      profile.value = await fetchProfile(username)
    }

    userProfile.value = profile.value
    userAvatar.value = profile.value.avatar || DEFAULT_AVATAR
    if (profile.value.id !== me.id) {
      await friendshipStore.fetchFriendshipFollowing(me.id, profile.value.id)
      isFollowing.value = friendshipStore.isFollowing
    }

    const counts = await friendshipStore.fetchFollowersAndFollowingsCount(profile.value.id)
    followers.value = counts.followers
    followings.value = counts.followings

    friendRequests.value = friendshipStore.friendRequests
    sentFriendRequests.value = friendshipStore.sentFriendRequests

    await fetchUserPosts()
    await fetchUserSnippets()
  } catch (error) {
    router.push('/')
    console.error('Error fetching profile:', error)
  } finally {
    loading.value = false
  }
}

const deleteSnippet = async (snippet: Snippets) => {
  if (userPosts.value.some((post) => post.fileId?.includes(snippet.id))) {
    console.error('Cannot delete a snippet used in a post')
    alert('Vous ne pouvez pas supprimer un snippet utilisé dans un post')
    return
  }
  const confirm = window.confirm('Voulez-vous vraiment supprimer ce snippet ?')
  if (!confirm) {
    return
  }
  await contentStore.deleteContent(snippet.id)
  await fetchUserSnippets()
}

const nextPage = () => {
  offset.value += limit.value
  fetchUserPosts()
}

const previousPage = () => {
  if (offset.value > 0) {
    offset.value -= limit.value
    fetchUserPosts()
  }
}

onMounted(() => {
  let username = route.params.username
  if (Array.isArray(username)) {
    username = username[0]
  }
  fetchUserData(username)
})

watch(
  () => route.params.username,
  (newUsername) => {
    if (Array.isArray(newUsername)) {
      newUsername = newUsername[0]
    }
    fetchUserData(newUsername)
  }
)

// watch contentStore.snippets
watch(contentStore.snippets, () => {
  userSnippets.value = contentStore.snippets
})
</script>
