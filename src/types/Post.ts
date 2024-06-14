export interface Post {
    id: number;
    content: string;
    userId: number;
    fileId?: string;
    code_url?: string;
    username: string;
    createdAt: Date;
    avatar: string;
    likes: number;
    userHasLiked: boolean;
    isOwner?: boolean;
}
