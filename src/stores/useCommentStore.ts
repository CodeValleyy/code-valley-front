import axiosInstance from '@/config/axiosInstance'
import { defineStore } from 'pinia'
import type { CreateCommentDto, CommentResponseDto } from '@/types'

export const useCommentStore = defineStore('comment', {
  state: () => ({
    comments: [] as CommentResponseDto[],
    totalComments: 0,
    limit: 2,
    offset: 0,
    loading: false
  }),
  actions: {
    async fetchComments(postId: number, reset: boolean = false) {
      if (this.loading) return
      this.loading = true
      try {
        const response = await axiosInstance.get(
          `/posts/${postId}/comments?limit=${this.limit}&offset=${this.offset}`
        )
        const comments = response.data
        if (reset) {
          this.comments = comments
        } else {
          this.comments = [...this.comments, ...comments]
        }
        this.totalComments = this.comments.length
      } catch (error) {
        console.error('Error fetching comments:', error)
      } finally {
        this.loading = false
      }
    },
    async createComment(postId: number, createCommentDto: CreateCommentDto) {
      try {
        const response = await axiosInstance.post(`/posts/${postId}/comments`, createCommentDto)
        this.comments.unshift(response.data)
      } catch (error) {
        console.error('Error creating comment:', error)
      }
    },
    async deleteComment(postId: number, commentId: number) {
      try {
        await axiosInstance.delete(`/posts/${postId}/comments/${commentId}`)
        this.comments = this.comments.filter((comment) => comment.id !== commentId)
      } catch (error) {
        console.error('Error deleting comment:', error)
      }
    }
  }
})
