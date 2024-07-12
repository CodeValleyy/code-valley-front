interface UserFriend {
  id: number
  email: string
  username: string
  status: FriendshipStatus
  createdAt: string
  avatar: string
}

interface FriendshipPendingDTO {
  id: number
  senderId: number
  status: FriendshipStatus
  createdAt: string
  email: string
  username: string
  avatar: string
}

interface FriendshipSentDTO {
  id: number
  receiverId: number
  status: FriendshipStatus
  createdAt: string
  email: string
  username: string
}

enum FriendshipStatus {
  NONE = 'none',
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  DECLINED = 'declined'
}

export type { UserFriend, FriendshipPendingDTO, FriendshipSentDTO }
export { FriendshipStatus }
