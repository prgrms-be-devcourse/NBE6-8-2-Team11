'use client';

import { useState, useEffect, useRef } from 'react';
import { useNotificationStore } from './NotificationStore';
import RealTimeNotification from './RealTimeNotification';
import { Notification } from '../../../types/notification';

export default function RealTimeNotificationManager() {
  const { notifications } = useNotificationStore();
  const [realTimeNotifications, setRealTimeNotifications] = useState<Notification[]>([]);
  const mountTime = useRef(Date.now());
  const lastNotificationCount = useRef(notifications.length);

  useEffect(() => {
    // 컴포넌트 마운트 시점 이후에 추가된 알림만 실시간 알림으로 표시
    if (notifications.length > lastNotificationCount.current) {
      const newNotifications = notifications.slice(0, notifications.length - lastNotificationCount.current);
      
      // 마운트 시점 이후에 생성된 알림만 필터링
      const recentNotifications = newNotifications.filter(notification => {
        const notificationTime = new Date(notification.createdAt).getTime();
        return notificationTime > mountTime.current;
      });
      
      if (recentNotifications.length > 0) {
        setRealTimeNotifications(prev => [...recentNotifications, ...prev]);
      }
    }
    
    lastNotificationCount.current = notifications.length;
  }, [notifications]);

  const handleCloseRealTimeNotification = (notificationId: number) => {
    setRealTimeNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  return (
    <>
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