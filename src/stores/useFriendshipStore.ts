import { defineStore } from 'pinia';
import axiosInstance from '@/config/axiosInstance';
import type { FriendshipPendingDTO, FriendshipSentDTO, UserFriend } from '@/types/FriendshipTypes';

export const useFriendshipStore = defineStore('friendship', {
    state: () => ({
        friends: [] as UserFriend[],
        friendRequests: [] as FriendshipPendingDTO[],
        friendSuggestions: [] as UserFriend[],
        sentFriendRequests: [] as FriendshipSentDTO[]
    }),
    actions: {
        async fetchFriends() {
            try {
                const response = await axiosInstance.get('/friendships/list');
                this.friends = response.data as UserFriend[];
            } catch (error) {
                console.error('Error fetching friends:', error);
            }
        },
        async fetchFriendRequests() {
            try {
                const response = await axiosInstance.get('/friendships/requests');
                this.friendRequests = response.data as FriendshipPendingDTO[];
            } catch (error) {
                console.error('Error fetching friend requests:', error);
            }
        },
        async sendFriendRequest(receiverId: number) {
            try {
                await axiosInstance.post(`/friendships/send/${receiverId}`);
            } catch (error) {
                console.error('Error sending friend request:', error);
            }
        },
        async cancelSentRequest(requestId: number) {
            try {
                await axiosInstance.delete(`/friendships/requests/${requestId}`);
            } catch (error) {
                console.error('Error canceling friend request:', error);
            }
        },
        async fetchSentFriendRequests() {
            try {
                const response = await axiosInstance.get('/friendships/sent-requests');
                this.sentFriendRequests = response.data as FriendshipSentDTO[];
            } catch (error) {
                console.error('Error fetching pending requests:', error);
            }
        },
        async acceptFriendRequest(requestId: number) {
            try {
                await axiosInstance.post(`/friendships/accept/${requestId}`);
                this.fetchFriends();
            } catch (error) {
                console.error('Error accepting friend request:', error);
            }
        },
        async declineFriendRequest(requestId: number) {
            try {
                await axiosInstance.post(`/friendships/decline/${requestId}`);
                this.fetchFriends();
            } catch (error) {
                console.error('Error declining friend request:', error);
            }
        },
        async removeFriend(friendId: number) {
            try {
                await axiosInstance.delete(`/friendships/remove/${friendId}`);
                this.fetchFriends();
            } catch (error) {
                console.error('Error removing friend:', error);
            }
        },
        async fetchFriendSuggestions() {
            try {
                const response = await axiosInstance.get('/friendships/suggestions');
                this.friendSuggestions = response.data;
            } catch (error) {
                console.error('Error fetching friend suggestions:', error);
            }
        }
    }
});
