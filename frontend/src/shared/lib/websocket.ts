import SockJS from 'sockjs-client';
import { Client, Message } from '@stomp/stompjs';
import { ChatMessage, ChatMessageRequest } from '../types/chat';

interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  timestamp: string;
}

interface ChatRoom {
  id: number;
  name: string;
  participants: number[];
  lastMessage?: string;
  lastMessageTime?: string;
}

interface StompFrame {
  command: string;
  headers: Record<string, string>;
  body?: string;
}

class WebSocketClient {
  private client: Client | null = null;
  private messageHandlers: ((message: ChatMessage) => void)[] = [];
  private notificationHandlers: ((notification: Notification) => void)[] = [];
  private chatRoomUpdateHandlers: ((room: ChatRoom) => void)[] = [];
  private isConnected = false;
  private currentUserId: number | null = null;
  private connectionStatusHandlers: ((connected: boolean) => void)[] = [];
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private subscribedRooms: Set<number> = new Set();
  private pendingSubscriptions: Array<{roomId: number, senderId: number}> = [];

  connect(token: string, userId: number) {
    this.currentUserId = userId;
    
    // 환경에 따른 WebSocket URL 설정
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
    const wsEndpoint = `${apiUrl}/ws-chat`;
    
    
    this.client = new Client({
      webSocketFactory: () => new WebSocket("wss://nbe6-8-2-team11.onrender.com/ws-chat"),
      connectHeaders: {
        'Authorization': `Bearer ${token}`
      },
      debug: function (str: string) {
        console.log('STOMP Debug:', str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    this.client.onConnect = () => {
      console.log('WebSocket connected');
      const wasConnected = this.isConnected;
      this.isConnected = true;
      this.reconnectAttempts = 0; // 연결 성공 시 재시도 횟수 리셋
      
      // 연결 상태가 변경된 경우에만 핸들러 호출
      if (!wasConnected) {
        this.connectionStatusHandlers.forEach(handler => handler(true));
      }
      
      // 연결이 완전히 설정된 후에 구독 처리
      setTimeout(() => {
        // 개인 알림 구독
        this.subscribeToPersonalNotifications();
        
        // 대기 중인 구독 요청들 처리
        this.processPendingSubscriptions();
      }, 100); // 100ms 지연으로 연결 안정화
    };

    this.client.onDisconnect = () => {
      console.log('WebSocket disconnected');
      const wasConnected = this.isConnected;
      this.isConnected = false;
      
      // 연결 상태가 변경된 경우에만 핸들러 호출
      if (wasConnected) {
        this.connectionStatusHandlers.forEach(handler => handler(false));
      }
    };

    this.client.onStompError = (frame: StompFrame) => {
      console.error('WebSocket STOMP error:', frame);
      console.error('Error details:', {
        command: frame.command,
        headers: frame.headers,
        body: frame.body
      });
      this.isConnected = false;
      this.connectionStatusHandlers.forEach(handler => handler(false));
      
      // 재연결 시도
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnectAttempts++;
        console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
        setTimeout(() => {
          this.connect(token, userId);
        }, 5000);
      } else {
        console.error('Max reconnection attempts reached');
      }
    };

    this.client.activate();
  }

  disconnect() {
    if (this.client) {
      this.client.deactivate();
      this.client = null;
      this.isConnected = false;
      this.currentUserId = null;
      this.reconnectAttempts = 0;
      this.subscribedRooms.clear();
      this.pendingSubscriptions = [];
    }
  }

  // 대기 중인 구독 요청들 처리
  private processPendingSubscriptions() {
    console.log('Processing pending subscriptions:', this.pendingSubscriptions);
    this.pendingSubscriptions.forEach(({roomId, senderId}) => {
      this.joinChatRoom(roomId, senderId);
    });
    this.pendingSubscriptions = [];
  }

  // 채팅방 입장 - /app/chat.addUser
  joinChatRoom(roomId: number, senderId: number) {
    if (this.client && this.isConnected) {
      try {
        console.log(`Joining chat room ${roomId} as user ${senderId}`);
        // 채팅방 입장
        this.client.publish({
          destination: '/app/chat.addUser',
          body: JSON.stringify({
            roomId,
            senderId,
            content: '입장',
          })
        });
        
        // 채팅방 토픽 구독
        this.subscribeToRoom(roomId);
        
        console.log('Joined and subscribed to chat room:', roomId);
      } catch (error) {
        console.error('Failed to join chat room:', error);
      }
    } else {
      console.log(`WebSocket not connected, adding to pending subscriptions: room ${roomId}`);
      this.pendingSubscriptions.push({roomId, senderId});
    }
  }

  // 메시지 전송 - /app/chat.sendMessage
  sendMessage(message: ChatMessageRequest) {
    if (this.client && this.isConnected) {
      try {
        console.log('Sending message via WebSocket:', message);
        this.client.publish({
          destination: '/app/chat.sendMessage',
          body: JSON.stringify(message)
        });
        console.log('Sent message to room:', message.roomId);
      } catch (error) {
        console.error('Failed to send message:', error);
      }
    } else {
      console.warn('WebSocket not connected. Cannot send message.');
    }
  }

  // 메시지 핸들러 등록
  onMessage(handler: (message: ChatMessage) => void) {
    console.log("wsClient.onMessage 호출됨");
    this.messageHandlers.push(handler);
  }

  // 메시지 핸들러 제거
  offMessage(handler: (message: ChatMessage) => void) {
    this.messageHandlers = this.messageHandlers.filter(h => h !== handler);
  }

  // 알림 핸들러 등록

  onNotification(handler: (notification: Notification) => void) {
    this.notificationHandlers.push(handler);
  }

  // 알림 핸들러 제거
  offNotification(handler: (notification: Notification) => void) {
    this.notificationHandlers = this.notificationHandlers.filter(h => h !== handler);
  }

  // 연결 상태 핸들러 등록
  onConnectionStatusChange(handler: (connected: boolean) => void) {
    this.connectionStatusHandlers.push(handler);
  }

  // 연결 상태 핸들러 제거
  offConnectionStatusChange(handler: (connected: boolean) => void) {
    this.connectionStatusHandlers = this.connectionStatusHandlers.filter(h => h !== handler);
  }

  // 현재 연결 상태 확인
  getConnectionStatus(): boolean {
    return this.isConnected;
  }

  // 특정 채팅방 구독 - /topic/chat/{roomId}
  subscribeToRoom(roomId: number) {
    if (this.client && this.isConnected) {
      try {
        console.log(`Attempting to subscribe to room: /topic/chat/${roomId}`);
        
        if (this.subscribedRooms.has(roomId)) {
          console.log(`Already subscribed to room ${roomId}`);
          return;
        }

        this.client.subscribe(`/topic/chat/${roomId}`, (message: Message) => {
          try {
            console.log(`Received message from /topic/chat/${roomId}:`, message.body);
            const response = JSON.parse(message.body);
            console.log('Parsed message response:', response);
            
            // 백엔드 응답 형식을 프론트엔드 형식으로 변환
            const chatMessage: ChatMessage = {
              id: response.messageId, // messageId를 id로 매핑
              content: response.content,
              sentAt: response.sentAt,
              senderId: response.senderId,
              senderName: response.senderName,
              roomId: response.roomId,
            };
            
            console.log('Converted chat message:', chatMessage);
            this.messageHandlers.forEach(handler => handler(chatMessage));
          } catch (error) {
            console.error('Failed to parse message:', error);
          }
        });
        
        this.subscribedRooms.add(roomId);
        console.log(`Successfully subscribed to room: /topic/chat/${roomId}`);
      } catch (error) {
        console.error('Failed to subscribe to room:', error);
      }
    } else {
      console.warn('WebSocket not connected. Cannot subscribe to room.');
    }
  }

  // 개인 알림 구독 - /queue/notifications/{userId}
  subscribeToPersonalNotifications() {
    if (!this.client || !this.isConnected || !this.currentUserId) {
      console.warn('WebSocket not connected or user ID not set. Cannot subscribe to notifications.');
      console.warn('Client:', !!this.client, 'Connected:', this.isConnected, 'UserId:', this.currentUserId);
      return;
    }

    try {
      const notificationDestination = `/queue/notifications/${this.currentUserId}`;
      const chatRoomDestination = `/queue/chat-rooms/${this.currentUserId}`;
      
      console.log('Subscribing to notifications at:', notificationDestination);
      console.log('Subscribing to chat room updates at:', chatRoomDestination);
      
      // 사용자별 알림 큐 구독
      this.client.subscribe(notificationDestination, (message: Message) => {
        try {
          const notification = JSON.parse(message.body);
          console.log('Received personal notification:', notification);
          this.notificationHandlers.forEach(handler => handler(notification));
        } catch (error) {
          console.error('Failed to parse notification:', error);
        }
      });

      // 채팅방 업데이트 알림 구독 - /queue/chat-rooms/{userId}
      this.client.subscribe(chatRoomDestination, (message: Message) => {
        try {
          const chatRoom = JSON.parse(message.body);
          console.log('Received chat room update:', chatRoom);
          this.chatRoomUpdateHandlers.forEach(handler => handler(chatRoom));
        } catch (error) {
          console.error('Failed to parse chat room update:', error);
        }
      });

      console.log('Subscribed to personal notifications and chat room updates for user:', this.currentUserId);
    } catch (error) {
      console.error('Failed to subscribe to personal notifications:', error);
    }
  }

  // 채팅방 업데이트 핸들러 등록
  onChatRoomUpdate(handler: (room: ChatRoom) => void) {
    this.chatRoomUpdateHandlers.push(handler);
  }

  // 채팅방 업데이트 핸들러 제거
  offChatRoomUpdate(handler: (room: ChatRoom) => void) {
    this.chatRoomUpdateHandlers = this.chatRoomUpdateHandlers.filter(h => h !== handler);
  }

  // 구독된 채팅방 목록 확인
  getSubscribedRooms(): number[] {
    return Array.from(this.subscribedRooms);
  }
}

export const wsClient = new WebSocketClient(); 
