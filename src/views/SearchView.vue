<template>
  <v-container>
    <div>
      <v-text-field
        v-model="inputValue"
        label="Rechercher un profil"
        @input="onInputChange"
        outlined
        class="mb-4"
      />
      <ul>
        <li v-for="profile in filteredProfiles" :key="profile.id">
          <div class="mb-3">
            <router-link :to="`/profile/${profile.username}`">
              <v-avatar class="mr-3">
                <img :src="getAvatar(profile)" alt="Avatar" />
              </v-avatar>
              {{ profile.username }}
            </router-link>
          </div>
        </li>
      </ul>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '@/composables/useAuth'
import type { UserResponse } from '@/types/UserResponse'

const { searchUser } = useAuth()

let inputValue = ref<string>('')
let filteredProfiles = ref<UserResponse[]>([])

const onInputChange = async () => {
  const searchQuery = inputValue.value.trim()
  if (searchQuery !== '') {
    filteredProfiles.value = await searchUser(searchQuery)
  }
}

const getAvatar = (profile: UserResponse) => {
  if (profile.avatar == null || !profile.avatar) {
    return 'https://image.noelshack.com/fichiers/2024/21/4/1716483099-image-2024-05-23-185151555.jpg'
  }
  return profile.avatar
}
</script>
