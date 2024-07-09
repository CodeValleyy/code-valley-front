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
import { type Notification, NotificationType } from '@/types/Notification'
import { ref } from 'vue'

const notificationStore = useNotification()

const isLoading = ref(true)
const limit = ref(10)
const notifications = ref([] as Notification[])
const notificationCount = ref(-1)

// Frontend functions
const notificationCountMessage = () => {
  if (notificationCount.value === -1) {
    return "Loading...";
  }
  else if (notificationCount.value === 0) {
    return "No new notifications";
  }
  else if (notificationCount.value === 1) {
    return "1 new notification";
  }
  else {
    return notificationCount.value + " new notifications";
  }
}

const message = (notification: Notification) => {
  switch(notification.notificationType) {
    case NotificationType.friendshipAccepted:
      return notification.fromUsername + " is now your friend!";
    case NotificationType.friendshipReceived:
      return notification.fromUsername + " has send you a new friend request!";
    case NotificationType.friendshipRefused:
      return notification.fromUsername + " has refused your friend request...";
    case NotificationType.like:
      return notification.fromUsername + " liked your post!";
    case NotificationType.post:
      return "Check out " + notification.fromUsername + "'s new post!";
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
