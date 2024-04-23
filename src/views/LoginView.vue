<script setup lang="ts">
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import Button from '@/components/Button.vue'
import { ref } from 'vue'
import { signInWithEmailAndPassword, getAuth } from 'firebase/auth'
import router from '@/router'

const email = ref('')
const password = ref('')
const errorMessage = ref('')


const login = () => {
  const auth = getAuth();
  signInWithEmailAndPassword(auth, email.value, password.value)
    .then(() => {
      console.log(auth.currentUser + " has been sign in successfully");
      router.push('/')
    })
    .catch((error) => {
      console.log(error.code + ": " + error.message);
      switch (error.code) {
        case "auth/invalid-email":
          errorMessage.value = "Invalid email address";
          break;
        case "auth/user-not-found":
          errorMessage.value = "No account with that email was found";
          break;
        case "auth/wrong-password":
          errorMessage.value = "Incorrect password";
          break;
        default:
          errorMessage.value = "Email or password is incorrect";
          break;
      }
    });
}


const signInWithGoogle = () => {}
</script>

<template>
  <Header />
  <div class="min-h-screen h-full flex flex-col justify-between">
    <div class="w-full h-full text-xl pt-40 p-4 text-primary">
      <div class="container mx-auto">
        <div class="flex flex-col items-center">
          <h1 class="text-4xl font-bold text-primary">Se connecter</h1>
          <p class="text-lg text-center text-primary">Déjà inscrit? Connectez-vous</p>
          <div class="p-2">
            <div class="flex flex-col">
              <label for="email" class="text-primary">Email</label>
              <input type="email" id="email" v-model="email" class="border border-primary rounded" />
            </div>
            <div class="flex flex-col">
              <label for="password" class="text-primary">Password</label>
              <input type="password" id="password" v-model="password" class="border border-primary rounded" />
            </div>
            <div class="text-red-500 text-sm">{{ errorMessage }}</div>
            <div class="flex flex-col p-4">
              <Button @click="login" label="Se connecter" />
            </div>
            <div class="flex flex-col p-4">
              <Button @click="signInWithGoogle" label="Se connecter avec Google" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>
