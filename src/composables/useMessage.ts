import axiosInstance from '@/config/axiosInstance'
import type { MessageInput } from '@/types/MessageInput'
import type { MessageResponse } from '@/types/MessageResponse'

const getAll = async (): Promise<MessageResponse[]> => {
  try {
    const response = await axiosInstance.get('/messages/list')
    return response.data as MessageResponse[]
  } catch (error) {
    console.error('Error fetching messages:', error)
    throw error
  }
}

const getMessagesWithGroupId = async (groupId: string): Promise<MessageResponse[]> => {
  try {
    const response = await axiosInstance.get('/messages/conversation/' + groupId)
    return response.data as MessageResponse[]
  } catch (error) {
    console.error('Error fetching messages:', error)
    throw error
  }
}

const createMessage = async (messageInput: MessageInput) => {
  try {
    await axiosInstance.post(`/messages/create`, messageInput)
  } catch (error) {
    console.error('Error creating message:', error)
    throw error
  }
}

export const useMessage = () => ({
  getAll,
  getMessagesWithGroupId,
  createMessage
})