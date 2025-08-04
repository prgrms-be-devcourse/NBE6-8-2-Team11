'use client';

<<<<<<< HEAD
import { useEffect, useState } from 'react';
=======
import { useEffect } from 'react';
>>>>>>> 429aa072f86945f94da7672eb5bceec7bf216277
import { Notification } from '../../../types/notification';

interface RealTimeNotificationProps {
  notification: Notification;
  onClose: () => void;
}

const getNotificationIcon = (type: Notification['type']) => {
  switch (type) {
    case 'ADOPTION_ACCEPTED':
    case 'CARE_ACCEPTED':
      return (
        <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      );
    case 'ADOPTION_REJECTED':
    case 'CARE_REJECTED':
      return (
        <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      );
    case 'ADOPTION_REQUESTED':
    case 'CARE_REQUESTED':
      return (
        <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      );
    case 'NEW_MESSAGE':
      return (
        <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5zM15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" clipRule="evenodd" />
        </svg>
      );
    case 'CHAT_ROOM_DELETED':
      return (
        <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9zM10 9a1 1 0 011 1v6a1 1 0 11-2 0v-6a1 1 0 011-1zM10 4a1 1 0 011 1v1a1 1 0 11-2 0V5a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
      );
    default:
      return (
        <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
      );
  }
};

const getNotificationColor = (type: Notification['type']) => {
  switch (type) {
    case 'ADOPTION_ACCEPTED':
    case 'CARE_ACCEPTED':
<<<<<<< HEAD
      return 'bg-green-50 border-green-200 text-green-800';
    case 'ADOPTION_REJECTED':
    case 'CARE_REJECTED':
      return 'bg-red-50 border-red-200 text-red-800';
    case 'ADOPTION_REQUESTED':
    case 'CARE_REQUESTED':
      return 'bg-yellow-50 border-yellow-200 text-yellow-800';
    case 'NEW_MESSAGE':
      return 'bg-orange-50 border-orange-200 text-orange-800';
    case 'CHAT_ROOM_DELETED':
      return 'bg-gray-50 border-gray-200 text-gray-800';
    default:
      return 'bg-blue-50 border-blue-200 text-blue-800';
=======
      return 'bg-green-50 border-l-green-500';
    case 'ADOPTION_REJECTED':
    case 'CARE_REJECTED':
      return 'bg-red-50 border-l-red-500';
    case 'ADOPTION_REQUESTED':
    case 'CARE_REQUESTED':
      return 'bg-yellow-50 border-l-yellow-500';
    case 'NEW_MESSAGE':
      return 'bg-orange-50 border-l-orange-500';
    case 'CHAT_ROOM_DELETED':
      return 'bg-gray-50 border-l-gray-500';
    default:
      return 'bg-blue-50 border-l-blue-500';
>>>>>>> 429aa072f86945f94da7672eb5bceec7bf216277
  }
};

export default function RealTimeNotification({ notification, onClose }: RealTimeNotificationProps) {
<<<<<<< HEAD
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    // 알림이 나타나는 애니메이션
    const timer = setTimeout(() => setIsVisible(true), 100);
    
    // 5초 후 자동으로 사라짐
    const autoCloseTimer = setTimeout(() => {
      setIsClosing(true);
      setTimeout(onClose, 300);
    }, 5000);

    return () => {
      clearTimeout(timer);
      clearTimeout(autoCloseTimer);
    };
  }, [onClose]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 300);
  };

  return (
    <div
      className={`fixed top-4 right-4 z-50 max-w-sm w-full transform transition-all duration-300 ${
        isVisible && !isClosing ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <div className={`rounded-lg border shadow-lg p-4 ${getNotificationColor(notification.type)}`}>
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            {getNotificationIcon(notification.type)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">
              {notification.title}
            </p>
            <p className="text-sm mt-1 opacity-90">
              {notification.message}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
=======
  // 5초 후 자동으로 닫기
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`w-80 p-4 rounded-lg shadow-lg border-l-4 ${getNotificationColor(notification.type)} animate-slide-in`}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          {getNotificationIcon(notification.type)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900">
            {notification.title}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            {notification.message}
          </p>
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
>>>>>>> 429aa072f86945f94da7672eb5bceec7bf216277
      </div>
    </div>
  );
} 