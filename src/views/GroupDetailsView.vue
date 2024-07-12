<script setup lang="ts">
import { useGroup } from '@/composables/useGroup'
import { useMessage } from '@/composables/useMessage'
import { useRoute, useRouter } from 'vue-router'
import TheMessage from '@/components/TheMessage.vue'
import type { MessageInput } from '@/types/MessageInput'
import { ref, watch, nextTick, onMounted, onUnmounted, onBeforeMount } from 'vue'
import type { GroupResponse } from '@/types/GroupResponse'
import type { MessageResponse } from '@/types/MessageResponse'
import { useAuth } from '@/composables/useAuth'
import { useUserStore } from '@/stores/useUserStore'
import type { User } from '@/types'
import { DEFAULT_AVATAR } from '@/config/constants'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const { fetchMe } = useAuth()
const groupId = route.params.id

const { getOneWithId, removeUser, acceptRequest, refuseRequest, addAdmin } = useGroup()
const { getMessagesWithGroupId, createMessage } = useMessage()

const group = ref<GroupResponse>(await getOneWithId(String(groupId)))
const messages = ref<MessageResponse[]>(await getMessagesWithGroupId(String(groupId)))

const me: User = (await userStore.user) || (await fetchMe())

const memberItems = [
  {
    action: 'checkAccount',
    disableType: null,
    title: 'Voir le profil',
    color: 'primary',
    icon: 'mdi-account'
  },
  {
    action: 'manageAccount',
    disableType: 'admin',
    title: "Gérer l'utilisateur",
    color: 'primary',
    icon: 'mdi-account-cog'
  }
]

const memberJoinRequestItems = [
  { action: 'checkAccount', title: 'Voir le profil', color: 'secondary', icon: 'mdi-account' },
  {
    action: 'acceptDemand',
    title: 'Accepter la demande',
    color: 'secondary',
    icon: 'mdi-account-check'
  },
  {
    action: 'refuseDemand',
    title: 'Refuser la demande',
    color: 'secondary',
    icon: 'mdi-account-remove'
  }
]

onBeforeMount(() => {
  const isMember = group.value.members.some((member) => member.id === me.id)

  if (!isMember) {
    router.push('/not-authorized')
    return
  }
})

const newMessage = ref<MessageInput>({
  authorId: String(me.id),
  groupId: String(groupId),
  value: ''
})

const messageContainerRef = ref<HTMLElement | null>(null)

const sendMessage = async () => {
  if (newMessage.value && newMessage.value.value !== '') {
    await createMessage(newMessage.value)
    newMessage.value.value = ''
    refreshMessages(true)
  }
}

const getAvatar = () => {
  return DEFAULT_AVATAR
}

const isModalOpen = ref(false)
const currentUser = ref<User>()

const openModal = (user: User) => {
  isModalOpen.value = true
  currentUser.value = user
}

const handleBackgroundClick = (event: Event) => {
  if (event.target === event.currentTarget) {
    isModalOpen.value = false
  }
}

const refreshMessages = async (scroll = false) => {
  const fetchedMessages = await getMessagesWithGroupId(String(groupId))
  messages.value = sortMessagesByDate(fetchedMessages)
  if (scroll) scrollToBottom()
}

const sortMessagesByDate = (messagesArray: MessageResponse[]) => {
  return messagesArray.sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  ) as MessageResponse[]
}

const scrollToBottom = async () => {
  await nextTick()
  if (messageContainerRef.value) {
    messageContainerRef.value.scrollTop = messageContainerRef.value.scrollHeight
  }
}

const itemActions = async (action = 'default', user: User | null = null) => {
  if (action === 'default') return

  switch (action) {
    case 'checkAccount':
      router.push('/profile/' + user?.username)
      break
    case 'manageAccount':
      console.log('Manage')
      if (user) openModal(user)
      break
    case 'acceptDemand':
      if (user) {
        group.value.members.push(user)
        group.value.memberJoinRequests = group.value.memberJoinRequests.filter(
          (joinRequest) => joinRequest.id !== user.id
        )
        await acceptRequest(Number(groupId), user.id)
      }
      break
    case 'refuseDemand':
      if (user) {
        group.value.memberJoinRequests = group.value.memberJoinRequests.filter(
          (joinRequest) => joinRequest.id !== user.id
        )
        await refuseRequest(Number(groupId), user.id)
      }
      break
  }
}

const userActions = async (action = 'default', user: User | null = null) => {
  if (action === 'default') return

  switch (action) {
    case 'removeUser':
      group.value.members = group.value.members.filter(
        (joinRequest) => joinRequest.id !== currentUser.value?.id
      )
      isModalOpen.value = false
      await removeUser(Number(groupId), Number(currentUser.value?.id))
      break
    case 'adminUser':
      await addAdmin(Number(groupId), Number(currentUser.value?.id))
      break
  }
}

const checkIfAdmin = (user: User): boolean => {
  return group.value.admins.some((member) => member.id === user.id)
}

const isAdmin = ref(false)

watch(route, async (newRoute) => {
  const newGroupId = newRoute.params.id
  group.value = await getOneWithId(String(newGroupId))
  messages.value = sortMessagesByDate(await getMessagesWithGroupId(String(newGroupId)))
  scrollToBottom()
})

messages.value = sortMessagesByDate(messages.value)
nextTick(scrollToBottom)

onMounted(() => {
  const intervalId = setInterval(refreshMessages, 20000)

  isAdmin.value = checkIfAdmin(me)

  onUnmounted(() => {
    clearInterval(intervalId)
  })
})
</script>

<template>
  <v-container class="h-screen">
    <div class="w-full flex justify-between">
      <div class="flex p-4 w-1/2">
        <div class="h-20 w-20">
          <div class="h-full w-full overflow-hidden rounded-full">
            <img :src="group.avatar" class="h-full w-full object-cover" alt="Avatar" />
          </div>
        </div>
        <div class="text-3xl font-bold text-primary p-4">{{ group.name }}</div>
      </div>
      <router-link
        :to="`/groups/update/${group.id}`"
        class="w-fit flex justify-center items-center"
      >
        <div
          v-if="isAdmin"
          class="border w-fit text-sm text-white bg-primaryTailwind hover:bg-primaryHover shadow rounded-lg px-2 py-1 font-bold w-11/12 flex justify-between items-center rounded cursor-pointer"
        >
          <v-icon color="white" class="mr-2">mdi-pencil</v-icon>
          <div>Modifier le groupe</div>
        </div>
      </router-link>
    </div>

    <div class="w-full h-5/6 flex justify-between">
      <div class="w-7/12 h-full flex flex-col justify-between mr-2">
        <div
          ref="messageContainerRef"
          class="w-full h-full p-10 rounded-2xl bg-white shadow overflow-auto"
        >
          <div
            class="w-full mb-2"
            v-if="messages.length !== 0"
            v-for="message in messages"
            :key="message.id"
          >
            <TheMessage :message="message" :user="me" />
          </div>
          <div class="w-full mb-2 text-gray-400 italic" v-else>Il n'y a aucun message</div>
        </div>
        <div class="w-full h-1/6 flex flex-col justify-end">
          <form
            @submit.prevent="sendMessage"
            class="w-full h-5/6 rounded-2xl bg-white shadow flex justify-between items-center"
          >
            <input
              v-model="newMessage.value"
              type="text"
              class="w-10/12 h-full p-4"
              placeholder="Votre message..."
            />
            <v-icon
              class="w-1/12 h-full rounded-2xl cursor-pointer hover:bg-gray-100"
              color="primary"
              >mdi-attachment</v-icon
            >
            <button type="submit" class="w-1/12 h-full">
              <v-icon
                class="w-full h-full rounded-2xl cursor-pointer hover:bg-gray-100"
                color="primary"
                >mdi-send-circle</v-icon
              >
            </button>
          </form>
        </div>
      </div>

      <div class="w-5/12 h-full flex flex-col">
        <div
          class="w-full mb-2 ml-2 p-4 border shadow bg-white flex flex-col"
          :class="{
            'h-1/2': isAdmin,
            'h-full': !isAdmin
          }"
        >
          <div class="text-primary text-xl font-bold mb-4">Membres :</div>
          <div class="overflow-auto flex flex-col w-full h-full items-center">
            <div
              v-for="member in group.members"
              :key="member.id"
              class="w-full bg-primaryTailwind rounded shadow p-2 text-white flex justify-between items-center mb-2 text-xs"
            >
              <div class="w-10/12 flex items-center truncate">
                <v-avatar class="mr-2">
                  <img :src="member.avatar" alt="Avatar" />
                </v-avatar>
                <div>{{ member.username }}</div>
                <div v-if="checkIfAdmin(member)" class="text-gray-300 italic ml-1">
                  - administrateur
                </div>
              </div>
              <v-menu>
                <template v-slot:activator="{ props }">
                  <v-btn color="primary" v-bind="props"
                    ><v-icon color="white">mdi-dots-horizontal</v-icon></v-btn
                  >
                </template>
                <v-list>
                  <div v-for="(item, index) in memberItems" :key="index">
                    <v-list-item
                      @click="itemActions(item.action, member)"
                      v-if="item.disableType === 'admin' && isAdmin && !checkIfAdmin(member)"
                      :value="index"
                    >
                      <v-list-item-title class="flex items-center">
                        <v-icon class="mr-1" :color="item.color">{{ item.icon }}</v-icon
                        >{{ item.title }}</v-list-item-title
                      >
                    </v-list-item>
                    <v-list-item
                      @click="itemActions(item.action, member)"
                      v-else-if="!item.disableType"
                      :value="index"
                    >
                      <v-list-item-title class="flex items-center">
                        <v-icon class="mr-1" :color="item.color">{{ item.icon }}</v-icon
                        >{{ item.title }}</v-list-item-title
                      >
                    </v-list-item>
                  </div>
                </v-list>
              </v-menu>
            </div>
          </div>
        </div>
        <div v-if="isAdmin" class="w-full h-1/2 ml-2 p-4 border shadow bg-white flex flex-col">
          <div class="text-secondary text-xl font-bold mb-4">Demandes en attentes :</div>
          <div class="overflow-auto flex flex-col w-full h-full items-center">
            <div
              v-for="member in group.memberJoinRequests"
              :key="member.id"
              class="w-full bg-secondaryTailwind rounded shadow p-2 text-white flex justify-between items-center mb-2 text-xs"
            >
              <div class="w-full flex items-center truncate">
                <v-avatar class="mr-2">
                  <img :src="member.avatar" alt="Avatar" />
                </v-avatar>
                <div>{{ member.username }}</div>
              </div>
              <v-menu>
                <template v-slot:activator="{ props }">
                  <v-btn color="secondary" v-bind="props"
                    ><v-icon color="white">mdi-dots-horizontal</v-icon></v-btn
                  >
                </template>
                <v-list>
                  <div v-for="(item, index) in memberJoinRequestItems" :key="index">
                    <v-list-item @click="itemActions(item.action, member)" :value="index">
                      <v-list-item-title class="flex items-center">
                        <v-icon class="mr-1" :color="item.color">{{ item.icon }}</v-icon
                        >{{ item.title }}</v-list-item-title
                      >
                    </v-list-item>
                  </div>
                </v-list>
              </v-menu>
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
      <div class="w-fit bg-white rounded flex flex-col items-center p-4">
        <div class="mb-4 font-bold text-primary text-center">Utilisateur :</div>
        <div
          class="w-full bg-primaryTailwind rounded shadow p-2 text-white flex justify-between items-center mb-2 text-xs"
        >
          <div class="w-full flex items-center">
            <v-avatar class="mr-2">
              <img :src="currentUser?.avatar" alt="Avatar" />
            </v-avatar>
            <div class="truncate">{{ currentUser?.username }}</div>
          </div>
        </div>

        <div class="mb-4 mt-2 font-bold text-primary text-center">Actions :</div>

        <div class="w-full mb-2 flex items-center justify-center">
          <button
            @click="isModalOpen = false"
            type="button"
            class="p-2 w-1/2 font-bold bg-gray-300 rounded shadow mr-1"
          >
            Retour
          </button>
          <button
            @click="userActions('removeUser', currentUser)"
            type="button"
            class="p-2 w-1/2 font-bold text-white bg-red-600 rounded shadow ml-1"
          >
            Exclure
          </button>
        </div>
        <button
          @click="userActions('adminUser', currentUser)"
          type="button"
          class="p-2 font-bold text-white bg-primaryTailwind rounded shadow"
        >
          Définir en tant qu'Administrateur du groupe
        </button>
      </div>
    </div>
  </Teleport>
</template>
