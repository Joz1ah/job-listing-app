export type NotificationItem = {
    id: number;
    title: string;
    message: string;
    createdAt: Date;
    hasMatch?: boolean;
    unread: boolean;
  };