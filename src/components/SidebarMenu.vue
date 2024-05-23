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
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { getToken } = useAuth()

const isAuthenticated = computed(() => !!getToken())
const drawer = ref(true)

const menuItems = computed(() => {
  const items = [
    { text: 'Accueil', to: '/newsfeed', icon: 'mdi-home', exact: true },
    { text: 'Recherche', to: '/search', icon: 'mdi-magnify', exact: false },
    { text: 'Code', to: '/code', icon: 'mdi-code-tags', exact: false },
    { text: 'Notifications', to: '/notifications', icon: 'mdi-bell', exact: false },
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

onMounted(() => {
  window.addEventListener('resize', handleResize)
  handleResize()
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
