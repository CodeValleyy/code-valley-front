export interface Post {
    id: number;
    content: string;
    userId: number;
    username: string;
    createdAt: Date;
    avatar: string;
    likes: number;
    userHasLiked: boolean;
    isOwner?: boolean;
}
