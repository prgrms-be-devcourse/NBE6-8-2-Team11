'use client';

import { useState, useEffect, useRef } from 'react';
import RealTimeNotification from './RealTimeNotification';
import { Notification } from '../../../types/notification';
import { wsClient } from '../../../lib/websocket';

interface WebSocketNotification {
  id: number;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  timestamp: string;
}

export default function RealTimeNotificationManager() {
  const [realTimeNotifications, setRealTimeNotifications] = useState<Notification[]>([]);
  const processedNotifications = useRef<Set<string>>(new Set());

  // WebSocket으로 받은 실시간 알림 처리
  useEffect(() => {
    const handleRealTimeNotification = (notification: WebSocketNotification) => {
      // 중복 체크를 위한 고유 키 생성
      const notificationKey = `${notification.title}-${notification.message}-${notification.type}`;
      
      // 이미 처리된 알림인지 확인
      if (processedNotifications.current.has(notificationKey)) {
        console.log('Duplicate real-time notification ignored:', notification);
        return;
      }
      
      // 처리된 알림으로 표시
      processedNotifications.current.add(notificationKey);
      
      // 10초 후 처리된 알림 목록에서 제거 (같은 알림이 다시 올 수 있도록)
      setTimeout(() => {
        processedNotifications.current.delete(notificationKey);
      }, 10000);

      const newNotification: Notification = {
        id: Date.now(),
        title: notification.title || '새 알림',
        message: notification.message || '새로운 알림이 도착했습니다.',
        type: notification.type as 'NEW_MESSAGE' | 'ADOPTION_REQUESTED' | 'ADOPTION_ACCEPTED' | 'ADOPTION_REJECTED' | 'CARE_REQUESTED' | 'CARE_ACCEPTED' | 'CARE_REJECTED' | 'CHAT_ROOM_DELETED',
        isRead: false,
        createdAt: new Date().toISOString(),
        userId: 0,
      };
      
      setRealTimeNotifications(prev => [newNotification, ...prev]);
    };

    wsClient.onNotification(handleRealTimeNotification);

    return () => {
      wsClient.offNotification(handleRealTimeNotification);
    };
  }, []);

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