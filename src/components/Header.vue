<script setup lang="ts">
const routes = [
  {
    location: '',
    label: 'Accueil'
  },
  {
    location: 'help',
    label: 'Aide'
  }
]
</script>

<template>
  <div class="w-full p-8 flex">
    <div class="mr-2" v-for="route in routes">
      <RouterLink :to="`/${route.location}`" class="p-6 bg-gray text-primary text-lg">
        {{ route.label }}
      </RouterLink>
    </div>
  </div>
  <div class="w-11/12 m-auto border-b border-primary"></div>
</template>
