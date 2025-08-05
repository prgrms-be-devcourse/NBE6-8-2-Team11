'use client';

import { useState, useEffect, useRef } from 'react';
import RealTimeNotification from './RealTimeNotification';
import { Notification } from '../../../types/notification'; // Frontend Notification type
import { wsClient } from '../../../lib/websocket'; // Corrected import path

// Defined by assistant to match websocket.ts's Notification interface
interface WebSocketNotification {
  id: number;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  timestamp: string;
  content?: string; // Added for flexibility as backend might send 'content'
}

export default function RealTimeNotificationManager() {
  const [realTimeNotifications, setRealTimeNotifications] = useState<Notification[]>([]);
  const processedNotifications = useRef<Set<string>>(new Set()); // Added for duplicate check

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
        id: Date.now(), // Use client-side timestamp for unique ID for popups
        title: notification.title || '새 알림',
        message: notification.message || notification.content || '새로운 알림이 도착했습니다.',
        type: notification.type as Notification['type'], // Use the type from Notification interface
        isRead: false,
        createdAt: new Date().toISOString(),
        userId: 0, // Placeholder, as userId might not be directly in real-time payload
      };

      setRealTimeNotifications(prev => [newNotification, ...prev]);
    };

    wsClient.onNotification(handleRealTimeNotification);

    return () => {
      wsClient.offNotification(handleRealTimeNotification);
    };
  }, []); // Empty dependency array to run once on mount

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