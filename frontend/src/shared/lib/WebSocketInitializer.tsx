'use client';

import { useEffect } from 'react';
import { wsClient } from './websocket';
import { useNotificationStore } from '../components/common/notify/NotificationStore';
import { useAuth } from '../../context/AuthContext';

export default function WebSocketInitializer() {
  const { addNotification } = useNotificationStore();
  const { userInfo, isLoggedIn } = useAuth();

  useEffect(() => {
    const initializeWebSocket = async () => {
      const token = localStorage.getItem('accessToken');
      
      if (token && userInfo && isLoggedIn) {
        // 사용자 ID를 userInfo에서 가져오기
        const userId = userInfo.id;
        
        if (userId) {
          console.log('Initializing WebSocket with userId:', userId);
          
          // 기존 연결 해제
          wsClient.disconnect();
          
          // 새로 연결
          wsClient.connect(token, userId);
          
          // 연결 후 구독 강제 실행
          setTimeout(() => {
            if (wsClient.getConnectionStatus()) {
              wsClient.subscribeToPersonalNotifications();
            }
          }, 1000);
        } else {
          console.warn('User ID not found in userInfo:', userInfo);
        }
      }
    };

    initializeWebSocket();
  }, [userInfo, isLoggedIn]);

  // 실시간 알림 처리
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleNotification = (notification: any) => {
      console.log('Received notification:', notification);
      
      // NotificationStore에 알림 추가
      addNotification({
        title: notification.title || '새 알림',
        message: notification.message || notification.content || '새로운 알림이 도착했습니다.',
        type: notification.type || 'NEW_MESSAGE',
        userId: userInfo?.id || 0,
      });
    };

    // WebSocket 알림 핸들러 등록
    wsClient.onNotification(handleNotification);

    // 컴포넌트 언마운트 시 핸들러 제거
    return () => {
      wsClient.offNotification(handleNotification);
    };
  }, [addNotification, userInfo]);

  return null;
} 