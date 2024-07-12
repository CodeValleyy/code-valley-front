import { defineStore } from 'pinia'
import type { User } from '@/types'
import axiosInstance from '@/config/axiosInstance'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as User | null
  }),
  actions: {
    async fetchUserProfile() {
      try {
        const response = await axiosInstance.get('/auth/me')
        this.user = response.data
        return response.data
      } catch (error) {
        console.error('Error fetching profile:', error)
        throw error
      }
    },
    setUser(user: User) {
      this.user = user
    },
    clearUser() {
      this.user = null
    }
  },
  getters: {
    isAuthenticated: (state) => !!state.user,
    isTwoFactorEnabled: (state) => state.user?.isTwoFactorAuthenticationEnabled ?? false
  }
})
