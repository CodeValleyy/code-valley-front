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
            {{ formatCreatedAt(new Date(post.createdAt)) }}
          </v-card-subtitle>
          <v-chip
            v-if="post.code_language"
            :color="getLanguageColor(post.code_language)"
            class="mt-2"
            >{{ post.code_language }}</v-chip
          >
          <v-chip
            v-if="post.output_type"
            :color="getLanguageColor(post.output_type.split('.')[1])"
            class="ml-2 mt-2"
            >{{ post.output_type.split('.')[1] }}
          </v-chip>
          <v-card-text>{{ post.content }}</v-card-text>
          <CodeMirror
            v-if="codeMirrorValue"
            v-model="codeMirrorValue"
            :extensions="[getCodeMirrorModes(post.code_language ?? 'plaintext')]"
            :height="'300px'"
            basic
            disabled
            class="mb-4"
          />
          <v-card-actions class="ml-4">
            <v-btn @click="toggleLike(post)">
              <v-icon>{{ hasLiked ? 'mdi-thumb-up' : 'mdi-thumb-up-outline' }}</v-icon>
              <span class="ml-2">{{ likeCount }} likes</span>
            </v-btn>
            <v-btn class="ml-8" @click="showCommentInput = true">
              <v-icon>mdi-comment</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
        <v-divider class="my-4"></v-divider>
        <div v-if="showCommentInput || showComment" class="d-flex align-center">
          <v-text-field
            v-model="newComment"
            label="Write a comment..."
            class="flex-grow-1"
          ></v-text-field>
          <v-btn @click="postComment" color="primary">Post</v-btn>
        </div>
        <v-list>
          <v-row justify="center" class="mt-4 button-row">
            <v-btn
              @click="loadPreviousComments"
              :disabled="offset <= 0"
              color="primary"
              class="mx-2"
              >Previous</v-btn
            >
            <v-btn
              @click="loadNextComments"
              :disabled="comments.length < limit"
              color="primary"
              class="mx-2"
              >Next</v-btn
            >
          </v-row>
          <v-list-item v-for="comment in comments" :key="comment.id" class="comment-item">
            <router-link :to="`/profile/${comment.username}`">
              <v-list-item-avatar>
                <v-avatar>
                  <img
                    :src="comment.avatar || 'https://via.placeholder.com/40'"
                    alt="User Avatar"
                  />
                </v-avatar>
              </v-list-item-avatar>
            </router-link>
            <v-list-item-content>
              <v-list-item-subtitle class="text-caption">{{
                formatCreatedAt(new Date(comment.createdAt))
              }}</v-list-item-subtitle>
              <v-list-item-title>{{ comment.username }}</v-list-item-title>
              <v-list-item-subtitle>{{ comment.content }}</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn
                icon
                @click="postDeleteComment(comment.id)"
                class="delete-comment-btn"
                size="30"
                v-if="comment.userId === me.id"
              >
                <v-icon color="red" small>mdi-delete</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
          <div v-if="loading" class="d-flex justify-center">
            <LoadingSpinner />
          </div>
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
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePostStore } from '@/stores/usePostStore'
import { useCommentStore } from '@/stores/useCommentStore'
import type { Post } from '@/types'
import { useAuth } from '@/composables/useAuth'
import CodeMirror from 'vue-codemirror6'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import { formatCreatedAt } from '@/utils/date-utils'
import { getCodeMirrorModes } from '@/config/languagesConfig'
import { getLanguageColor } from '@/config/languagesConfig'

const { fetchMe } = useAuth()

const route = useRoute()
const router = useRouter()
const postStore = usePostStore()
const commentStore = useCommentStore()
const post = ref<Post | null>(null)
const isLoading = ref(false)
const showCommentInput = ref(false)
const newComment = ref('')
const deleteDialog = ref(false)
const postToDelete = ref<Post | null>(null)
const me = await fetchMe()
const hasLiked = ref(false)
const likeCount = ref(0)

const comments = ref(commentStore.comments)
const loading = ref(commentStore.loading)
const limit = ref(commentStore.limit)
const offset = ref(commentStore.offset)

const showComment = route.query.showComment === 'true'

watch(
  () => commentStore.comments,
  (newComments) => {
    comments.value = newComments
  }
)

const codeMirrorValue = ref<string>('')
const fetchPost = async () => {
  isLoading.value = true
  const postId = Number(route.params.id)
  post.value = await postStore.fetchPost(postId)
  if (post.value) {
    post.value.isOwner = post.value.userId === me.id
    codeMirrorValue.value = typeof post.value.code === 'string' ? post.value.code : ''
  }
  hasLiked.value = post.value?.userHasLiked
  likeCount.value = post.value?.likes ?? 0
  isLoading.value = false
}

const loadComments = async (reset: boolean = false) => {
  await commentStore.fetchComments(post.value!.id, reset)
}

const loadPreviousComments = async () => {
  if (offset.value > 0) {
    offset.value -= limit.value
    commentStore.offset = offset.value
    await loadComments(true)
  }
}

const loadNextComments = async () => {
  if (comments.value.length >= limit.value) {
    offset.value += limit.value
    commentStore.offset = offset.value
    await loadComments(true)
  }
}

onMounted(async () => {
  isLoading.value = true
  await fetchPost()
  await loadComments(true)
  if (showComment) {
    showCommentInput.value = true
  }
  isLoading.value = false
})

const toggleLike = async (post: Post) => {
  if (hasLiked.value) {
    await postStore.unlikePost(post.id)
    likeCount.value -= 1
  } else {
    await postStore.likePost(post.id)
    likeCount.value += 1
  }
  hasLiked.value = !hasLiked.value
}

const postComment = async () => {
  if (newComment.value.trim()) {
    await commentStore.createComment(post.value!.id, { content: newComment.value })
    newComment.value = ''
    showCommentInput.value = false
  }
}

const postDeleteComment = async (commentId: number) => {
  await commentStore.deleteComment(post.value!.id, commentId)
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

.comment-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 8px;
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 8px;
}
</style>
