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
    extensions: JSON.parse(localStorage.getItem('extensions') ?? '[]') as Extension[],
    currentLanguage: localStorage.getItem('currentLanguage') ?? 'python',
    codeInput: localStorage.getItem('codeInput') ?? '',
    currentExtension: localStorage.getItem('currentExtension') ?? '',
    selectedSnippet: localStorage.getItem('selectedSnippet') ?? '',
    selectedFilenameSnippet: localStorage.getItem('selectedFilenameSnippet') ?? ''
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
    },
    setCurrentLanguage(language: string) {
      this.currentLanguage = language
      localStorage.setItem('currentLanguage', language)
    },
    setCodeInput(codeInput: string) {
      this.codeInput = codeInput
      localStorage.setItem('codeInput', codeInput)
    },
    setCurrentExtension(extension: string) {
      this.currentExtension = extension
      localStorage.setItem('currentExtension', extension)
    },
    setSelectedSnippet(selectedSnippet: string) {
      this.selectedSnippet = selectedSnippet
      localStorage.setItem('selectedSnippet', selectedSnippet)
    },
    setSelectedFilenameSnippet(selectedFilenameSnippet: string) {
      this.selectedFilenameSnippet = selectedFilenameSnippet
      localStorage.setItem('selectedFilenameSnippet', selectedFilenameSnippet)
    },
    resetAllCode() {
      localStorage.removeItem('codeInput')
      localStorage.removeItem('currentExtension')
      localStorage.removeItem('currentLanguage')
      localStorage.removeItem('selectedSnippet')
      localStorage.removeItem('selectedFilenameSnippet')
      this.codeInput = ''
      this.currentExtension = ''
      this.currentLanguage = ''
      this.selectedSnippet = ''
      this.selectedFilenameSnippet = ''
    }
  },
  getters: {
    isAuthenticated: (state) => !!state.user,
    isTwoFactorEnabled: (state) => state.user?.isTwoFactorAuthenticationEnabled ?? false,
    getTheme: (state) => state.theme || (localStorage.getItem('theme') ?? 'light'),
    getExtensions: (state) => state.extensions || JSON.parse(localStorage.getItem('extensions') ?? '[]'),
    getCurrentLanguage: (state) => state.currentLanguage || (localStorage.getItem('currentLanguage') ?? 'python'),
    getCodeInput: (state) => state.codeInput || (localStorage.getItem('codeInput') ?? ''),
    getCurrentExtension: (state) => state.currentExtension || (localStorage.getItem('currentExtension') ?? ''),
    getSelectedSnippet: (state) => state.selectedSnippet || (localStorage.getItem('selectedSnippet') ?? ''),
    getSelectedFilenameSnippet: (state) => state.selectedFilenameSnippet || (localStorage.getItem('selectedFilenameSnippet') ?? '')
  }
})
