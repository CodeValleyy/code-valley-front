import type { GroupResponse } from './GroupResponse'
import type { User } from './User'

export interface MessageResponse {
  id: number
  value: string
  author: User
  group: GroupResponse
  createdAt: Date
  file: string | null
}
