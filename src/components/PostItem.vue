<template>
  <v-list-item class="post-item">
    <v-list-item-avatar>
      <v-avatar>
        <img :src="post.avatar || 'https://via.placeholder.com/40'" alt="User Avatar" />
      </v-avatar>
    </v-list-item-avatar>
    <v-list-item-content>
      <v-list-item-title class="post-username">
        {{ post.username }} - {{ new Date(post.createdAt).toLocaleDateString('fr-FR') }}
      </v-list-item-title>
      <v-list-item-subtitle class="post-content">{{ post.content }}</v-list-item-subtitle>
    </v-list-item-content>
    <span>{{ post.likes }} likes</span>
    <v-list-item-action>
      <v-btn
        icon
        @click="toggleLike"
        :class="{ liked: post.userHasLiked }"
        class="mr-2 text-xs"
        size="25"
      >
        <v-icon class="small-icon">
          {{ post.userHasLiked ? 'mdi-thumb-down' : 'mdi-thumb-up' }}
        </v-icon>
      </v-btn>
      <v-btn icon @click="commentOnPost" class="mr-2 text-xs" size="25">
        <v-icon class="small-icon">mdi-comment</v-icon>
      </v-btn>
      <v-btn icon @click="confirmDelete" class="mr-2 text-xs" size="25">
        <v-icon class="small-icon">mdi-delete</v-icon>
      </v-btn>
    </v-list-item-action>
  </v-list-item>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import { usePostStore } from '@/stores/usePostStore'
import type { Post } from '@/types'

const props = defineProps<{ post: Post }>()
const emits = defineEmits(['refreshPosts', 'deletePost'])

const postStore = usePostStore()

const toggleLike = async () => {
  try {
    if (props.post.userHasLiked) {
      await postStore.unlikePost(props.post.id)
    } else {
      await postStore.likePost(props.post.id)
    }
    emits('refreshPosts')
  } catch (error) {
    console.error('Error toggling like:', error)
  }
}

const commentOnPost = () => {
  console.log(`Comment on post ${props.post.id}`)
}

const confirmDelete = () => {
  emits('deletePost', props.post)
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
.liked .small-icon {
  color: red;
}
</style>
