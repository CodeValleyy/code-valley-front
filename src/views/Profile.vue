<template>
  <v-container class="fill-height d-flex align-center">
    <v-row class="flex justify-center w-full">
      <v-col cols="12" md="3">
        <v-navigation-drawer app temporary>
          <v-list>
            <v-list-item
              v-for="item in menuItems"
              :key="item.title"
              :to="item.route"
              @click="drawer = false"
            >
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-navigation-drawer>
      </v-col>
      <v-col cols="12" md="9">
        <router-view />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const drawer = ref(false)

const menuItems = [
  { title: 'Profil', route: '/profile' },
  { title: 'Paramètres', route: '/profile/settings' },
  { title: 'Changer le mot de passe', route: '/profile/settings/change-password' },
  { title: "Changer l'email", route: '/profile/settings/change-email' }
]
</script>
