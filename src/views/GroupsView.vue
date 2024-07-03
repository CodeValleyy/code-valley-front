<template>
  <v-container>
    <div>
      <v-text-field
        v-model="inputValue"
        label="Rechercher un groupe"
        @input="onInputChange"
        outlined
        class="mb-4"
      />

      <div class="w-full m-auto flex justify-end">
        <router-link :to="`/groups/new`" class="w-fit flex justify-center items-center">
          <div
            class="mb-3 border w-fit text-white bg-primaryTailwind hover:bg-primaryHover shadow rounded-lg px-4 py-2 font-bold w-11/12 flex justify-between items-center rounded cursor-pointer"
          >
            <v-icon color="white" class="mr-2">mdi-plus</v-icon>
            <div>Créer un nouveau Groupe</div>
          </div>
        </router-link>
      </div>

      <div class="w-full m-auto flex justify-between flex-wrap">
        <router-link
          v-for="group in filteredGroups"
          :key="group.id"
          :to="`/groups/${group.id}`"
          class="w-1/2 flex justify-center items-center"
        >
          <div
            class="mb-3 border p-4 w-11/12 flex justify-between items-center hover:bg-gray-300 rounded cursor-pointer"
          >
            <v-avatar>
              <img :src="getAvatar()" alt="Avatar" />
            </v-avatar>
            <div class="w-1/2 mr-2 truncate">{{ group.name }}</div>
            <div class="w-1/4 flex justify-end itemcenter">
              <div class="mr-1">{{ group.members.length }}</div>
              <v-icon color="primary">mdi-account-group</v-icon>
            </div>
          </div>
        </router-link>
      </div>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useGroup } from '@/composables/useGroup'
import type { GroupResponse } from '@/types/GroupResponse'

const { searchGroup, getAll } = useGroup()

let inputValue = ref<string>('')
let filteredGroups = ref<GroupResponse[]>([])

onMounted(async () => {
  filteredGroups.value = await getAll()
})

const onInputChange = async () => {
  const searchQuery = inputValue.value.trim()
  if (searchQuery !== '') {
    filteredGroups.value = await searchGroup(searchQuery)
  } else {
    filteredGroups.value = await getAll()
  }
}

const getAvatar = () => {
  return 'https://yt3.googleusercontent.com/Pjk-KU0aJH978tDhdO05PgUx8j3i1OvqC4-U0L_3EUdJo0eBUrQ-cb1g2ZJiTYTlk5pq_0gy=s900-c-k-c0x00ffffff-no-rj'
}
</script>
