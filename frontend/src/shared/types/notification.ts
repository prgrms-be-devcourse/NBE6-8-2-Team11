export interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'ADOPTION_REQUESTED' | 'ADOPTION_ACCEPTED' | 'ADOPTION_REJECTED' | 'CARE_REQUESTED' | 'CARE_ACCEPTED' | 'CARE_REJECTED' | 'NEW_MESSAGE' | 'CHAT_ROOM_DELETED' | 'CHAT_ROOM_CREATED';
  isRead: boolean;
  createdAt: string;
  userId: number;
  relatedUrl?: string;
}

export interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
}

export interface NotificationAction {
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => void;
  markAsRead: (id: number) => void;
  markAllAsRead: () => void;
  removeNotification: (id: number) => void;
  clearAll: () => void;
  setNotifications: (notifications: Notification[]) => void;
} 