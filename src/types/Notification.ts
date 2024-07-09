export interface Notification {
  id: number;
  createdAt: Date;
  hasBeenRead: boolean;
  fromUsername: string;
  fromUserId: number;
  notificationType: NotificationType;
}

export enum NotificationType {
  friendshipReceived = 'friendshipReceived',
  friendshipAccepted = 'friendshipAccepted',
  friendshipRefused = 'friendshipRefused',
  like = 'like',
  post = 'post',
}
