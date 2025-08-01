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