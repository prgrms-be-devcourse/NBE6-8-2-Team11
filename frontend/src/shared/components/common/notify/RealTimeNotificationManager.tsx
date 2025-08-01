'use client';

import { useState, useEffect } from 'react';
import { useNotificationStore } from './NotificationStore';
import RealTimeNotification from './RealTimeNotification';
import { Notification } from '../../../types/notification';

export default function RealTimeNotificationManager() {
  const { notifications } = useNotificationStore();
  const [realTimeNotifications, setRealTimeNotifications] = useState<Notification[]>([]);

  // 새로운 알림이 추가될 때 실시간 알림 표시
  useEffect(() => {
    if (notifications.length > 0) {
      const latestNotification = notifications[0];
      const isNewNotification = Date.now() - new Date(latestNotification.createdAt).getTime() < 1000; // 1초 이내 생성된 알림

      if (isNewNotification) {
        setRealTimeNotifications(prev => [latestNotification, ...prev]);
      }
    }
  }, [notifications]);

  const handleCloseRealTimeNotification = (notificationId: number) => {
    setRealTimeNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  return (
    <>
      {/* 실시간 알림 토스트들 */}
      {realTimeNotifications.map((notification, index) => (
        <div
          key={`${notification.id}-${index}`}
          style={{ top: `${4 + index * 80}px` }}
          className="fixed right-4 z-50"
        >
          <RealTimeNotification
            notification={notification}
            onClose={() => handleCloseRealTimeNotification(notification.id)}
          />
        </div>
      ))}
    </>
  );
} 