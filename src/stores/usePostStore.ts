import axiosInstance from '@/config/axiosInstance'
import { getCodeLanguageFromUrl } from '@/config/languagesConfig'
import type { CreateCommentDto, Post } from '@/types'
import { defineStore } from 'pinia'

export interface CreatePostDto {
  content: string
}

export const usePostStore = defineStore('post', {
  state: () => ({
    posts: [] as Post[],
    currentPost: null as Post | null,
    error: null as {
      message: string
      error: string
      statusCode: number
    } | null
  }),
  actions: {
    async fetchPosts({ limit = 10, offset = 0 } = {}) {
      try {
        const response = await axiosInstance.get(`/posts?limit=${limit}&offset=${offset}`)
        this.posts = response.data
        for (const element of this.posts) {
          if (element.code_url) {
            const response = await axiosInstance.get(element.code_url)
            element.code = response.data
            element.code_language = getCodeLanguageFromUrl(element.code_url)
          }
        }
      } catch (error) {
        console.error('Error fetching posts:', error)
      }
    },
    async fetchPost(postId: number): Promise<Post> {
      try {
        const response = await axiosInstance.get(`/posts/${postId}`)
        const post = response.data
        if (post.code_url) {
          const response = await axiosInstance.get(post.code_url)
          post.code = response.data
          post.code_language = getCodeLanguageFromUrl(post.code_url)
        }
        return post
      } catch (error) {
        console.error('Error fetching post:', error)
        throw error
      }
    },
    async createPost(content: string, output_extension: string, file?: File | null) {
      console.log('output_extension:', output_extension)
      try {
        if (file) {
          await this.createPostWithFile(content, file, output_extension)
        } else {
          await axiosInstance.post('/posts', { content })
        }
        this.fetchPosts()
      } catch (error: any) {
        if (error.response) {
          this.error = error.response.data || 'An error occurred'
        } else if (error.request) {
          console.error('Error request:', error.request)
          this.error = {
            message: 'No response received from the server',
            error: 'No response received from the server',
            statusCode: 500
          }
        } else {
          console.error('Error message:', error.message)
          this.error = error.message || 'An error occurred'
        }
      }
    },
    async createPostWithFile(content: string, file: File, output_extension: string) {
      try {
        const formData = new FormData()
        formData.append('content', content)
        formData.append('file', file)
        formData.append('output_extension', output_extension)
        await axiosInstance.post('/posts', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        this.fetchPosts()
      } catch (error: any) {
        if (error.response) {
          this.error = error.response.data || 'An error occurred'
        } else if (error.request) {
          console.error('Error request:', error.request)
          this.error = {
            message: 'No response received from the server',
            error: 'No response received from the server',
            statusCode: 500
          }
        } else {
          console.error('Error message:', error.message)
          this.error = error.message || 'An error occurred'
        }
      }
    },
    async deletePost(postId: number) {
      try {
        await axiosInstance.delete(`/posts/${postId}`)
        this.posts = this.posts.filter((post) => post.id !== postId)
      } catch (error) {
        console.error('Error deleting post:', error)
      }
    },
    async likePost(postId: number) {
      try {
        await axiosInstance.post(`/posts/${postId}/like`)
        this.posts = this.posts.map((post) => {
          if (post.id === postId) {
            post.likes++
            post.userHasLiked = true
          }
          return post
        })
      } catch (error) {
        console.error('Error liking post:', error)
      }
    },
    async unlikePost(postId: number) {
      try {
        await axiosInstance.delete(`/posts/${postId}/like`)
        this.posts = this.posts.map((post) => {
          if (post.id === postId) {
            post.likes--
            post.userHasLiked = false
          }
          return post
        })
      } catch (error) {
        console.error('Error unliking post:', error)
      }
    },
    /* TODO in the API */
    async fetchPostsByUserId(userId: number) {
      try {
        const response = await axiosInstance.get(`/posts/user/${userId}`)
        this.posts = response.data
      } catch (error) {
        console.error('Error fetching posts:', error)
      }
    }
  }
})
