<template>
  <v-app>
    <Header />
    <v-main class="bg-backgroundColor min-h-screen">
      <router-view />
    </v-main>
    <Footer />
  </v-app>
</template>

<script setup lang="ts">
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
</script>
