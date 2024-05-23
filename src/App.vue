<template>
  <v-app>
    <SidebarMenu v-if="showHeaderFooter" />

    <v-main class="bg-backgroundColor min-h-screen">
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import SidebarMenu from './components/SidebarMenu.vue'
import { useAuth } from '@/composables/useAuth'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'

const { getToken } = useAuth()
const route = useRoute()
const drawer = ref(false)

const isAuthenticated = computed(() => !!getToken())
const showHeaderFooter = computed(() => {
  const guestRoutes = ['login', 'register']
  return isAuthenticated.value && !guestRoutes.includes(route.name as string)
})
</script>
