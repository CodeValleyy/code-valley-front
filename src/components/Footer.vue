<script setup lang="ts"></script>

<template>
  <div
    class="w-full pt-8 pb-2 px-8 flex flex-col items-center justify-between shadow-lg bg-primary bottom-0 text-white text-xl"
  >
    <div class="w-full flex mb-4">
      <div class="flex flex-col mr-40">
        <RouterLink to="/" class="mb-2 hover:underline">Accueil</RouterLink>
        <RouterLink to="/help" class="mb-2 hover:underline">Aide</RouterLink>
        <RouterLink to="/register" class="mb-2 hover:underline">S'inscrire</RouterLink>
        <RouterLink to="/login" class="mb-2 hover:underline">Se connecter</RouterLink>
        <div class="mb-2 hover:underline">Ceci est un lien pour une page du site</div>
      </div>
      <div class="flex flex-col mr-40">
        <div class="mb-2 hover:underline">Ceci est un lien pour une page du site</div>
      </div>
    </div>
    <div class="flex items-center">
      <div class="mr-2 text-sm">ABIB James;</div>
      <div class="mr-2 text-sm">KIELT Ronan;</div>
      <div class="mr-2 text-sm">CRETOIS Charles;</div>
    </div>
  </div>
</template>
