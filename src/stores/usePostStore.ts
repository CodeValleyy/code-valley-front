import axiosInstance from '@/config/axiosInstance';
import type { Post } from '@/types';
import { defineStore } from 'pinia';

function getCodeLanguageFromUrl(url: string): string | null {
    const extension = url.split('.').pop()?.split('?')[0];
    if (!extension) {
        return null;
    }

    switch (extension.toLowerCase()) {
        case 'py':
            return 'python';
        case 'js':
            return 'javascript';
        case 'rs':
            return 'rust';
        case 'lua':
            return 'lua';
        default:
            return 'Unknown';
    }
}

export interface CreatePostDto {
    content: string;
}

export const usePostStore = defineStore('post', {
    state: () => ({
        posts: [] as Post[],
        currentPost: null as Post | null,
    }),
    actions: {
        async fetchPosts() {
            try {
                const response = await axiosInstance.get('/posts');
                this.posts = response.data;
                for (const element of this.posts) {
                    if (element.code_url) {
                        const response = await axiosInstance.get(element.code_url);
                        element.code = response.data;
                        element.code_language = getCodeLanguageFromUrl(element.code_url);
                    }
                }
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        },
        async fetchPost(postId: number): Promise<Post> {
            try {
                const response = await axiosInstance.get(`/posts/${postId}`);
                const post = response.data;
                return post;
            } catch (error) {
                console.error('Error fetching post:', error);
                throw error;
            }
        },
        async createPost(content: string, file?: File | null) {
            try {
                if (file) {
                    const formData = new FormData();
                    formData.append('content', content);
                    formData.append('file', file);
                    await axiosInstance.post('/posts', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    });
                } else {
                    await axiosInstance.post('/posts', { content });
                }
                this.fetchPosts();
            } catch (error) {
                console.error('Error creating post:', error);
            }
        },
        async deletePost(postId: number) {
            try {
                await axiosInstance.delete(`/posts/${postId}`);
                this.posts = this.posts.filter((post) => post.id !== postId);
            } catch (error) {
                console.error('Error deleting post:', error);
            }
        },
        async likePost(postId: number) {
            try {
                await axiosInstance.post(`/posts/${postId}/like`);
                this.posts = this.posts.map((post) => {
                    if (post.id === postId) {
                        post.likes++;
                        post.userHasLiked = true;
                    }
                    return post;
                });
            } catch (error) {
                console.error('Error liking post:', error);
            }
        },
        async unlikePost(postId: number) {
            try {
                await axiosInstance.delete(`/posts/${postId}/like`);
                this.posts = this.posts.map((post) => {
                    if (post.id === postId) {
                        post.likes--;
                        post.userHasLiked = false;
                    }
                    return post;
                });
            } catch (error) {
                console.error('Error unliking post:', error);
            }
        },

        /* TODO in the API */
        async fetchPostsByUserId(userId: number) {
            try {
                const response = await axiosInstance.get(`/posts/user/${userId}`);
                this.posts = response.data;
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        },
    },
});
