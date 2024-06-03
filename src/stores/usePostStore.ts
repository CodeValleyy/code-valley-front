import axiosInstance from '@/config/axiosInstance';
import { defineStore } from 'pinia';

export interface CreatePostDto {
    content: string;
}

export const usePostStore = defineStore('post', {
    state: () => ({
        posts: [],
    }),
    actions: {
        async fetchPosts() {
            try {
                const response = await axiosInstance.get('/posts');
                this.posts = response.data;
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        },
        async createPost(content: string) {
            try {
                await axiosInstance.post('/posts', { content });
                this.fetchPosts();
            } catch (error) {
                console.error('Error creating post:', error);
            }
        },
        async deletePost(postId: number) {
            try {
                await axiosInstance.delete(`/posts/${postId}`);
                this.fetchPosts();
            } catch (error) {
                console.error('Error deleting post:', error);
            }
        },
        async likePost(postId: number) {
            try {
                await axiosInstance.post(`/posts/${postId}/like`);
                this.fetchPosts();
            } catch (error) {
                console.error('Error liking post:', error);
            }
        },
        async unlikePost(postId: number) {
            try {
                await axiosInstance.delete(`/posts/${postId}/like`);
                this.fetchPosts();
            } catch (error) {
                console.error('Error unliking post:', error);
            }
        },
    },
});
