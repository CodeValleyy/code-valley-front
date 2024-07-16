import axiosInstance from '@/config/axiosInstance'
import type { Notification } from '@/types/Notification'

const fetchNotifications = async (limit: number): Promise<Notification[] | null> => {
  try {
    const response = await axiosInstance.get(`/notifications/${limit}`)
    return response.data as Notification[]
  } catch (error) {
    console.error('Error fetching list of notifications:', error)
    return null
  }
}

const fetchNotificationCount = async (): Promise<number | null> => {
  try {
    const response = await axiosInstance.get(`/notifications/count`)
    return response.data.count
  } catch (error) {
    console.error('Error fetching notification count:', error)
    return null
  }
}

const seeNotification = async (notificationId: number): Promise<boolean> => {
  try {
    await axiosInstance.post(`/notifications/see/${notificationId}`)
    return true
  } catch (error) {
    console.error('Error seeing notification:', error)
    return false
  }
}

const unseeNotification = async (notificationId: number): Promise<boolean> => {
  try {
    await axiosInstance.post(`/notifications/unsee/${notificationId}`)
    return true
  } catch (error) {
    console.error('Error unseeing notification:', error)
    return false
  }
}

const seeAllNotifications = async (): Promise<boolean> => {
  try {
    await axiosInstance.post(`/notifications/seeall`)
    return true
  } catch (error) {
    console.error('Error seeing notification:', error)
    return false
  }
}

const unseeAllNotifications = async (): Promise<boolean> => {
  try {
    await axiosInstance.post(`/notifications/unseeall`)
    return true
  } catch (error) {
    console.error('Error unseeing notification:', error)
    return false
  }
}

const removeNotification = async (notificationId: number): Promise<boolean> => {
  try {
    await axiosInstance.delete(`/notifications/${notificationId}`)
    return true
  } catch (error) {
    console.error('Error removing notification:', error)
    return false
  }
}

export const useNotification = () => ({
  fetchNotifications,
  fetchNotificationCount,
  seeNotification,
  unseeNotification,
  seeAllNotifications,
  unseeAllNotifications,
  removeNotification
})
