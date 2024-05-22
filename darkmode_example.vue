<template>
  <div :class="{ dark: isDarkMode }" class="min-h-screen transition-colors duration-300">
    <header class="bg-primary text-white p-4">
      <h1 class="text-xl font-poppins">Mon Application</h1>
      <button @click="toggleDarkMode" class="ml-auto bg-secondary text-white px-4 py-2 rounded">
        {{ isDarkMode ? 'Mode Jour' : 'Mode Nuit' }}
      </button>
    </header>
    <main
      class="p-8 bg-backgroundColor text-textPrimary dark:bg-darkBackground dark:text-darkTextPrimary"
    >
      <section class="hero">
        <h2 class="text-3xl font-bold">Transformez vos fichiers facilement</h2>
        <p class="mt-4">
          Rejoignez notre réseau social pour partager et collaborer sur des programmes de
          transformation de fichiers.
        </p>
        <button class="mt-6 bg-primary hover:bg-primaryHover text-white px-6 py-3 rounded">
          Rejoignez-nous
        </button>
      </section>
      <section class="features mt-12">
        <h3 class="text-2xl font-semibold">Fonctionnalités Clés</h3>
        <ul class="mt-4 space-y-4">
          <li>Éditeur en ligne</li>
          <li>Pipelines collaboratifs</li>
          <li>Partage et collaboration</li>
        </ul>
      </section>
    </main>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isDarkMode: false
    }
  },
  methods: {
    toggleDarkMode() {
      this.isDarkMode = !this.isDarkMode
    }
  }
}
</script>

<style scoped>
/* Exemples de styles personnalisés */
.hero {
  background: linear-gradient(135deg, rgba(144, 45, 224, 0.1), rgba(224, 126, 45, 0.1));
  padding: 2rem;
  border-radius: 0.5rem;
  text-align: center;
}
</style>
