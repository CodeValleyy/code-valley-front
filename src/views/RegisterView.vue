<script setup lang="ts">
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import Button from '@/components/Button.vue'
import { ref } from 'vue'

const email = ref('')
const password = ref('')
const confirmPassword = ref('')

const register = () => {}
</script>

<template>
  <Header />
  <div class="min-h-screen h-full flex flex-col justify-between">
    <div class="w-full h-full text-xl pt-40 p-4 text-primary">
      <div class="container mx-auto">
        <div class="flex flex-col items-center">
          <h1 class="text-4xl font-bold text-primary">S'inscrire</h1>
          <p class="text-lg text-center text-primary">Pour commencer, créer un compte</p>
          <div class="p-2">
            <form @submit.prevent="register">
              <div class="flex flex-col">
                <label for="email" class="text-primary">Email</label>
                <input type="email" id="email" v-model="email" class="border border-primary rounded" />
              </div>
              <div class="flex flex-col">
                <label for="password" class="text-primary">Password</label>
                <input type="password" id="password" v-model="password" class="border border-primary rounded" />
              </div>
              <div class="flex flex-col">
                <label for="confirmPassword" class="text-primary">Confirm Password</label>
                <input type="password" id="confirmPassword" v-model="confirmPassword" class="border border-primary rounded" />
              </div>
              <div class="flex flex-col p-4">
                <Button type="submit" label="Créer un compte" />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>
