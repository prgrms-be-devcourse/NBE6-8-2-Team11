'use client';

import { useEffect } from 'react';
import { wsClient } from './websocket';
import { useAuth } from '../../context/AuthContext';

export default function WebSocketInitializer() {
  const { isLoggedIn, userInfo } = useAuth();

  useEffect(() => {
    const initializeWebSocket = async () => {
      const token = localStorage.getItem('accessToken');
      
      console.log('WebSocket initialization - Token:', !!token, 'UserInfo:', userInfo, 'IsLoggedIn:', isLoggedIn);
      
      if (token && isLoggedIn && userInfo) {
        // 기존 연결 해제
        wsClient.disconnect();
        
        // 새로 연결 (userInfo.sub에서 userId 추출)
        const userId = parseInt(userInfo.sub, 10);
        console.log('Connecting WebSocket with userId:', userId);
        wsClient.connect(token, userId);
        
        // 연결 후 구독 강제 실행
        setTimeout(() => {
          if (wsClient.getConnectionStatus()) {
            console.log('WebSocket connected, subscribing to notifications...');
            wsClient.subscribeToPersonalNotifications();
          } else {
            console.warn('WebSocket not connected, retrying subscription...');
            // 재시도
            setTimeout(() => {
              if (wsClient.getConnectionStatus()) {
                console.log('WebSocket reconnected, subscribing to notifications...');
                wsClient.subscribeToPersonalNotifications();
              }
            }, 2000);
          }
        }, 2000);
      } else {
        console.warn('WebSocket initialization failed - missing token or user info');
      }
    };

    initializeWebSocket();
  }, [isLoggedIn, userInfo]);

  // 실시간 알림 처리
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleNotification = (notification: any) => {
      console.log('Received notification:', notification);
      
      // RealTimeNotificationManager에서 처리하므로 여기서는 NotificationStore에 추가하지 않음
      // addNotification({
      //   title: notification.title || '새 알림',
      //   message: notification.message || notification.content || '새로운 알림이 도착했습니다.',
      //   type: notification.type || 'NEW_MESSAGE',
      //   userId: userInfo ? parseInt(userInfo.sub, 10) : 0,
      // });
    };

    // WebSocket 알림 핸들러 등록
    wsClient.onNotification(handleNotification);

    // 컴포넌트 언마운트 시 핸들러 제거
    return () => {
      wsClient.offNotification(handleNotification);
    };
  }, [userInfo]);

  return null;
} 