<script setup lang="ts">
import { useGroup } from '@/composables/useGroup'
import { useRoute } from 'vue-router'
import TheMessage from '@/components/TheMessage.vue'
import type { Message } from '@/types/Message'

const route = useRoute()
const groupId = route.params.id

const { getOneWithId } = useGroup()

const group = await getOneWithId(String(groupId))

const defaultMessage: Message = {
  id: 0,
  value: "T'as fait l'API ?",
  author: group.members[0],
  createdAt: new Date()
}

const getAvatar = () => {
  return 'https://yt3.googleusercontent.com/Pjk-KU0aJH978tDhdO05PgUx8j3i1OvqC4-U0L_3EUdJo0eBUrQ-cb1g2ZJiTYTlk5pq_0gy=s900-c-k-c0x00ffffff-no-rj'
}
</script>

<template>
  <v-container class="h-screen">
    <div class="flex">
      <div class="p-4">
        <v-avatar>
          <img :src="getAvatar()" alt="Avatar" />
        </v-avatar>
      </div>
      <div class="text-3xl font-bold text-primary p-4">{{ group.name }}</div>
    </div>

    <div class="w-full h-5/6 flex justif-between">
      <div class="w-3/4 h-full flex flex-col justify-between mr-2">
        <div class="w-full h-5/6 p-10 rounded-2xl bg-white shadow overflow-auto">
          <div class="w-full h- mb-2" v-for="member in group.members" :key="member.id">
            <TheMessage :message="defaultMessage" :user="member" />
          </div>
          <div class="w-full h- mb-2" v-for="member in group.members" :key="member.id">
            <TheMessage :message="defaultMessage" :user="member" />
          </div>
        </div>
        <div class="w-full h-1/6 flex flex-col justify-end">
          <div class="w-full h-4/6 rounded-2xl bg-white shadow flex justify-between items-center">
            <input type="text" class="w-10/12 h-full p-4" placeholder="Votre message..." />
            <v-icon
              class="w-1/12 h-full rounded-2xl cursor-pointer hover:bg-gray-100"
              color="primary"
              >mdi-attachment</v-icon
            >
            <v-icon
              class="w-1/12 h-full rounded-2xl cursor-pointer hover:bg-gray-100"
              color="primary"
              >mdi-send-circle</v-icon
            >
          </div>
        </div>
      </div>

      <div class="w-1/4 h-full ml-2 p-4 border shadow bg-white flex flex-col">
        <div class="text-secondary text-xl font-bold mb-4">Membres :</div>
        <div class="overflow-auto flex flex-col w-full h-full items-center">
          <div
            v-for="member in group.members"
            :key="member.id"
            class="w-full bg-secondaryTailwind hover:bg-secondaryHover cursor-pointer rounded shadow p-2 text-white flex justify-between items-center mb-2 text-xs"
          >
            <div class="w-full flex items-center">
              <v-avatar class="mr-2">
                <img :src="getAvatar()" alt="Avatar" />
              </v-avatar>
              <div class="truncate">{{ member.username }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </v-container>
</template>
