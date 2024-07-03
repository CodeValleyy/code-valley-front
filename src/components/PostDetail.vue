<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-btn icon @click="goBack" class="mb-4">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <LoadingSpinner v-if="isLoading" />
        <v-card v-if="post">
          <v-card-title>
            <router-link :to="`/profile/${post.username}`">
              <v-avatar>
                <img :src="post.avatar || 'https://via.placeholder.com/40'" alt="User Avatar" />
              </v-avatar>
            </router-link>
            <router-link :to="`/profile/${post.username}`">
              <span class="ml-3">{{ post.username }}</span>
            </router-link>
            <v-spacer></v-spacer>
            <v-btn icon @click="confirmDelete(post)" v-if="post.isOwner">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-subtitle>
            {{ new Date(post.createdAt).toLocaleDateString('fr-FR') }}
          </v-card-subtitle>
          <v-card-text>{{ post.content }}</v-card-text>
          <CodeMirror
            v-if="codeMirrorValue"
            v-model="codeMirrorValue"
            :extensions="[lang(post.code_language ?? 'plaintext')]"
            :height="'300px'"
            basic
            disabled
            class="mb-4"
          />
          <v-card-actions class="ml-4">
            <v-btn icon @click="toggleLike(post)">
              <v-icon>{{ post.userHasLiked ? 'mdi-thumb-down' : 'mdi-thumb-up' }}</v-icon>
              <span class="ml-2">{{ post.likes }} likes</span>
            </v-btn>
            <v-btn class="ml-8" icon @click="showCommentInput = true">
              <v-icon>mdi-comment</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
        <v-divider class="my-4"></v-divider>
        <div v-if="showCommentInput" class="d-flex align-center">
          <v-text-field
            v-model="newComment"
            label="Write a comment..."
            class="flex-grow-1"
          ></v-text-field>
          <v-btn @click="postComment" color="primary">Post</v-btn>
        </div>
        <v-list>
          <v-list-item v-for="comment in comments" :key="comment.id">
            <router-link :to="`/profile/${comment.username}`">
              <v-list-item-avatar>
                <v-avatar>
                  <img
                    :src="comment.avatar || 'https://via.placeholder.com/40'"
                    alt="User Avatar"
                  />
                </v-avatar>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>{{ comment.username }}</v-list-item-title>
                <v-list-item-subtitle>{{ comment.content }}</v-list-item-subtitle>
              </v-list-item-content>
            </router-link>
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-title class="headline">Confirmer la suppression</v-card-title>
        <v-card-text>Voulez-vous vraiment supprimer ce post ?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text="Annuler" @click="deleteDialog = false">Annuler</v-btn>
          <v-btn color="red darken-1" text="Supprimer" @click="deletePost">Supprimer</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePostStore } from '@/stores/usePostStore'
import type { Post } from '@/types'
import { useAuth } from '@/composables/useAuth'
import CodeMirror from 'vue-codemirror6'
import { python } from '@codemirror/lang-python'
import { rust } from '@codemirror/lang-rust'
import { javascript } from '@codemirror/lang-javascript'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const { fetchMe } = useAuth()

const route = useRoute()
const router = useRouter()
const postStore = usePostStore()
const post = ref<Post | null>(null)
const isLoading = ref(false)
const showCommentInput = ref(false)
const newComment = ref('')
const deleteDialog = ref(false)
const postToDelete = ref<Post | null>(null)
const me = await fetchMe()

// TODO delete it later
const comments = ref([
  {
    id: 1,
    username: 'Alice',
    content: 'Great post!',
    avatar: 'https://via.placeholder.com/40'
  },
  {
    id: 2,
    username: 'Bob',
    content: 'I agree!',
    avatar: 'https://via.placeholder.com/40'
  }
])

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

const codeMirrorValue = ref<string>('')
const fetchPost = async () => {
  isLoading.value = true
  const postId = Number(route.params.id)
  post.value = await postStore.fetchPost(postId)
  if (post.value) {
    post.value.isOwner = post.value.userId === me.id
    codeMirrorValue.value = typeof post.value.code === 'string' ? post.value.code : ''
  }
  isLoading.value = false
}

onMounted(async () => {
  isLoading.value = true
  await fetchPost()
  isLoading.value = false
})

const toggleLike = async (post: Post) => {
  if (post.userHasLiked) {
    await postStore.unlikePost(post.id)
  } else {
    await postStore.likePost(post.id)
  }
}

const postComment = () => {
  if (newComment.value.trim()) {
    comments.value.push({
      id: me.id,
      username: me.username,
      content: newComment.value,
      avatar: me.avatar
    })
    newComment.value = ''
    showCommentInput.value = false
  }
}

const confirmDelete = (post: Post) => {
  postToDelete.value = post
  deleteDialog.value = true
}

const deletePost = async () => {
  if (postToDelete.value) {
    await postStore.deletePost(postToDelete.value.id)
    deleteDialog.value = false
  }
}

const goBack = () => {
  router.back()
}
</script>

<style scoped>
.v-card {
  padding: 16px;
}

.v-card-title {
  display: flex;
  align-items: center;
}

.ml-3 {
  margin-left: 16px;
}
</style>
