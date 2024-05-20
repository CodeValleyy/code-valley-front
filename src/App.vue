<template>
  <v-app>
    <Header :routes="routes" />
    <v-main class="bg-backgroundColor min-h-screen">
      <router-view />
    </v-main>
    <Footer />
  </v-app>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'

const routes = ref([
  { location: '/', label: 'Accueil' },
  { location: '/code', label: 'Code' },
  { location: '/help', label: 'Aide' },
  { location: '/register', label: "S'inscrire" },
  { location: '/login', label: 'Se connecter' }
])
</script>
