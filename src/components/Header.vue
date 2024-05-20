<template>
  <v-app-bar app color="primary" dark>
    <v-toolbar-title class="text-2xl font-poppins">CodeValley</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn icon @click="drawer = !drawer" class="d-md-none">
      <v-icon>mdi-menu</v-icon>
    </v-btn>
    <v-toolbar-items class="d-none d-md-flex">
      <v-btn
        v-for="route in filteredRoutes"
        :key="route.location"
        :to="route.location"
        text
        class="text-white font-poppins mx-2"
      >
        {{ route.label }}
      </v-btn>
    </v-toolbar-items>
  </v-app-bar>

  <v-navigation-drawer v-model="drawer" app temporary class="d-md-none">
    <v-list>
      <v-list-item
        v-for="route in filteredRoutes"
        :key="route.location"
        :to="route.location"
        @click="drawer = false"
      >
        <v-list-item-title>{{ route.label }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuth } from '@/composables/useAuth'

interface Route {
  location: string
  label: string
}

const drawer = ref(false)

const { getToken } = useAuth()
const isAuthenticated = computed(() => !!getToken())

const filteredRoutes = computed(() => {
  const routes: Route[] = [
    { location: '/', label: 'Accueil' },
    { location: '/code', label: 'Code' },
    { location: '/help', label: 'Aide' }
  ]

  if (isAuthenticated.value) {
    routes.push({ location: '/profile', label: 'Profil' })
  } else {
    routes.push({ location: '/login', label: 'Se connecter' })
    routes.push({ location: '/register', label: "S'inscrire" })
  }

  return routes
})
</script>

<style scoped>
.v-toolbar-title {
  cursor: pointer;
}
</style>
