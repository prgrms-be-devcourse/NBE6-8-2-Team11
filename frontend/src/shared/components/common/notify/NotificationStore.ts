import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Notification, NotificationState, NotificationAction } from '../../../types/notification';

type NotificationStore = NotificationState & NotificationAction;

const createNotificationStore = () => {
  if (typeof window !== 'undefined') {
    return create<NotificationStore>()(
      persist(
        (set) => ({
          notifications: [],
          unreadCount: 0,
          isLoading: false,

          addNotification: (notification) => {
<<<<<<< HEAD
            const newNotification: Notification = {
              ...notification,
              id: Date.now(),
              createdAt: new Date().toISOString(),
              isRead: false,
            };

            set((state) => ({
              notifications: [newNotification, ...state.notifications],
              unreadCount: state.unreadCount + 1,
            }));
=======
            // 클라이언트에서만 실행되도록 보장
            const timestamp = typeof window !== 'undefined' ? Date.now() : 0;
            const now = typeof window !== 'undefined' ? new Date().toISOString() : '';
            
            const newNotification: Notification = {
              ...notification,
              id: timestamp,
              createdAt: now,
              isRead: false,
            };

            set((state) => {
              // 중복 알림 체크 (같은 제목, 메시지, 타입을 가진 알림이 최근 10초 내에 있으면 무시)
              const recentNotifications = state.notifications.filter(n => 
                Date.now() - new Date(n.createdAt).getTime() < 10000
              );
              
              const isDuplicate = recentNotifications.some(n => 
                n.title === notification.title && 
                n.message === notification.message &&
                n.type === notification.type
              );
              
              if (isDuplicate) {
                console.log('Duplicate notification ignored:', notification);
                return state; // 중복이면 상태 변경하지 않음
              }

              // 최대 50개의 알림만 유지
              const updatedNotifications = [newNotification, ...state.notifications].slice(0, 50);

              return {
                notifications: updatedNotifications,
                unreadCount: state.unreadCount + 1,
              };
            });
>>>>>>> 429aa072f86945f94da7672eb5bceec7bf216277
          },

          markAsRead: (id) => {
            set((state) => {
              const updatedNotifications = state.notifications.map((notification) =>
                notification.id === id ? { ...notification, isRead: true } : notification
              );
              const unreadCount = updatedNotifications.filter((n) => !n.isRead).length;
              return {
                notifications: updatedNotifications,
                unreadCount,
              };
            });
          },

          markAllAsRead: () => {
            set((state) => ({
              notifications: state.notifications.map((notification) => ({
                ...notification,
                isRead: true,
              })),
              unreadCount: 0,
            }));
          },

          removeNotification: (id) => {
            set((state) => {
              const notification = state.notifications.find((n) => n.id === id);
              const unreadCount = notification && !notification.isRead 
                ? state.unreadCount - 1 
                : state.unreadCount;
              
              return {
                notifications: state.notifications.filter((n) => n.id !== id),
                unreadCount,
              };
            });
          },

          clearAll: () => {
            set({
              notifications: [],
              unreadCount: 0,
            });
          },

          setNotifications: (notifications) => {
            const unreadCount = notifications.filter((n) => !n.isRead).length;
            set({
              notifications,
              unreadCount,
            });
          },
        }),
        {
          name: 'notification-storage',
          partialize: (state) => ({
            notifications: state.notifications,
            unreadCount: state.unreadCount,
          }),
        }
      )
    );
  } else {
    // 서버 사이드에서는 persist 없이 생성
    return create<NotificationStore>()((set) => ({
      notifications: [],
      unreadCount: 0,
      isLoading: false,

      addNotification: (notification) => {
<<<<<<< HEAD
        const newNotification: Notification = {
          ...notification,
          id: Date.now(),
          createdAt: new Date().toISOString(),
=======
        // 서버에서는 기본값 사용
        const newNotification: Notification = {
          ...notification,
          id: 0,
          createdAt: '',
>>>>>>> 429aa072f86945f94da7672eb5bceec7bf216277
          isRead: false,
        };

        set((state) => ({
          notifications: [newNotification, ...state.notifications],
          unreadCount: state.unreadCount + 1,
        }));
      },

      markAsRead: (id) => {
        set((state) => {
          const updatedNotifications = state.notifications.map((notification) =>
            notification.id === id ? { ...notification, isRead: true } : notification
          );
          const unreadCount = updatedNotifications.filter((n) => !n.isRead).length;
          return {
            notifications: updatedNotifications,
            unreadCount,
          };
        });
      },

      markAllAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((notification) => ({
            ...notification,
            isRead: true,
          })),
          unreadCount: 0,
        }));
      },

      removeNotification: (id) => {
        set((state) => {
          const notification = state.notifications.find((n) => n.id === id);
          const unreadCount = notification && !notification.isRead 
            ? state.unreadCount - 1 
            : state.unreadCount;
          
          return {
            notifications: state.notifications.filter((n) => n.id !== id),
            unreadCount,
          };
        });
      },

      clearAll: () => {
        set({
          notifications: [],
          unreadCount: 0,
        });
      },

      setNotifications: (notifications) => {
        const unreadCount = notifications.filter((n) => !n.isRead).length;
        set({
          notifications,
          unreadCount,
        });
      },
    }));
  }
};

export const useNotificationStore = createNotificationStore(); 