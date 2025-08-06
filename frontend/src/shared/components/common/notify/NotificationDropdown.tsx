'use client';

import { useRef, useEffect } from 'react';
import { useNotificationStore } from './NotificationStore';
import { Notification } from '../../../types/notification';
import { format, parseISO } from 'date-fns';

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

const getNotificationIcon = (type: Notification['type']) => {
  switch (type) {
    case 'ADOPTION_ACCEPTED':
    case 'CARE_ACCEPTED':
      return (
        <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      );
    case 'ADOPTION_REJECTED':
    case 'CARE_REJECTED':
      return (
        <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      );
    case 'ADOPTION_REQUESTED':
    case 'CARE_REQUESTED':
      return (
        <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      );
    case 'NEW_MESSAGE':
      return (
        <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5zM15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" clipRule="evenodd" />
        </svg>
      );
    case 'CHAT_ROOM_DELETED':
      return (
        <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9zM10 9a1 1 0 011 1v6a1 1 0 11-2 0v-6a1 1 0 011-1zM10 4a1 1 0 011 1v1a1 1 0 11-2 0V5a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
      );
    default:
      return (
        <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
      );
  }
};

const getNotificationTypeText = (type: Notification['type']) => {
  switch (type) {
    case 'ADOPTION_ACCEPTED':
      return '입양 승인';
    case 'ADOPTION_REJECTED':
      return '입양 거절';
    case 'ADOPTION_REQUESTED':
      return '입양 신청';
    case 'CARE_ACCEPTED':
      return '돌봄 승인';
    case 'CARE_REJECTED':
      return '돌봄 거절';
    case 'CARE_REQUESTED':
      return '돌봄 신청';
    case 'NEW_MESSAGE':
      return '새 메시지';
    case 'CHAT_ROOM_DELETED':
      return '채팅방 삭제';
    default:
      return '알림';
  }
};

const getNotificationColor = (type: Notification['type']) => {
  switch (type) {
    case 'ADOPTION_ACCEPTED':
    case 'CARE_ACCEPTED':
      return 'border-l-green-500 bg-green-50';
    case 'ADOPTION_REJECTED':
    case 'CARE_REJECTED':
      return 'border-l-red-500 bg-red-50';
    case 'ADOPTION_REQUESTED':
    case 'CARE_REQUESTED':
      return 'border-l-yellow-500 bg-yellow-50';
    case 'NEW_MESSAGE':
      return 'border-l-orange-500 bg-orange-50';
    case 'CHAT_ROOM_DELETED':
      return 'border-l-gray-500 bg-gray-50';
    default:
      return 'border-l-blue-500 bg-blue-50';
  }
};

export default function NotificationDropdown({ isOpen, onClose }: NotificationDropdownProps) {
  const { notifications, unreadCount, markAsRead, markAllAsRead, removeNotification, clearAll } = useNotificationStore();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
  };

  const handleDeleteNotification = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    removeNotification(id);
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };

  const handleClearAll = () => {
    clearAll();
  };

  // 메시지 시간 포맷팅 함수
  const formatAlertTime = (timestamp: string | number | Array<number>): string => {
    console.log('formatMessageTime called with timestamp:', timestamp);
    
    try {
      let date: Date;
      
      if (Array.isArray(timestamp)) {
        // 배열 형태의 날짜 처리 [year, month, day, hour, minute, second, nano]
        const [year, month, day, hour, minute, second] = timestamp;
        date = new Date(year, month - 1, day, hour, minute, second);
      } else if (typeof timestamp === 'string') {
        // ISO 문자열인 경우 parseISO 사용
        if (timestamp.includes('T')) {
          date = parseISO(timestamp);
        } else {
          // 일반 문자열인 경우 new Date 사용
          date = new Date(timestamp);
        }
      } else if (typeof timestamp === 'number') {
        date = new Date(timestamp);
      } else {
        return '알 수 없는 시간';
      }
      
      if (isNaN(date.getTime())) {
        return '알 수 없는 시간';
      }
      
      // 서버와 클라이언트에서 동일한 형식 사용
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const result = format(date, 'yyyy-MM-dd') + ' ' + `${hours}:${minutes}`;
      return result;
    } catch (_error) {
      console.error('Date parsing error:', _error, 'for date:', timestamp);
      return '알 수 없는 시간';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-900">
            알림 ({unreadCount}개 읽지 않음)
          </h3>
          <div className="flex items-center space-x-2">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-xs text-orange-500 hover:text-orange-700"
              >
                모두 읽음 처리
              </button>
            )}
            {notifications.length > 0 && (
              <button
                onClick={handleClearAll}
                className="text-xs text-orange-500 hover:text-orange-700"
              >
                모두 삭제
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="text-center py-8">
            <svg className="mx-auto h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4 19h6a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <p className="mt-2 text-sm text-gray-500">알림이 없습니다</p>
          </div>
        ) : (
          <div className="space-y-1">
            {notifications
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .slice(0, 10)
              .map((notification) => (
              <div
                key={notification.id}
                className={`p-3 border-l-4 ${
                  notification.isRead 
                    ? 'border-l-gray-300 bg-white' 
                    : getNotificationColor(notification.type)
                } ${
                  !notification.isRead ? 'ring-1 ring-blue-200' : ''
                } cursor-pointer hover:bg-gray-50 transition-colors`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex items-start space-x-2">
                  <div className="flex-shrink-0 mt-0.5">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className={`text-xs font-medium ${
                        !notification.isRead ? 'text-gray-900' : 'text-gray-700'
                      }`}>
                        {notification.title}
                      </p>
                      <span className="text-xs text-gray-500 ml-4">
                        {getNotificationTypeText(notification.type)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatAlertTime(notification.createdAt)}
                    </p>
                  </div>
                  <button
                    onClick={(e) => handleDeleteNotification(notification.id, e)}
                    className="flex-shrink-0 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
            {notifications.length > 10 && (
              <div className="p-3 text-center">
                <p className="text-xs text-gray-500">
                  더 많은 알림이 있습니다 ({notifications.length - 10}개 더)
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 