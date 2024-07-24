<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="8">
        <PostComposer />
        <v-divider class="my-4"></v-divider>
        <v-list>
          <LoadingSpinner v-if="loading" />
          <template v-for="(post, index) in posts" :key="post.id">
            <v-list-item class="post-item" @click="viewPost(post.id)">
              <v-list-item-avatar>
                <router-link :to="`/profile/${post.username}`">
                  <v-avatar>
                    <img :src="post.avatar ? post.avatar : DEFAULT_AVATAR" alt="User Avatar" />
                  </v-avatar>
                </router-link>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title class="post-username">
                  <router-link :to="`/profile/${post.username}`" class="username-link">
                    {{ post.username }}
                  </router-link>
                  - {{ formatCreatedAt(new Date(post.createdAt)) }}
                </v-list-item-title>
                <v-chip
                  v-if="post.code_language"
                  :color="getLanguageColor(post.code_language)"
                  class="mb-4"
                  >{{ post.code_language }}</v-chip
                >
                <v-chip
                  v-if="post.output_type"
                  :color="getLanguageColor(post.output_type.split('.')[1])"
                  class="mb-4 ml-2"
                  >{{ post.output_type.split('.')[1] }}
                </v-chip>
                <v-list-item-subtitle class="post-content">{{ post.content }}</v-list-item-subtitle>
                <CodeMirror
                  v-if="post.code"
                  v-model="post.code"
                  basic
                  disabled
                  :extensions="[lang(post.code_language ?? 'plaintext')]"
                  height="300px"
                  class="mb-4"
                />
              </v-list-item-content>
              <span>{{ post.likes }} likes</span>
              <v-list-item-action>
                <v-btn
                  icon
                  @click.stop="toggleLike(post)"
                  :class="{ liked: post.userHasLiked }"
                  class="mr-2 text-xs"
                  size="25"
                >
                  <v-icon class="small-icon">
                    {{ post.userHasLiked ? 'mdi-thumb-up' : 'mdi-thumb-up-outline' }}
                  </v-icon>
                </v-btn>
                <v-btn icon @click.stop="commentOnPost(post.id)" class="mr-2 text-xs" size="25">
                  <v-icon class="small-icon">mdi-comment</v-icon>
                </v-btn>
                <v-btn
                  icon
                  @click.stop="redirectToCodeView(post)"
                  class="mr-2 text-xs"
                  size="25"
                  v-if="post.code"
                >
                  <v-icon class="small-icon">mdi-code-tags</v-icon>
                </v-btn>

                <v-btn icon @click.stop="confirmDelete(post)" class="mr-2 text-xs" size="25">
                  <v-icon class="small-icon">mdi-delete</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
            <v-divider
              v-if="!isLastItem(index)"
              :key="`divider-${index}`"
              class="post-divider"
            ></v-divider>
          </template>
        </v-list>
        <div class="pagination-buttons">
          <v-btn @click="previousPage" :disabled="offset === 0">Précédent</v-btn>
          <v-btn @click="nextPage" :disabled="posts.length < limit">Suivant</v-btn>
        </div>
      </v-col>
      <v-col cols="12" md="4">
        <FriendSuggestions />
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
import { ref, onMounted, watch, type Ref } from 'vue'
import { useRouter } from 'vue-router'
import { usePostStore } from '@/stores/usePostStore'
import { useAuth } from '@/composables/useAuth'
import PostComposer from '@/components/PostComposer.vue'
import FriendSuggestions from '@/components/FriendSuggestions.vue'
import type { Post } from '@/types'
import CodeMirror from 'vue-codemirror6'
import { python } from '@codemirror/lang-python'
import { rust } from '@codemirror/lang-rust'
import { javascript } from '@codemirror/lang-javascript'
import type LoadingSpinner from '@/components/LoadingSpinner.vue'
import { getLanguageColor } from '@/config/languagesConfig'
import { formatCreatedAt } from '@/utils/date-utils'
import { DEFAULT_AVATAR } from '@/config/constants'

const router = useRouter()
const postStore = usePostStore()
const posts: Ref<Post[]> = ref([])
const deleteDialog = ref(false)
const postToDelete = ref<Post | null>(null)
const { fetchMe } = useAuth()
const loading = ref(false)

const me = await fetchMe()

const limit = ref(3)
const offset = ref(0)

const fetchPosts = async () => {
  loading.value = true
  await postStore.fetchPosts({ limit: limit.value, offset: offset.value })
  posts.value = postStore.posts.map((post: Post) => ({
    ...post,
    isOwner: post.userId === me.id
  }))
  loading.value = false
}

onMounted(fetchPosts)

watch(
  () => postStore.posts,
  (newPosts) => {
    posts.value = newPosts.map((post: Post) => ({
      ...post,
      isOwner: post.userId === me.id
    }))
  },
  { deep: true }
)

const isLastItem = (index: number) => {
  return index === posts.value.length - 1
}

const toggleLike = async (post: Post) => {
  if (post.userHasLiked) {
    await postStore.unlikePost(post.id)
  } else {
    await postStore.likePost(post.id)
  }
}

const commentOnPost = (postId: number) => {
  router.push({ name: 'PostDetail', params: { id: postId }, query: { showComment: 'true' } })
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

const viewPost = (postId: number) => {
  router.push({ name: 'PostDetail', params: { id: postId } })
}

const redirectToCodeView = (post: Post) => {
  const code = post.code ? String(post.code) : ''
  const language = post.code_language ? String(post.code_language) : ''
  const outputType = post.output_type ? String(post.output_type) : ''
  router.push({ name: 'code', query: { code, language, outputType } })
}

const nextPage = () => {
  offset.value += limit.value
  fetchPosts()
}

const previousPage = () => {
  if (offset.value > 0) {
    offset.value -= limit.value
    fetchPosts()
  }
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

.action-btn {
  margin-right: 8px;
}

.small-icon {
  font-size: 18px;
}

.username-link {
  text-decoration: none;
  color: inherit;
}
</style>
