import { apiClient } from './apiClient';
import { Notification } from '../types';

// Added by assistant to resolve linter errors and type mismatches
interface NotificationResponse {
  notificationId: number;
  type: 'ADOPTION_REQUESTED' | 'ADOPTION_ACCEPTED' | 'ADOPTION_REJECTED' | 'CARE_REQUESTED' | 'CARE_ACCEPTED' | 'CARE_REJECTED' | 'NEW_MESSAGE' | 'CHAT_ROOM_DELETED' | 'CHAT_ROOM_CREATED';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  memberId: number; // Added to match frontend Notification type
}

export const notificationService = {
  // 알림 목록 조회
  async getNotifications(): Promise<Notification[]> {
    const response = await apiClient.get<NotificationResponse[]>('/api/notifications');
    return response.content.map((notification: NotificationResponse) => ({
      id: notification.notificationId,
      title: notification.title || '알림',
      message: notification.message,
      type: notification.type,
      isRead: notification.isRead,
      createdAt: new Date(notification.createdAt),
      memberId: notification.memberId || 0, // Added memberId mapping
    }));
  },

  // 알림 삭제
  async deleteNotification(notificationId: string): Promise<void> {
    await apiClient.delete(`/api/notifications/${notificationId}`);
  },

  // 알림 전체 삭제
  async deleteAllNotifications(): Promise<void> {
    await apiClient.delete('/api/notifications/all');
  },
};
