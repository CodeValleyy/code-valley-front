<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="8">
        <PostComposer />
        <v-divider class="my-4"></v-divider>
        <v-list>
          <template v-for="(post, index) in posts" :key="post.id">
            <v-list-item class="post-item">
              <v-list-item-avatar>
                <router-link :to="`/profile/${post.username}`">
                  <v-avatar>
                    <img :src="post.avatar || 'https://via.placeholder.com/40'" alt="User Avatar" />
                  </v-avatar>
                </router-link>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title class="post-username">
                  <router-link :to="`/profile/${post.username}`" class="username-link">
                    {{ post.username }}
                  </router-link>
                  - {{ formatDate(post.createdAt) }}
                </v-list-item-title>
                <v-list-item-subtitle class="post-content">{{ post.content }}</v-list-item-subtitle>
              </v-list-item-content>
              <span>{{ post.likes }} likes</span>
              <v-list-item-action>
                <v-btn
                  icon
                  @click="toggleLike(post)"
                  :class="{ liked: post.userHasLiked }"
                  class="mr-2 text-xs"
                  size="25"
                >
                  <v-icon class="small-icon">
                    {{ post.userHasLiked ? 'mdi-thumb-down' : 'mdi-thumb-up' }}
                  </v-icon>
                </v-btn>
                <v-btn icon @click="commentOnPost(post.id)" class="mr-2 text-xs" size="25">
                  <v-icon class="small-icon">mdi-comment</v-icon>
                </v-btn>
                <v-btn
                  v-if="post.isOwner"
                  icon
                  @click="confirmDelete(post)"
                  class="mr-2 text-xs"
                  size="25"
                >
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
import { usePostStore } from '@/stores/usePostStore'
import { useAuth } from '@/composables/useAuth'
import PostComposer from '@/components/PostComposer.vue'
import FriendSuggestions from '@/components/FriendSuggestions.vue'
import type { Post } from '@/types'

const postStore = usePostStore()
const posts: Ref<Post[]> = ref([])
const deleteDialog = ref(false)
const postToDelete = ref<Post | null>(null)
const { fetchMe } = useAuth()

const me = await fetchMe()

const fetchPosts = async () => {
  await postStore.fetchPosts()
  posts.value = postStore.posts.map((post: Post) => ({
    ...post,
    isOwner: post.userId === me.id
  }))
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

const formatDate = (dateString: Date) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' } as const
  return new Date(dateString).toLocaleDateString('fr-FR', options)
}

const toggleLike = async (post: Post) => {
  if (post.userHasLiked) {
    await postStore.unlikePost(post.id)
  } else {
    await postStore.likePost(post.id)
  }
}

const commentOnPost = async (postId: number) => {
  console.log(`Comment on post ${postId}`)
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

.liked .small-icon {
  color: red;
}
</style>
