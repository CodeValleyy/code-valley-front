<script setup lang="ts">
import type { GroupInput } from '@/types/GroupInput'
import { ref } from 'vue'
import { useGroup } from '@/composables/useGroup'

const { createGroup } = useGroup()

const groupInput = ref<GroupInput>({
  name: '',
  description: '',
  memberIds: []
})

const onSubmit = () => {
  console.log(groupInput.value)
  createGroup(groupInput.value)
}

const getAvatar = () => {
  return 'https://yt3.googleusercontent.com/Pjk-KU0aJH978tDhdO05PgUx8j3i1OvqC4-U0L_3EUdJo0eBUrQ-cb1g2ZJiTYTlk5pq_0gy=s900-c-k-c0x00ffffff-no-rj'
}
</script>
<template>
  <v-container>
    <div class="text-3xl font-bold text-primary mb-10">Nouveau Groupe :</div>
    <form @submit.prevent="onSubmit" class="flex flex-col w-full items-start">
      <div class="w-full flex justify-between border rounded shadow p-4 mb-4">
        <div class="w-1/2 flex flex-col">
          <div class="mb-2">Nom :</div>
          <input
            type="text"
            class="border py-1 px-2 w-10/12 mb-6"
            v-model="groupInput.name"
            placeholder="nom du groupe..."
          />
          <div class="mb-2">Description :</div>
          <textarea
            class="border py-1 px-2 w-10/12 mb-6"
            v-model="groupInput.description"
            placeholder="description du groupe..."
          ></textarea>
        </div>
        <div class="w-1/2 flex flex-col mb-4">
          <div class="mb-2">Avatar :</div>
          <img class="w-1/2 mb-4" :src="getAvatar()" alt="Avatar" />
          <input type="file" />
        </div>
      </div>

      <button
        type="submit"
        class="py-2 px-4 shadow bg-secondaryTailwind hover:bg-secondaryHover text-white rounded"
      >
        Valider
      </button>
    </form>
  </v-container>
</template>
