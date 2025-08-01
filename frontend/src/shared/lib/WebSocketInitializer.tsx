'use client';

import { useEffect } from 'react';
import { wsClient } from './websocket';
import { useNotificationStore } from '../components/common/notify/NotificationStore';

export default function WebSocketInitializer() {
  const { addNotification } = useNotificationStore();

  useEffect(() => {
    const initializeWebSocket = async () => {
      const token = localStorage.getItem('accessToken');
      const userId = localStorage.getItem('userId');
      
      if (token && userId) {
        // 기존 연결 해제
        wsClient.disconnect();
        
        // 새로 연결
        wsClient.connect(token, parseInt(userId, 10));
        
        // 연결 후 구독 강제 실행
        setTimeout(() => {
          if (wsClient.getConnectionStatus()) {
            wsClient.subscribeToPersonalNotifications();
          }
        }, 1000);
      }
    };

    initializeWebSocket();
  }, []);

  // 실시간 알림 처리
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleNotification = (notification: any) => {
      console.log('Received notification:', notification);
      
      // 알림을 화면에 표시
      addNotification({
        title: notification.title || '새 알림',
        message: notification.message || notification.content || '새로운 알림이 도착했습니다.',
        type: notification.type || 'NEW_MESSAGE',
        userId: parseInt(localStorage.getItem('userId') || '0', 10),
      });
    };

    // WebSocket 알림 핸들러 등록
    wsClient.onNotification(handleNotification);

    // 컴포넌트 언마운트 시 핸들러 제거
    return () => {
      wsClient.offNotification(handleNotification);
    };
  }, [addNotification]);

  return null;
} 