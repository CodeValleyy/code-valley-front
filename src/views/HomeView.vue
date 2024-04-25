<script setup lang="ts">
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import Button from '@/components/Button.vue'
import { useRouter } from 'vue-router'

const name = 'Code Valley'

const router = useRouter()
const sendTo = (location: string) => {
  router.push(location)
}
</script>

<template>
  <Header />
  <div class="min-h-screen h-full flex flex-col justify-between">
    <div class="w-full h-full pt-40 p-4 flex flex-col items-center">
      <h1 class="mb-4 text-2xl p-8 font-semibold">Bienvenue sur {{ name }}</h1>
      <Button label="Démarrer" size="xl" @click="sendTo('/code')"></Button>
      <section class="mt-6 flex justify-center p-4 w-11/12 items-center">
        <div class="w-5/12 p-4">
          <h2 class="font-bold text-primary mr-4 text-xl mb-4">Notre Mission</h2>
          <p>
            {{ name }} est une plateforme collaborative pour développeurs, offrant des outils pour
            coder, partager et évoluer ensemble. Rejoignez notre communauté et transformez vos idées
            en projets concrets.
          </p>
          <ul class="mt-4">
            <li>Gestion de versions avancée</li>
            <li>Suivi des problèmes et documentation en ligne</li>
            <li>Intégration continue et workflows automatisés</li>
          </ul>
          <p>
            Prêt à améliorer votre processus de développement ?
            <strong>Rejoignez-nous dès maintenant.</strong>
          </p>
        </div>
        <div
          class="bg-gray-300 rounded ml-4 w-5/12 p-4 text-center h-30 flex flex-col justify-center"
        >
          <!-- Image or dynamic content goes here -->
          <img
            src="@/assets/home.webp"
            alt="Code Valley"
            class="rounded"
            style="width: 100%; height: 100%; object-fit: cover"
          />
        </div>
      </section>
    </div>
  </div>
  <Footer />
</template>
