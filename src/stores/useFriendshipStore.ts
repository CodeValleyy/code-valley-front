import { defineStore } from 'pinia';
import axios from 'axios';

export const useFriendshipStore = defineStore('friendship', {
    state: () => ({
        friends: [],
        friendRequests: [],
        friendSuggestions: [],
        sentFriendRequests: []
    }),
    actions: {
        async fetchFriends() {
            try {
                const response = await axios.get(`${import.meta.env.VITE_APP_USER_MANAGEMENT_URL}/friendships/list`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                this.friends = response.data;
            } catch (error) {
                console.error('Error fetching friends:', error);
            }
        },
        async fetchFriendRequests() {
            try {
                const response = await axios.get(`${import.meta.env.VITE_APP_USER_MANAGEMENT_URL}/friendships/requests`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                this.friendRequests = response.data;
            } catch (error) {
                console.error('Error fetching friend requests:', error);
            }
        },
        async sendFriendRequest(receiverId: number) {
            try {
                await axios.post(`${import.meta.env.VITE_APP_USER_MANAGEMENT_URL}/friendships/send/${receiverId}`, {}, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
            } catch (error) {
                console.error('Error sending friend request:', error);
            }
        },
        async cancelSentRequest(requestId: number) {
            try {
                await axios.delete(`${import.meta.env.VITE_APP_USER_MANAGEMENT_URL}/friendships/requests/${requestId}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
            } catch (error) {
                console.error('Error canceling friend request:', error);
            }
        },
        async fetchSentFriendRequests() {
            try {
                const response = await axios.get(`${import.meta.env.VITE_APP_USER_MANAGEMENT_URL}/friendships/sent-requests`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                this.sentFriendRequests = response.data;
            } catch (error) {
                console.error('Error fetching pending requests:', error);
            }
        },
        async acceptFriendRequest(requestId: number) {
            try {
                await axios.post(`${import.meta.env.VITE_APP_USER_MANAGEMENT_URL}/friendships/accept/${requestId}`, {}, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                this.fetchFriends();
            } catch (error) {
                console.error('Error accepting friend request:', error);
            }
        },
        async declineFriendRequest(requestId: number) {
            try {
                await axios.post(`${import.meta.env.VITE_APP_USER_MANAGEMENT_URL}/friendships/decline/${requestId}`, {}, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                this.fetchFriends();
            } catch (error) {
                console.error('Error declining friend request:', error);
            }
        },
        async removeFriend(friendId: number) {
            try {
                await axios.delete(`${import.meta.env.VITE_APP_USER_MANAGEMENT_URL}/friendships/remove/${friendId}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                this.fetchFriends();
            } catch (error) {
                console.error('Error removing friend:', error);
            }
        },
        async fetchFriendSuggestions() {
            try {
                const response = await axios.get(`${import.meta.env.VITE_APP_USER_MANAGEMENT_URL}/friendships/suggestions`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                this.friendSuggestions = response.data;
            } catch (error) {
                console.error('Error fetching friend suggestions:', error);
            }
        }
    }
});
