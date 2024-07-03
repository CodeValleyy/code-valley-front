import type { User } from './User'

export interface GroupResponse {
  id: number
  name: string
  members: User[]
}
