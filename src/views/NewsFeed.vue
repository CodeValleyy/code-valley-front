<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="8">
        <PostComposer />
        <v-divider class="my-4"></v-divider>
        <v-list>
          <v-list-item v-for="(post, index) in posts" :key="post.id" class="post-item">
            <v-list-item-avatar>
              <v-avatar>
                <img :src="post.avatar || 'https://via.placeholder.com/40'" alt="User Avatar" />
              </v-avatar>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title class="post-username"
                >{{ post.username }} - {{ formatDate(post.createdAt) }}</v-list-item-title
              >
              <v-list-item-subtitle class="post-content">{{ post.content }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-divider
            v-if="!isLastItem(index)"
            v-for="(post, index) in posts"
            :key="`divider-${index}`"
            class="post-divider"
          ></v-divider>
        </v-list>
      </v-col>
      <v-col cols="12" md="4">
        <FriendSuggestions />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { usePostStore } from '@/stores/usePostStore'
import PostComposer from '@/components/PostComposer.vue'
import FriendSuggestions from '@/components/FriendSuggestions.vue'

const postStore = usePostStore()
const posts = ref([])

const fetchPosts = async () => {
  await postStore.fetchPosts()
  posts.value = postStore.posts
}

onMounted(fetchPosts)

watch(
  () => postStore.posts,
  (newPosts) => {
    posts.value = newPosts
  },
  { deep: true }
)

const isLastItem = (index: number) => {
  return index === posts.value.length - 1
}

const formatDate = (dateString: string) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('fr-FR', options)
}
</script>

<style scoped>
.post-item {
  border-bottom: 1px solid #e0e0e0;
  padding: 16px 0;
}

.post-username {
  font-weight: bold;
}

.post-content {
  color: #555;
}

.post-divider {
  margin: 0;
}

.v-list-item-avatar {
  margin-right: 16px;
}
</style>
