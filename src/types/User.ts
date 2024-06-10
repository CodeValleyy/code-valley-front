export interface User {
    id: number;
    email: string;
    username: string;
    createdAt: string;
    lastLoginAt: string;
    isTwoFactorAuthenticationEnabled: boolean;
    twoFactorAuthenticationSecret?: string;
    avatar: string;
}
