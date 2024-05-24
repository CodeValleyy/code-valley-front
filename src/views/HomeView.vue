<template>
  <v-container class="w-full max-w-full" fluid>
    <v-row align="center" justify="center">
      <v-col class="text-center">
        <h1 class="mb-6 text-4xl font-bold text-primary">Bienvenue sur {{ name }}</h1>
        <v-btn
          color="primary"
          class="mb-8 px- py-1 text-lg font-medium rounded-full align-middle"
          @click="sendTo('/code')"
        >
          Démarrer
        </v-btn>
      </v-col>
    </v-row>
    <v-row class="mb-12">
      <v-col cols="12" md="6" class="text-center md:text-left">
        <h2 class="font-bold text-primary text-2xl mb-6">Notre Mission</h2>
        <p class="mb-4 text-lg leading-relaxed">
          {{ name }} est une plateforme collaborative pour développeurs, offrant des outils pour
          coder, partager et évoluer ensemble. Rejoignez notre communauté et transformez vos idées
          en projets concrets.
        </p>
        <ul class="list-disc list-inside text-lg mb-6">
          <li class="mb-2">Gestion de versions avancée</li>
          <li class="mb-2">Suivi des problèmes et documentation en ligne</li>
          <li class="mb-2">Intégration continue et workflows automatisés</li>
        </ul>
        <p class="text-lg font-semibold">
          Prêt à améliorer votre processus de développement ?
          <strong class="text-primary">Rejoignez-nous dès maintenant.</strong>
        </p>
      </v-col>
      <v-col cols="8" md="4" class="flex justify-center md:justify-end">
        <v-img
          :src="homeImage"
          alt="Code Valley"
          class="rounded-lg shadow-lg w-full max-h-full"
          style="object-fit: contain; height: 100%; max-width: 100%"
        ></v-img>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import homeImage from '@/assets/home.webp'
import packageJson from '../../package.json'
import { useAuth } from '@/composables/useAuth'
import { onMounted } from 'vue'
const { setToken } = useAuth()

const name = packageJson.displayName
const router = useRouter()
const route = useRoute()

const sendTo = (location: string) => {
  router.push(location)
}

onMounted(() => {
  const token = route.query.token as string
  console.log(token)
  if (token) {
    setToken(token)
    sendTo('/newsfeed')
  }
})
</script>

<style scoped>
.text-primary {
  color: #902de0;
}
</style>
