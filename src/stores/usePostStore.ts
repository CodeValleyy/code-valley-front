import { defineStore } from 'pinia';
import axios from 'axios';

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
                const response = await axios.get(`${import.meta.env.VITE_APP_USER_MANAGEMENT_URL}/posts`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                this.posts = response.data;
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        },
        async createPost(content: string) {
            try {
                await axios.post(`${import.meta.env.VITE_APP_USER_MANAGEMENT_URL}/posts`, {
                    content
                }, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                this.fetchPosts();
            } catch (error) {
                console.error('Error creating post:', error);
            }
        },
        async deletePost(postId: number) {
            try {
                await axios.delete(`${import.meta.env.VITE_APP_USER_MANAGEMENT_URL}/posts/${postId}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                this.fetchPosts();
            } catch (error) {
                console.error('Error deleting post:', error);
            }
        },
        async likePost(postId: number) {
            try {
                await axios.post(`${import.meta.env.VITE_APP_USER_MANAGEMENT_URL}/posts/${postId}/like`, {}, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                this.fetchPosts();
            } catch (error) {
                console.error('Error liking post:', error);
            }
        },
        async unlikePost(postId: number) {
            try {
                await axios.delete(`${import.meta.env.VITE_APP_USER_MANAGEMENT_URL}/posts/${postId}/like`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                this.fetchPosts();
            } catch (error) {
                console.error('Error unliking post:', error);
            }
        },
    },
});
