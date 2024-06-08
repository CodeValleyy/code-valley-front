interface UserFriend {
    id: number;
    email: string;
    username: string;
    createdAt: string;
}

interface FriendshipPendingDTO {
    id: number;
    senderId: number;
    status: 'pending' | 'accepted' | 'declined';
    createdAt: string;
    email: string;
    username: string;
}

interface FriendshipSentDTO {
    id: number;
    receiverId: number;
    status: 'pending' | 'accepted' | 'declined';
    createdAt: string;
    email: string;
    username: string;
}

export type { UserFriend, FriendshipPendingDTO, FriendshipSentDTO };