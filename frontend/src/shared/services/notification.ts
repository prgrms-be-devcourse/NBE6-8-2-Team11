import { apiClient } from './apiClient';
import { Notification } from '../types/notification';

interface NotificationResponse {
  notificationId: number;
  type: 'ADOPTION_REQUESTED' | 'ADOPTION_ACCEPTED' | 'ADOPTION_REJECTED' | 'CARE_REQUESTED' | 'CARE_ACCEPTED' | 'CARE_REJECTED' | 'NEW_MESSAGE' | 'CHAT_ROOM_DELETED';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
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
      createdAt: notification.createdAt,
      userId: 0,
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
