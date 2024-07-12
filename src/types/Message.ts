import type { User } from './User'

export interface Message {
  id: number
  value: string
  author: User
  createdAt: Date
}
