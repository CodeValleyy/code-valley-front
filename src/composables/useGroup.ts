import axiosInstance from '@/config/axiosInstance'
import type { GroupInput } from '@/types/GroupInput'
import type { GroupResponse } from '@/types/GroupResponse'
import { useRouter } from 'vue-router'
const router = useRouter()

const fetchGroup = async (groupId: number | string | undefined) => {
  if (!groupId) {
    throw new Error('No groupId provided')
  }
  return typeof groupId === 'string' ? fetchGroupByName(groupId) : fetchGroupById(groupId)
}
const fetchGroupById = async (groupId: number) => {
  try {
    const response = await axiosInstance.get(`/groups/details/${groupId}`)
    return response.data
  } catch (error) {
    console.error('Error fetching group:', error)
    throw error
  }
}

const fetchGroupByName = async (name: string) => {
  try {
    const response = await axiosInstance.get(`/groups/details/name/${name}`)
    return response.data
  } catch (error) {
    console.error('Error fetching group:', error)
    throw error
  }
}

const getAll = async (): Promise<GroupResponse[]> => {
  try {
    const response = await axiosInstance.get('/groups/list')
    return response.data as GroupResponse[]
  } catch (error) {
    console.error('Error fetching groups:', error)
    throw error
  }
}

const getOneWithId = async (id: string): Promise<GroupResponse> => {
  try {
    const response = await axiosInstance.get('/groups/details/' + id)
    return response.data as GroupResponse
  } catch (error) {
    console.error('Error fetching group:', error)
    throw error
  }
}

const createGroup = async (groupInput: GroupInput) => {
  try {
    const response = await axiosInstance.post(`/groups/create`, groupInput)
    const createdGroup = response.data
    window.location.href = `/groups/${createdGroup.id}`
  } catch (error) {
    console.error('Error creating group:', error)
    throw error
  }
}

const updateGroup = async (groupInput: GroupInput, groupId: number) => {
  try {
    const response = await axiosInstance.patch(`/groups/update/${groupId}`, groupInput)
    const createdGroup = response.data
    window.location.href = `/groups/${createdGroup.id}`
  } catch (error) {
    console.error('Error creating group:', error)
    throw error
  }
}

const joinGroup = async (groupId: number, userId: number) => {
  try {
    await axiosInstance.post(`/groups/add/${groupId}/${userId}`)
    window.location.href = `/groups/${groupId}`
  } catch (error) {
    console.error('Error adding to group group:', error)
    throw error
  }
}

const sendJoinRequest = async (groupId: number, userId: number) => {
  try {
    await axiosInstance.post(`/groups/join/${groupId}/${userId}`)
  } catch (error) {
    console.error('Error sending to group group:', error)
    throw error
  }
}

const searchGroup = async (name: string): Promise<GroupResponse[]> => {
  try {
    const response = await axiosInstance.get('/groups/search/' + name)
    return response.data as GroupResponse[]
  } catch (error) {
    console.error('Error fetching groups:', error)
    throw error
  }
}

export const useGroup = () => ({
  getAll,
  getOneWithId,
  fetchGroup,
  searchGroup,
  createGroup,
  joinGroup,
  sendJoinRequest,
  updateGroup
})
