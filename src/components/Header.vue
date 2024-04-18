<script setup lang="ts">
const routes = [
  {
    location: '/',
    label: 'Accueil'
  },
  {
    location: '/help',
    label: 'Aide'
  }
]
</script>

<template>
  <div
    class="w-full p-8 flex items-center shadow-md bg-white justify-between text-primary text-xl fixed"
  >
    <div class="flex">
      <div class="mr-6 py-4 px-6 rounded hover:bg-gray-200" v-for="route in routes">
        <RouterLink :to="`${route.location}`">
          {{ route.label }}
        </RouterLink>
      </div>
    </div>
    <div class="flex items-center py-2 px-4 rounded hover:bg-gray-200">
      <div class="mr-auto p-2">Profil</div>
      <div>
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M12 12q-1.65 0-2.825-1.175T8 8t1.175-2.825T12 4t2.825 1.175T16 8t-1.175 2.825T12 12m-8 8v-2.8q0-.85.438-1.562T5.6 14.55q1.55-.775 3.15-1.162T12 13t3.25.388t3.15 1.162q.725.375 1.163 1.088T20 17.2V20z"
          />
        </svg>
      </div>
    </div>
  </div>
</template>
