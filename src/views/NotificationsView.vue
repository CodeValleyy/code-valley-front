<template>
  <v-container class="h-screen">
    <div class="text-3xl font-bold text-primary">Notifications</div>
    <b class="mb-15">{{ notificationCountMessage() }}</b>
    <LoadingSpinner v-if="isLoading" />
    <div v-else v-for="notification in notifications" :key="notification.id">
      <div class="mt-2 p-4 border rounded shadow-lg cursor"
           :class="{
              'text-gray-500 bg-gray-200': notification.hasBeenRead,
              'text-black bg-white': !notification.hasBeenRead
            }"
           @click="seeNotification(notification)"
      >
        <div class="flex justify-between">
          <div>
            <p :class="{ 'font-bold': !notification.hasBeenRead }">{{ message(notification) }}</p>
            <div v-if="notification.notificationType === NotificationType.friendshipReceived" class="mt-2 mb-2">
              <v-btn @click="friendshipStore.acceptFriendRequest(notification.fromUserId)">Accepter</v-btn>
              <v-btn class="ml-3" @click="friendshipStore.declineFriendRequest(notification.fromUserId)">Refuser</v-btn>
            </div>
            <p class="text-xs text-gray-400">{{ formatDate(notification.createdAt) }}</p>
          </div>
          <v-menu>
            <template v-slot:activator="{ props }">
              <v-btn v-bind="props">
                <v-icon color="white">mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="removeNotification(notification)">
                <v-list-item-title class="flex items-center text-red-500 text-xs">Supprimer</v-list-item-title>
              </v-list-item>
              <v-list-item v-if="notification.hasBeenRead" @click="unseeNotification(notification)">
                <v-list-item-title class="flex items-center text-blue-500 text-xs">Marquer comme non lu</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
      </div>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import { useNotification } from '@/stores/useNotification'
import { useFriendshipStore } from '@/stores/useFriendshipStore'
import { type Notification, NotificationType } from '@/types/Notification'
import { ref } from 'vue'

const notificationStore = useNotification()
const friendshipStore = useFriendshipStore()

const isLoading = ref(true)
const limit = ref(10)
const notifications = ref([] as Notification[])
const notificationCount = ref(-1)

// Frontend functions
const notificationCountMessage = () => {
  if (notificationCount.value === -1) {
    return "Chargement...";
  }
  else if (notificationCount.value === 0) {
    return "Pas de nouvelle notification";
  }
  else if (notificationCount.value === 1) {
    return "1 notification non lu";
  }
  else {
    return notificationCount.value + " notifications non lues";
  }
}

const message = (notification: Notification) => {
  switch(notification.notificationType) {
    case NotificationType.friendshipAccepted:
      return notification.fromUsername + " est maintenant ton ami!";
    case NotificationType.friendshipReceived:
      return notification.fromUsername + " t'as envoyé une demande d'ami!";
    case NotificationType.friendshipRefused:
      return notification.fromUsername + " a refusé ta demande d'ami...";
    case NotificationType.like:
      return notification.fromUsername + " a aimé ton post!";
    case NotificationType.post:
      return "Jette un coup d'œil au nouveau post de " + notification.fromUsername + " !";
  }
}

const formatDate = (dateString: Date) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' } as const
  return new Date(dateString).toLocaleDateString('fr-FR', options)
}

// API calls
const fetchNotifications = async () => {
  isLoading.value = true
  let result = await notificationStore.fetchNotifications(limit.value);
  if (result != null) {
    result = result.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ) as Notification[]
    notifications.value = result;
  }
  isLoading.value = false
}
fetchNotifications()

const fetchNotificationCount = async () => {
  const result = await notificationStore.fetchNotificationCount();
  if (result != null) {
    notificationCount.value = result;
  }
}
fetchNotificationCount()

const seeNotification = async (notification: Notification) => {
  if (notification.hasBeenRead) {
    return;
  }
  notification.hasBeenRead = true;
  const isSuccessful = await notificationStore.seeNotification(notification.id);
  if (isSuccessful) {
    notificationCount.value -= 1;
  }
  else {
    notification.hasBeenRead = false;
  }
}

const unseeNotification = async (notification: Notification) => {
  if (!notification.hasBeenRead) {
    return;
  }
  notification.hasBeenRead = false;
  const isSuccessful = await notificationStore.unseeNotification(notification.id);
  if (isSuccessful) {
    notificationCount.value += 1;
  }
  else {
    notification.hasBeenRead = true;
  }
}

const removeNotification = async (notification: Notification) => {
  isLoading.value = true;
  const isSuccessful = await notificationStore.removeNotification(notification.id);
  if (isSuccessful) {
    const index = notifications.value.indexOf(notification);
    notifications.value.splice(index, 1);
  }
  isLoading.value = false;
}
</script>
