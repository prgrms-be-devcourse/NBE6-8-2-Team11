'use client';

import { useEffect, useRef } from 'react';
import { wsClient } from './websocket';
import { useNotificationStore } from '../components/common/notify/NotificationStore';

interface WebSocketProviderProps {
  children: React.ReactNode;
}

export default function WebSocketProvider({ children }: WebSocketProviderProps) {
  const { addNotification } = useNotificationStore();
  const isConnected = useRef(false);

  useEffect(() => {
    // 로컬 스토리지에서 토큰과 사용자 ID 확인
    const accessToken = localStorage.getItem('accessToken');
    const userId = localStorage.getItem('userId');

    if (accessToken && userId && !isConnected.current) {
      const userIdNum = parseInt(userId, 10);
      
      // 웹소켓 연결
      wsClient.connect(accessToken, userIdNum);
      isConnected.current = true;

      // 알림 핸들러 등록
      const handleNotification = (notification: { title?: string; message?: string; content?: string; type?: string }) => {
        console.log('WebSocket에서 받은 알림:', notification);
        
        // 백엔드 알림 형식을 프론트엔드 형식으로 변환
        const notificationType = notification.type as 'ADOPTION_REQUESTED' | 'ADOPTION_ACCEPTED' | 'ADOPTION_REJECTED' | 'CARE_REQUESTED' | 'CARE_ACCEPTED' | 'CARE_REJECTED' | 'NEW_MESSAGE' | 'CHAT_ROOM_DELETED' || 'NEW_MESSAGE';
        
        const frontendNotification = {
          title: notification.title || '새 알림',
          message: notification.message || notification.content || '새로운 알림이 도착했습니다.',
          type: notificationType,
          userId: parseInt(userId, 10),
        };

        // 알림 스토어에 추가
        addNotification(frontendNotification);
      };

      // 웹소켓 알림 핸들러 등록
      wsClient.onNotification(handleNotification);

      // 연결 상태 변경 핸들러
      const handleConnectionStatus = (connected: boolean) => {
        console.log('WebSocket 연결 상태:', connected);
        if (!connected) {
          isConnected.current = false;
        }
      };

      wsClient.onConnectionStatusChange(handleConnectionStatus);

      // 클린업 함수
      return () => {
        wsClient.offNotification(handleNotification);
        wsClient.offConnectionStatusChange(handleConnectionStatus);
        wsClient.disconnect();
        isConnected.current = false;
      };
    }
  }, [addNotification]);

  return <>{children}</>;
} 