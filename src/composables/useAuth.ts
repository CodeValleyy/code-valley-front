import { ref } from 'vue'
import axiosInstance from '@/config/axiosInstance'
import type { UserResponse } from '@/types/UserResponse'
import { useUserStore } from '@/stores/useUserStore'

const token = ref(localStorage.getItem('token') ?? '')

const setToken = (newToken: string) => {
  token.value = newToken
  localStorage.setItem('token', newToken)
}

const resetToken = () => {
  token.value = ''
  localStorage.removeItem('token')
}

const getToken = () => token.value

const fetchMe = async () => {
  try {
    const response = await axiosInstance.get('/auth/me')
    useUserStore().setUser(response.data)
    return response.data
  } catch (error) {
    console.error('Error fetching profile:', error)
    throw error
  }
}

const fetchProfile = async (userId: number | string | undefined) => {
  if (!userId) {
    throw new Error('No userId provided')
  }
  return typeof userId === 'string' ? fetchProfileByUsername(userId) : fetchProfileById(userId)
}
const fetchProfileById = async (userId: number) => {
  try {
    const response = await axiosInstance.get(`/auth/profile/${userId}`)
    return response.data
  } catch (error) {
    console.error('Error fetching profile:', error)
    throw error
  }
}

const fetchProfileByUsername = async (username: string) => {
  try {
    const response = await axiosInstance.get(`/auth/profile/username/${username}`)
    return response.data
  } catch (error) {
    console.error('Error fetching profile:', error)
    throw error
  }
}

const logout = async () => {
  try {
    await axiosInstance.post('/auth/logout')
  } catch (error) {
    console.error('Error logging out:', error)
    throw error
  } finally {
    resetToken()
  }
}

const getGoogleAuthUrl = async () => {
  try {
    const response = await axiosInstance.get('/auth/google')
    return response.data
  } catch (error) {
    console.error('Error fetching Google Auth URL:', error)
    throw error
  }
}

const uploadAvatar = async (file: File) => {
  const formData = new FormData()
  formData.append('file', file)

  try {
    const response = await axiosInstance.post('/auth/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  } catch (error) {
    console.error('Error uploading avatar:', error)
    throw error
  }
}

const searchUser = async (username: string): Promise<UserResponse[]> => {
  try {
    const response = await axiosInstance.get('/auth/search/' + username)
    return response.data as UserResponse[]
  } catch (error) {
    console.error('Error fetching profile:', error)
    throw error
  }
}

export const useAuth = () => ({
  setToken,
  getToken,
  logout,
  fetchMe,
  getGoogleAuthUrl,
  fetchProfile,
  resetToken,
  uploadAvatar,
  searchUser
})
