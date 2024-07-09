import { defineStore } from 'pinia';
import axiosInstance from '@/config/axiosInstance';
import type { FriendshipPendingDTO, UserFriend } from '@/types/FriendshipTypes';

export const useFriendshipStore = defineStore('friendship', {
    state: () => ({
        followers: [] as UserFriend[],
        followings: [] as UserFriend[],
        friendRequests: [] as UserFriend[],
        friendSuggestions: [] as UserFriend[],
        sentFriendRequests: [] as UserFriend[],
        isFollowing: false,
    }),
    actions: {
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
        async acceptFriendRequest(senderId: number): Promise<boolean> {
            try {
                await axiosInstance.post(`/friendships/accept/${senderId}`);
                return true;
            } catch (error) {
                console.error('Error accepting friend request:', error);
                return false;
            }
        },
        async declineFriendRequest(senderId: number): Promise<boolean> {
            try {
                await axiosInstance.post(`/friendships/decline/${senderId}`);
                return true;
            } catch (error) {
                console.error('Error declining friend request:', error);
                return false;
            }
        },
        async removeFriend(friendId: number) {
            try {
                await axiosInstance.delete(`/friendships/remove/${friendId}`);
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
        async fetchFollowers(userId: number, limit: number, offset: number) {
            try {
                const response = await axiosInstance.get(`/friendships/followers/${userId}?limit=${limit}&offset=${offset}`);
                this.followers = response.data as UserFriend[];
                this.friendRequests = this.followers.filter((follower) => follower.status === 'pending');
            } catch (error) {
                console.error('Error fetching followers:', error);
            }
        },
        async fetchFollowings(userId: number, limit: number, offset: number) {
            try {
                const response = await axiosInstance.get(`/friendships/followings/${userId}?limit=${limit}&offset=${offset}`);
                this.followings = response.data as UserFriend[];
                this.sentFriendRequests = this.followings.filter((following) => following.status === 'pending');
            } catch (error) {
                console.error('Error fetching followings:', error);
            }
        },
        async fetchFollowersAndFollowingsCount(userId: number) {
            try {
                const response = await axiosInstance.get(`/friendships/count/${userId}`);
                return response.data;
            } catch (error) {
                console.error('Error fetching counts:', error);
            }
        },
        async fetchFriendshipStatus(userId: number) {
            try {
                const response = await axiosInstance.get(`/friendships/status?friendId=${userId}`);
                return response.data;
            } catch (error) {
                console.error('Error fetching friendship status:', error);
            }
        }
    }
});
