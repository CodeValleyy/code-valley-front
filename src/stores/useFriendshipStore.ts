import { defineStore } from 'pinia';
import axiosInstance from '@/config/axiosInstance';
import type { FriendshipPendingDTO, FriendshipSentDTO, UserFriend } from '@/types/FriendshipTypes';

export const useFriendshipStore = defineStore('friendship', {
    state: () => ({
        friends: [] as UserFriend[],
        followers: [] as UserFriend[],
        followings: [] as UserFriend[],
        friendRequests: [] as UserFriend[],
        friendSuggestions: [] as UserFriend[],
        sentFriendRequests: [] as UserFriend[],
        isFollowing: false,
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
        async fetchFriendsByUserId(userId: number) {
            try {
                const response = await axiosInstance.get('/friendships/list/' + userId);
                this.friends = response.data as UserFriend[];
            } catch (error) {
                console.error('Error fetching friends:', error);
            }
        },
        async fetchFriendshipFollowing(currentUserId: number, targetUserId: number) {
            try {
                const response = await axiosInstance.get(`/friendships/following/${currentUserId}/${targetUserId}`);
                this.isFollowing = response.data as boolean;
            } catch (error) {
                console.error('Error fetching friendship following:', error);
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
        async acceptFriendRequest(senderId: number) {
            try {
                await axiosInstance.post(`/friendships/accept/${senderId}`);
                this.fetchFriends();
            } catch (error) {
                console.error('Error accepting friend request:', error);
            }
        },
        async declineFriendRequest(senderId: number) {
            try {
                await axiosInstance.post(`/friendships/decline/${senderId}`);
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
        async fetchFriendSuggestions(limit: number, offset: number) {
            try {
                const response = await axiosInstance.get(`/friendships/suggestions?limit=${limit}&offset=${offset}`);
                this.friendSuggestions = response.data;
            } catch (error) {
                console.error('Error fetching friend suggestions:', error);
            }
        },
        async toggleFollowUser(targetUserId: number) {
            if (this.isFollowing) {
                await this.removeFriend(targetUserId);
                this.isFollowing = false;
            } else {
                await this.sendFriendRequest(targetUserId);
                this.isFollowing = true;
            }
        },
        async fetchFollowers(userId: number) {
            try {
                const response = await axiosInstance.get(`/friendships/followers/${userId}`);
                this.followers = response.data as UserFriend[];
                this.friendRequests = this.followers.filter((follower) => follower.status === 'pending');
            } catch (error) {
                console.error('Error fetching followers:', error);
            }
        },
        async fetchFollowings(userId: number) {
            try {
                const response = await axiosInstance.get(`/friendships/followings/${userId}`);
                this.followings = response.data as UserFriend[];
                this.sentFriendRequests = this.followings.filter((following) => following.status === 'pending');
            } catch (error) {
                console.error('Error fetching followings:', error);
            }
        },
    }
});
