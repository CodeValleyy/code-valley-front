<template>
  <v-container class="w-full max-w-full" fluid>
    <section class="section" data-aos="fade-up">
      <v-row align="center" justify="center">
        <v-col class="text-center">
          <h1 class="mb-6 text-4xl font-bold text-primary">Bienvenue sur {{ name }}</h1>
          <v-btn
            color="primary"
            class="mb-8 px-4 py-1 text-lg font-medium rounded-full align-middle"
            @click="sendTo('/code')"
          >
            Démarrer
          </v-btn>
        </v-col>
      </v-row>
      <v-row align="center" justify="center">
        <v-col cols="8" class="flex justify-center">
          <v-img
            :src="landing_cv"
            alt="Section Image"
            class="rounded-lg shadow-lg w-2/3 max-h-full"
            style="object-fit: cover; fill: auto"
          ></v-img>
        </v-col>
      </v-row>
    </section>
    <section class="section" data-aos="fade-up">
      <v-row class="mb-6">
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
            alt="Mission Image"
            class="rounded-lg shadow-lg w-2/3 max-h-full"
            style="object-fit: contain; height: auto"
          ></v-img>
        </v-col>
      </v-row>
    </section>
    <section class="section" data-aos="fade-up">
      <v-row class="mb-6" align="center" justify="center">
        <v-col cols="12" class="text-center">
          <h2 class="font-bold text-primary text-2xl mb-6">Pipeline de Code</h2>
          <p class="mb-4 text-lg leading-relaxed">
            Exécutez votre code et obtenez des résultats instantanés grâce à notre pipeline de code
            intégré. Partagez vos scripts, voyez les sorties et collaborez en temps réel avec
            d'autres développeurs.
          </p>
        </v-col>
        <v-col align="center" cols="8" md="6" class="flex justify-center">
          <v-img
            :src="pipeline"
            alt="Pipeline Image"
            class="rounded-lg shadow-lg w-1/2"
            style="object-fit: contain; height: auto"
          ></v-img>
        </v-col>
      </v-row>
    </section>
    <section class="section" data-aos="fade-up">
      <v-row class="mb-6" align="center" justify="center">
        <v-col cols="12" class="text-center">
          <h2 class="font-bold text-primary text-2xl mb-6">Groupes de Discussion</h2>
          <p class="mb-4 text-lg leading-relaxed">
            Rejoignez des groupes de discussion pour poser des questions sur le code, trouver des
            solutions et discuter des meilleures pratiques avec des développeurs du monde entier.
          </p>
        </v-col>
        <v-col cols="8" class="flex justify-center">
          <v-img
            :src="groups"
            alt="Groups Image"
            class="rounded-lg shadow-lg w-2/3 max-h-full"
            style="object-fit: contain; height: auto"
          ></v-img>
        </v-col>
      </v-row>
    </section>
    <section class="section" data-aos="fade-up">
      <v-row class="mb-6" align="center" justify="center">
        <v-col cols="12" class="text-center">
          <h2 class="font-bold text-primary text-2xl mb-6">Réseau Social de Développeurs</h2>
          <p class="mb-4 text-lg leading-relaxed">
            Connectez-vous avec d'autres développeurs, créez des amitiés et élargissez votre réseau
            professionnel. Notre plateforme facilite les interactions sociales pour une
            collaboration plus riche et plus engagée.
          </p>
        </v-col>
        <v-col cols="8" class="flex justify-center">
          <v-img
            :src="social"
            alt="Social Network Image"
            class="rounded-lg shadow-lg w-2/3 max-h-full"
            style="object-fit: contain; height: auto"
          ></v-img>
        </v-col>
      </v-row>
    </section>
  </v-container>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import homeImage from '@/assets/home.webp'
import landing_cv from '@/assets/landing_cv.webp'
import groups from '@/assets/groups.webp'
import social from '@/assets/social.webp'
import pipeline from '@/assets/pipeline.webp'
import packageJson from '../../package.json'
import { useAuth } from '@/composables/useAuth'
import { onMounted } from 'vue'
import AOS from 'aos'
import 'aos/dist/aos.css'

const { setToken } = useAuth()

const name = packageJson.displayName
const router = useRouter()
const route = useRoute()

const sendTo = (location: string) => {
  router.push(location)
}

onMounted(() => {
  const token = route.query.token as string
  if (token) {
    if (token === 'login_needed') {
      sendTo('/login?info=login_needed')
      return
    }
    setToken(token)
    sendTo('/newsfeed')
  }
  AOS.init({
    duration: 1000,
    easing: 'ease-in-out',
    once: true
  })
})
</script>

<style scoped>
.text-primary {
  color: #902de0;
}

.section {
  min-height: 100vh;
  padding: 50px 0;
}

.v-img {
  display: block;
}
</style>
