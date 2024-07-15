import { defineStore } from 'pinia'
import type { User } from '@/types'
import axiosInstance from '@/config/axiosInstance'

type Extension = {
  text: string,
  value: string
}

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as User | null,
    theme: localStorage.getItem('theme') ?? 'light',
    extensions: JSON.parse(localStorage.getItem('extensions') ?? '[]') as Extension[]
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
    },
    setTheme(theme: string) {
      this.theme = theme
      localStorage.setItem('theme', theme)
    },
    setExtensions(extensions: Extension[]) {
      this.extensions = extensions
      localStorage.setItem('extensions', JSON.stringify(extensions))
    }
  },
  getters: {
    isAuthenticated: (state) => !!state.user,
    isTwoFactorEnabled: (state) => state.user?.isTwoFactorAuthenticationEnabled ?? false,
    getTheme: (state) => state.theme || (localStorage.getItem('theme') ?? 'light'),
    getExtensions: (state) => state.extensions || JSON.parse(localStorage.getItem('extensions') ?? '[]')
  }
})
