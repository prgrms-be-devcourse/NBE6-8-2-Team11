import { apiClient } from './apiClient';
import { Notification } from '../types/notification';

export const notificationService = {
  // 알림 목록 조회
  async getNotifications(): Promise<Notification[]> {
    const response = await apiClient.get<any[]>('/api/notifications');
    return response.content.map((notification: any) => ({
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
