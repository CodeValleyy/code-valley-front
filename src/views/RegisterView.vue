<script setup lang="ts">
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import Button from '@/components/Button.vue'
import { ref } from 'vue'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import router from '@/router'

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const errorMessage = ref('')


const register = () => {
  if (password.value !== confirmPassword.value) {
    errorMessage.value = "Passwords do not match";
    return;
  }

  const auth = getAuth();
  createUserWithEmailAndPassword(auth, email.value, password.value)
    .then(() => {
      console.log(auth.currentUser + " has been registered successfully");
      router.push('/')
    })
    .catch((error) => {
      console.log(error.code + ": " + error.message);
      switch (error.code) {
        case "auth/invalid-email":
          errorMessage.value = "Invalid email address";
          break;
        case "auth/email-already-in-use":
          errorMessage.value = "Email already in use";
          break;
        case "auth/weak-password":
          errorMessage.value = "Password is too weak";
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
          <h1 class="text-4xl font-bold text-primary">S'inscrire</h1>
          <p class="text-lg text-center text-primary">Pour commencer, créer un compte</p>
          <div class="p-2">
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
            <div class="text-red-500 text-sm">{{ errorMessage }}</div>
            <div class="flex flex-col p-4">
              <Button @click="register" label="Créer un compte" />
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
