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

      <div class="w-10/12 m-auto flex justify-between flex-wrap">
        <router-link
          v-for="group in filteredGroups"
          :key="group.id"
          :to="`/groups/details/${group.name}`"
          class="w-1/3 flex justify-center items-center"
        >
          <div
            class="mb-3 border p-4 w-11/12 flex justify-between items-center hover:bg-gray-300 rounded cursor-pointer"
          >
            <div>{{ group.name }}</div>
            <div>{{ group.members.length }} membre(s)</div>
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
</script>
