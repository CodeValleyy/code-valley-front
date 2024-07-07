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

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const { fetchMe } = useAuth()
const groupId = route.params.id

const { getOneWithId } = useGroup()
const { getMessagesWithGroupId, createMessage } = useMessage()

const group = ref<GroupResponse>(await getOneWithId(String(groupId)))
const messages = ref<MessageResponse[]>(await getMessagesWithGroupId(String(groupId)))

const me: User = (await userStore.user) || (await fetchMe())

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
  return 'https://yt3.googleusercontent.com/Pjk-KU0aJH978tDhdO05PgUx8j3i1OvqC4-U0L_3EUdJo0eBUrQ-cb1g2ZJiTYTlk5pq_0gy=s900-c-k-c0x00ffffff-no-rj'
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

  onUnmounted(() => {
    clearInterval(intervalId)
  })
})
</script>

<template>
  <v-container class="h-screen">
    <div class="w-full flex justify-between">
      <div class="flex">
        <div class="p-4">
          <v-avatar>
            <img :src="getAvatar()" alt="Avatar" />
          </v-avatar>
        </div>
        <div class="text-3xl font-bold text-primary p-4">{{ group.name }}</div>
      </div>
      <router-link
        :to="`/groups/update/${group.id}`"
        class="w-fit flex justify-center items-center"
      >
        <div
          class="border w-fit text-sm text-white bg-primaryTailwind hover:bg-primaryHover shadow rounded-lg px-2 py-1 font-bold w-11/12 flex justify-between items-center rounded cursor-pointer"
        >
          <v-icon color="white" class="mr-2">mdi-pencil</v-icon>
          <div>Modifier le groupe</div>
        </div>
      </router-link>
    </div>

    <div class="w-full h-5/6 flex justify-between">
      <div class="w-3/4 h-full flex flex-col justify-between mr-2">
        <div
          ref="messageContainerRef"
          class="w-full h-5/6 p-10 rounded-2xl bg-white shadow overflow-auto"
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
            class="w-full h-4/6 rounded-2xl bg-white shadow flex justify-between items-center"
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
