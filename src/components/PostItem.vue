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
      <CodeMirror
        v-if="codeMirrorValue"
        v-model="codeMirrorValue"
        :extensions="[lang(post.code_language ?? 'plaintext')]"
        :height="'300px'"
        basic
        disabled
        class="mb-4"
      />
    </v-list-item-content>
    <span>{{ likes }} likes</span>
    <v-list-item-action>
      <v-btn
        icon
        @click="toggleLike"
        :class="{ liked: userHasLiked }"
        class="mr-2 text-xs"
        size="25"
      >
        <v-icon class="small-icon">
          {{ userHasLiked ? 'mdi-thumb-down' : 'mdi-thumb-up' }}
        </v-icon>
      </v-btn>
      <v-btn icon @click="commentOnPost" class="mr-2 text-xs" size="25">
        <v-icon class="small-icon">mdi-comment</v-icon>
      </v-btn>
      <v-btn icon @click="confirmDelete" class="mr-2 text-xs" size="25" v-if="post.userId == me.id">
        <v-icon class="small-icon">mdi-delete</v-icon>
      </v-btn>
    </v-list-item-action>
  </v-list-item>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref, watch } from 'vue'
import { usePostStore } from '@/stores/usePostStore'
import type { Post } from '@/types'
import CodeMirror from 'vue-codemirror6'
import { python } from '@codemirror/lang-python'
import { rust } from '@codemirror/lang-rust'
import { javascript } from '@codemirror/lang-javascript'
import { useUserStore } from '@/stores/useUserStore'
const props = defineProps<{ post: Post }>()
const emits = defineEmits(['refreshPosts', 'deletePost'])

const postStore = usePostStore()

const userStore = useUserStore()
const me = !userStore.user ? await userStore.fetchUserProfile() : userStore.user

const lang = (codeLanguage: string) => {
  switch (codeLanguage) {
    case 'python':
      return python()
    case 'rust':
      return rust()
    case 'javascript':
      return javascript()
    default:
      return python()
  }
}

const userHasLiked = ref(props.post.userHasLiked)
const likes = ref(props.post.likes)
const codeMirrorValue = ref(props.post.code)

watch(
  () => props.post.userHasLiked,
  (newVal) => {
    userHasLiked.value = newVal
  }
)

watch(
  () => props.post.likes,
  (newVal) => {
    likes.value = newVal
  }
)

watch(
  () => props.post.code,
  (newVal) => {
    codeMirrorValue.value = newVal
  }
)

const toggleLike = async () => {
  try {
    if (userHasLiked.value) {
      await postStore.unlikePost(props.post.id)
      likes.value -= 1
    } else {
      await postStore.likePost(props.post.id)
      likes.value += 1
    }
    userHasLiked.value = !userHasLiked.value
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
