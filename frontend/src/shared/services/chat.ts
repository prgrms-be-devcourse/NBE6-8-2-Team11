import { apiClient } from './apiClient';
import { ChatRoom, ChatMessage } from '../types/chat';

export interface CreateChatRoomRequest {
  firstMemberId: number;
  secondMemberId: number;
}

export const chatService = {
  // 채팅방 생성
  async createChatRoom(request: CreateChatRoomRequest): Promise<ChatRoom> {
    const queryParams = new URLSearchParams();
    queryParams.append('firstMemberId', request.firstMemberId.toString());
    queryParams.append('secondMemberId', request.secondMemberId.toString());
    
    const endpoint = `/chat?${queryParams.toString()}`;
    const response = await apiClient.post<ChatRoom>(endpoint);
    return response.content;
  },

  // 사용자의 채팅방 목록 조회
  async getUserChatRooms(): Promise<ChatRoom[]> {
    const response = await apiClient.get<ChatRoom[]>('/chat');
    return response.content;
  },

  // 특정 채팅방의 메시지 조회 (백엔드에서 WebSocket으로 응답)
  async getChatMessages(roomId: number): Promise<ChatMessage[]> {
    const response = await apiClient.get<ChatMessage[]>(`/chat/${roomId}`);
    return response.content;
  }
}; 