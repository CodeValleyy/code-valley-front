import { defineStore } from 'pinia';
import axios from 'axios';
import * as User from '@/types/User';

export const useUserStore = defineStore('user', {
    state: () => ({
        user: null,
    }),
    actions: {
        async fetchUserProfile(token: string) {
            try {
                const response = await axios.get(`${import.meta.env.VITE_APP_USER_MANAGEMENT_URL}/auth/profile`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                this.user = response.data;
            } catch (error) {
                console.error('Error fetching profile:', error);
                throw error;
            }
        },
        setUser(user: User) {
            this.user = user;
        },
        clearUser() {
            this.user = null;
        },
    },
    getters: {
        isAuthenticated: (state) => !!state.user,
        isTwoFactorEnabled: (state) => state.user?.isTwoFactorAuthenticationEnabled ?? false,
    },
});
