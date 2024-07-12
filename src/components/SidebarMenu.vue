<template>
  <v-navigation-drawer
    v-model="drawer"
    app
    :permanent="!isMobile"
    :temporary="isMobile"
    color="primary"
  >
    <v-list dense>
      <v-list-item
        v-for="item in menuItems"
        :key="item.text"
        :to="item.to"
        class="d-flex align-center"
        :exact="item.exact"
        @click="isMobile && (drawer = false)"
      >
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{ item.text }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <v-spacer></v-spacer>
    <v-btn @click="postModal = true" class="mx-4 my-2" color="blue">Poster</v-btn>
    <v-list-item class="align-center" @click="userProfileModal = true">
      <v-list-item-avatar size="50">
        <v-img :src="userAvatar" alt="User Avatar" />
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title>{{ username }}</v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <v-dialog v-model="postModal" max-width="600">
      <PostModal @close="postModal = false" />
    </v-dialog>
    <v-dialog v-model="userProfileModal" max-width="400">
      <UserProfileModal @close="userProfileModal = false" />
    </v-dialog>
  </v-navigation-drawer>
</template>
<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useAuth } from '@/composables/useAuth'
import PostModal from '@/components/PostModal.vue'
import UserProfileModal from '@/components/UserProfileModal.vue'
import { useUserStore } from '@/stores/useUserStore'
import { DEFAULT_AVATAR } from '@/config/constants'

const { getToken, fetchMe } = useAuth()

const isAuthenticated = computed(() => !!getToken())
const drawer = ref(true)
const postModal = ref(false)
const userProfileModal = ref(false)
const userAvatar = ref(DEFAULT_AVATAR)
const username = ref('')
const userStore = useUserStore()

const menuItems = computed(() => {
  const items = [
    { text: 'Accueil', to: '/newsfeed', icon: 'mdi-home', exact: true },
    { text: 'Recherche', to: '/search', icon: 'mdi-magnify', exact: false },
    { text: 'Code', to: '/code', icon: 'mdi-code-tags', exact: false },
    { text: 'Notifications', to: '/notifications', icon: 'mdi-bell', exact: false },
    { text: 'Pipeline', to: '/pipeline', icon: 'mdi-pipe', exact: false },
    { text: 'Groupes', to: '/groups', icon: 'mdi-account-group', exact: false },
    { text: 'Profil', to: '/profile', icon: 'mdi-account', exact: false }
  ]

  if (!isAuthenticated.value) {
    return items.filter((item) => item.to === '/profile')
  }

  return items
})

const isMobile = ref(window.innerWidth <= 600)

const handleResize = () => {
  isMobile.value = window.innerWidth <= 600
  if (!isMobile.value) {
    drawer.value = true
  }
}

const fetchUserProfile = async () => {
  try {
    await userStore.fetchUserProfile()
    const user = userStore.user
    username.value = user?.username || ''
    userAvatar.value = user?.avatar || DEFAULT_AVATAR
  } catch (error) {
    console.error('Error fetching user profile:', error)
  }
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
  handleResize()
  if (isAuthenticated.value) {
    fetchUserProfile()
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.v-navigation-drawer {
  width: 240px;
}

.v-list-item {
  cursor: pointer;
}

.v-list-item-icon {
  margin-right: 16px;
}
</style>
