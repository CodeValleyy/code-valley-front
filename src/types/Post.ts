export interface Post {
  id: number
  content: string
  userId: number
  fileId?: string
  code_url?: string
  output_type?: string
  code?: String
  code_language?: string | null
  username: string
  createdAt: Date
  avatar: string
  likes: number
  userHasLiked: boolean
  isOwner?: boolean
}
