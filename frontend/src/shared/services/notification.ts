import { apiClient } from './apiClient';
import { Notification } from '../types';

export const notificationService = {
  // 알림 목록 조회
  async getNotifications(): Promise<Notification[]> {
    const response = await apiClient.get<Notification[]>('/api/notifications');
    return response.content;
  },

  // 알림 상세 조회
  async getNotification(notificationId: string): Promise<Notification> {
    const response = await apiClient.get<Notification>(`/api/notifications/${notificationId}`);
    return response.content;
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
