<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="8">
        <PostComposer @new-post="fetchPosts" />
        <v-divider class="my-4"></v-divider>
        <v-list>
          <v-list-item v-for="post in posts" :key="post.id">
            <v-list-item-content>
              <v-list-item-title>{{ post.user.username }}</v-list-item-title>
              <v-list-item-subtitle>{{ post.content }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-col>
      <v-col cols="12" md="4">
        <FriendSuggestions />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import PostComposer from '@/components/PostComposer.vue'
import FriendSuggestions from '@/components/FriendSuggestions.vue'
import { useAuth } from '@/composables/useAuth'

const { getToken } = useAuth()
const posts = ref([])

const fetchPosts = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_APP_USER_MANAGEMENT_URL}/posts`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    })
    posts.value = response.data
  } catch (error) {
    console.error('Error fetching posts:', error)
  }
}

onMounted(fetchPosts)
</script>
