<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useGroup } from '@/composables/useGroup'
import type { GroupResponse } from '@/types/GroupResponse'
import { useUserStore } from '@/stores/useUserStore'
import { useAuth } from '@/composables/useAuth'
import type { User } from '@/types'
import { useRouter } from 'vue-router'

const { searchGroup, getAll, joinGroup, sendJoinRequest } = useGroup()

const userStore = useUserStore()
const router = useRouter()

const { fetchMe } = useAuth()
const me: User = (await userStore.user) || (await fetchMe())

let inputValue = ref<string>('')
let filteredGroups = ref<GroupResponse[]>([])

const checkIfMember = (group: GroupResponse): boolean => {
  return group.members.some((member) => member.id === me.id)
}

const checkRequestSended = (group: GroupResponse): boolean => {
  return group.memberJoinRequests.some((member) => member.id === me.id)
}

onMounted(async () => {
  filteredGroups.value = await getAll()
  filteredGroups.value.sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
  )
})

const onInputChange = async () => {
  const searchQuery = inputValue.value.trim()
  if (searchQuery !== '') {
    filteredGroups.value = await searchGroup(searchQuery)
  } else {
    filteredGroups.value = await getAll()
  }
}

const currentGroup = ref<GroupResponse>()
const isModalOpen = ref(false)

const openJoinGroupModal = (group: GroupResponse) => {
  isModalOpen.value = true
  currentGroup.value = group
}

const handleBackgroundClick = (event: Event) => {
  if (event.target === event.currentTarget) {
    isModalOpen.value = false
  }
}

const joinCurrentGroup = async () => {
  console.log(currentGroup)
  if (currentGroup.value) {
    if (currentGroup.value.isPublic) await joinGroup(currentGroup.value?.id, me.id)
    else {
      await sendJoinRequest(currentGroup.value?.id, me.id)
      isModalOpen.value = false
      alert('Votre demande a bien été envoyé')
      onInputChange()
    }
  }
  isModalOpen.value = false
}

const getAvatar = () => {
  return 'https://yt3.googleusercontent.com/Pjk-KU0aJH978tDhdO05PgUx8j3i1OvqC4-U0L_3EUdJo0eBUrQ-cb1g2ZJiTYTlk5pq_0gy=s900-c-k-c0x00ffffff-no-rj'
}
</script>

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

      <div class="w-full m-auto flex justify-start flex-wrap">
        <div
          class="w-1/2 flex justify-center items-center"
          v-for="group in filteredGroups"
          :key="group.id"
        >
          <router-link
            v-if="checkIfMember(group)"
            :to="`/groups/${group.id}`"
            class="w-full flex justify-center items-center"
          >
            <div
              class="mb-3 border p-4 w-11/12 flex justify-between items-center hover:bg-gray-300 rounded cursor-pointer"
            >
              <div class="h-10 w-10">
                <div
                  class="h-full w-full overflow-hidden flex justify-center items-center rounded-full"
                >
                  <img :src="group.avatar" class="h-full w-full object-cover" alt="Avatar" />
                </div>
              </div>
              <div class="w-1/2 mr-2 truncate">{{ group.name }}</div>
              <div class="w-1/4 flex justify-end itemcenter">
                <div class="mr-1">{{ group.members.length }}</div>
                <v-icon color="primary">mdi-account-group</v-icon>
                <v-icon class="ml-1" color="primary">mdi-check</v-icon>
              </div>
            </div>
          </router-link>
          <div
            v-else-if="checkRequestSended(group)"
            class="w-full flex justify-center items-center"
          >
            <div
              @click="openJoinGroupModal(group)"
              class="mb-3 border p-4 w-11/12 flex justify-between items-center hover:bg-gray-300 rounded cursor-pointer"
            >
              <div class="h-10 w-10">
                <div
                  class="h-full w-full overflow-hidden flex justify-center items-center rounded-full"
                >
                  <img :src="group.avatar" class="h-full w-full object-cover" alt="Avatar" />
                </div>
              </div>
              <div class="w-1/2 mr-2 truncate">{{ group.name }}</div>
              <div class="w-1/4 flex justify-end itemcenter">
                <div class="mr-1">{{ group.members.length }}</div>
                <v-icon color="secondary">mdi-account-group</v-icon>
                <v-icon class="ml-1" color="secondary">mdi-send-clock</v-icon>
              </div>
            </div>
          </div>
          <div v-else class="w-full flex justify-center items-center">
            <div
              @click="openJoinGroupModal(group)"
              class="mb-3 border p-4 w-11/12 flex justify-between items-center hover:bg-gray-300 rounded cursor-pointer"
            >
              <div class="h-10 w-10">
                <div
                  class="h-full w-full overflow-hidden flex justify-center items-center rounded-full"
                >
                  <img :src="group.avatar" class="h-full w-full object-cover" alt="Avatar" />
                </div>
              </div>
              <div class="w-1/2 mr-2 truncate">{{ group.name }}</div>
              <div class="w-1/4 flex justify-end itemcenter">
                <div class="mr-1">{{ group.members.length }}</div>
                <v-icon color="secondary">mdi-account-group</v-icon>
                <v-icon class="ml-1" v-if="group.isPublic" color="secondary">mdi-plus</v-icon>
                <v-icon class="ml-1" v-else color="secondary">mdi-plus-lock</v-icon>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </v-container>
  <Teleport to="body">
    <div
      v-if="isModalOpen"
      style="z-index: 2000"
      @click="handleBackgroundClick"
      class="top-0 left-0 fixed w-screen h-screen bg-black/50 flex justify-center items-center"
    >
      <form
        v-if="currentGroup?.isPublic"
        @submit.prevent="joinCurrentGroup"
        class="w-1/3 bg-white rounded flex flex-col items-center p-4"
      >
        <div class="mb-4 font-bold text-primary">Voulez-vous rejoindre ce groupe :</div>
        <div class="mb-3 border shadow p-4 w-11/12 flex justify-between items-center rounded">
          <div class="h-10 w-10">
            <div
              class="h-full w-full overflow-hidden flex justify-center items-center rounded-full"
            >
              <img :src="currentGroup.avatar" class="h-full w-full object-cover" alt="Avatar" />
            </div>
          </div>
          <div class="w-1/2 mr-2 truncate">{{ currentGroup?.name }}</div>
          <div class="w-1/4 flex justify-end itemcenter">
            <div class="mr-1">{{ currentGroup?.members.length }}</div>
            <v-icon color="secondary">mdi-account-group</v-icon>
          </div>
        </div>
        <div class="flex items-center justify-center">
          <button
            @click="isModalOpen = false"
            type="button"
            class="p-2 font-bold bg-gray-300 rounded shadow mr-1"
          >
            Annuler
          </button>
          <button
            type="submit"
            class="p-2 font-bold text-white bg-secondaryTailwind rounded shadow ml-1"
          >
            Rejoindre
          </button>
        </div>
      </form>
      <form
        v-else
        @submit.prevent="joinCurrentGroup"
        class="w-1/3 bg-white rounded flex flex-col items-center p-4"
      >
        <div
          v-if="currentGroup && !checkRequestSended(currentGroup)"
          class="mb-4 font-bold text-primary text-center"
        >
          Ce groupe est un groupe <b class="text-secondary">privé</b> , envoyer une demande pour
          rejoindre le groupe ?
        </div>
        <div
          v-if="currentGroup && checkRequestSended(currentGroup)"
          class="mb-4 font-bold text-primary text-center"
        >
          Vous avez déjà envoyé une demande pour rejoindre ce groupe :
        </div>
        <div class="mb-3 border shadow p-4 w-11/12 flex justify-between items-center rounded">
          <div class="h-10 w-10">
            <div
              class="h-full w-full overflow-hidden flex justify-center items-center rounded-full"
            >
              <img :src="currentGroup?.avatar" class="h-full w-full object-cover" alt="Avatar" />
            </div>
          </div>
          <div class="w-1/2 mr-2 truncate">{{ currentGroup?.name }}</div>
          <div class="w-1/4 flex justify-end itemcenter">
            <div class="mr-1">{{ currentGroup?.members.length }}</div>
            <v-icon color="secondary">mdi-account-group</v-icon>
          </div>
        </div>
        <div class="flex items-center justify-center">
          <button
            v-if="currentGroup && !checkRequestSended(currentGroup)"
            @click="isModalOpen = false"
            type="button"
            class="p-2 font-bold bg-gray-300 rounded shadow mr-1"
          >
            Annuler
          </button>
          <button
            v-if="currentGroup && !checkRequestSended(currentGroup)"
            type="submit"
            class="p-2 font-bold flex items-center text-white bg-secondaryTailwind rounded shadow ml-1"
          >
            <div class="mr-2 font-bold">Envoyer</div>

            <v-icon color="white">mdi-account-multiple-plus</v-icon>
          </button>
          <button
            v-if="currentGroup && checkRequestSended(currentGroup)"
            type="button"
            @click="isModalOpen = false"
            class="px-4 py-2 font-bold bg-gray-300 rounded shadow ml-1"
          >
            Ok
          </button>
        </div>
      </form>
    </div>
  </Teleport>
</template>
