export interface ChatMessage {
  id: number;
  content: string;
  sentAt: string;
  senderId: number;
  senderName: string;
  roomId: number;
}

export interface ChatRoom {
  id: number;
  createdAt: string;
  firstMemberId: number;
  secondMemberId: number;
}

export interface Member {
  id: number;
  email: string;
  name: string;
  phone: string;
  role: string;
}

export interface ChatMessageRequest {
  roomId: number;
  senderId: number;
  content: string;
}

export interface ApiResponse<T> {
  success: boolean;
  code: string;
  message: string;
  content: T;
} 