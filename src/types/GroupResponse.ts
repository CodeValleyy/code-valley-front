import type { User } from './User'

export interface GroupResponse {
  id: number
  name: string
  description: string
  members: User[]
  isPublic: boolean
  memberJoinRequests: User[]
}
