<template>
  <v-app>
    <Header v-if="showHeaderFooter" />
    <v-main class="bg-backgroundColor min-h-screen">
      <router-view />
    </v-main>
    <Footer v-if="showHeaderFooter" />  
  </v-app>
</template>

<script setup lang="ts">
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import { useAuth } from '@/composables/useAuth'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const { getToken } = useAuth()
const route = useRoute()

const isAuthenticated = computed(() => !!getToken())
const showHeaderFooter = computed(() => {
  const guestRoutes = ['login', 'register']
  return isAuthenticated.value && !guestRoutes.includes(route.name as string)
})

</script>

