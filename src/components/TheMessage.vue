<script setup lang="ts">
import type { User } from '@/types'
import type { Message } from '@/types/Message'
import type { MessageResponse } from '@/types/MessageResponse'
import { format, isToday, isYesterday, subDays } from 'date-fns'
import { fr } from 'date-fns/locale'
import { ref } from 'vue'

const props = defineProps<{
  message: MessageResponse
  user?: User
}>()

const isAuthor = ref(props.user?.id === props.message.author.id ? true : false)

const formatCreatedAt = (createdAt: Date) => {
  if (isToday(createdAt)) {
    return format(createdAt, 'HH:mm', { locale: fr })
  } else if (isYesterday(createdAt)) {
    return `hier à ${format(createdAt, 'HH:mm', { locale: fr })}`
  } else if (createdAt > subDays(new Date(), 2)) {
    return `avant-hier à ${format(createdAt, 'HH:mm', { locale: fr })}`
  } else {
    return format(createdAt, 'EEEE d MMMM yyyy à HH:mm', { locale: fr })
  }
}
</script>

<template>
  <div v-if="!isAuthor" class="w-full">
    <div class="text-xs text-gray-400 mb-1">
      {{ user?.username }} - {{ formatCreatedAt(message.createdAt) }}
    </div>
    <div class="w-fit py-2 px-4 border rounded-lg">
      {{ message.value }}
    </div>
  </div>
  <div v-else class="w-full flex flex-col items-end">
    <div class="text-xs text-gray-400 mb-1">
      {{ formatCreatedAt(message.createdAt) }}
    </div>
    <div class="w-fit py-2 px-4 bg-primaryTailwind rounded-lg text-white">
      {{ message.value }}
    </div>
  </div>
</template>
