<script setup lang="ts">
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import Button from '@/components/Button.vue'

const name = '"Nom du site"'
</script>

<template>
  <Header />
  <div class="min-h-screen h-full flex flex-col justify-between">
    <div class="w-full h-full pt-40 p-4 flex flex-col items-center">
      <div class="mb-4 text-2xl p-8 font-semibold">Bienvenue sur {{ name }}</div>
      <Button label="Getting Started" size="xl"></Button>
      <div class="mt-6 flex justify-center p-4 w-11/12 items-center">
        <div class="w-5/12 p-4">
          <div class="font-bold text-primary mr-4 text-xl mb-4">Ce que nous faisons</div>
          <div class="text-justify">
            Chez {{ name }}, notre mission est de fournir une plateforme collaborative où les
            développeurs du monde entier peuvent construire, partager et travailler ensemble sur des
            projets logiciels. <br /><br />
            Nous croyons en un monde où le développement de logiciels est ouvert, transparent et
            accessible à tous ceux qui veulent contribuer. Nous offrons un espace où les
            développeurs peuvent héberger leurs codes sources, collaborer avec d'autres personnes,
            suivre les modifications apportées à leurs projets et coordonner leurs efforts de
            développement. <br />
            Que vous soyez un développeur individuel, une petite équipe ou une grande entreprise,
            {{ name }} fournit les outils nécessaires pour rendre votre processus de développement
            plus efficace et plus transparent. <br /><br />
            Nos fonctionnalités incluent la gestion avancée des versions, le suivi des problèmes, la
            documentation en ligne, l'intégration continue, les workflows automatisés et bien plus
            encore. Avec {{ name }}, vous pouvez créer des logiciels de meilleure qualité plus
            rapidement et plus facilement, tout en favorisant la collaboration et l'innovation.
            <br />
            Que vous soyez un débutant ou un expert en développement, {{ name }} est là pour vous
            aider à réussir dans vos projets logiciels. Rejoignez notre communauté mondiale de
            millions de développeurs et découvrez ce que vous pouvez accomplir ensemble sur
            {{ name }}.
          </div>
        </div>
        <div
          class="bg-gray-300 rounded ml-4 w-5/12 p-4 text-center h-20 flex flex-col justify-center"
        >
          Image
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>
