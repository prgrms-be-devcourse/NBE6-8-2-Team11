'use client';

import { useState, useEffect } from 'react';
import Header from '../../shared/components/layout/Header';
import Footer from '../../shared/components/layout/Footer';
import { ChatRoom, ChatMessage } from '@/shared/types/chat';
import { chatService } from '@/shared/services/chat';
import { memberService } from '@/shared/services/member';
import { wsClient } from '@/shared/lib/websocket';
import { useChatStore } from '@/shared/components/common/chat/chatStore';
import { getCurrentUserIdSync } from '@/shared/services/auth';
import { format, parseISO } from 'date-fns';

export default function AllChatPage() {
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [opponentNames, setOpponentNames] = useState<Record<number, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  
  const currentUserId = getCurrentUserIdSync();
  const { addMessage, loadRoomMessages, messages: storeMessages } = useChatStore();

  // 현재 선택된 채팅방의 메시지
  const messages = selectedChat ? (storeMessages[selectedChat] || []) : [];

  // 채팅방 목록 로드
  useEffect(() => {
    const fetchChatRooms = async () => {
      try {
        setIsLoading(true);
        const rooms = await chatService.getUserChatRooms();
        
        // rooms가 배열인지 확인
        if (!Array.isArray(rooms)) {
          // 단일 객체인 경우 배열로 변환
          if (rooms && typeof rooms === 'object') {
            setChatRooms([rooms]);
          } else {
            setChatRooms([]);
          }
          return;
        }
        
        setChatRooms(rooms);
        
        // 각 채팅방의 상대방 이름 가져오기
        const names: Record<number, string> = {};
        for (const room of rooms) {
          const opponentId = room.firstMemberId === currentUserId 
            ? room.secondMemberId 
            : room.firstMemberId;
          
          try {
            const user = await memberService.getUserById(opponentId);
            names[room.id] = user.name;
          } catch (error) {
            console.error('Failed to get user info for room:', room.id, error);
            names[room.id] = `사용자 ${opponentId}`;
          }
        }
        setOpponentNames(names);
      } catch (error) {
        console.error('Failed to fetch chat rooms:', error);
        setChatRooms([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (currentUserId) {
      fetchChatRooms();
    }
  }, [currentUserId]);

  // WebSocket 연결 초기화
  useEffect(() => {
    const initializeWebSocket = async () => {
      const token = localStorage.getItem('accessToken');
      if (token && currentUserId) {
        console.log('Initializing WebSocket connection...');
        wsClient.connect(token, currentUserId);
        // 개인 메시지 구독 제거 - 채팅방 선택 시에만 구독
      }
    };

    initializeWebSocket();
  }, [currentUserId]);

  // 메시지 수신 처리
  useEffect(() => {
    const handleMessage = (receivedMessage: ChatMessage) => {
      console.log('Received message:', receivedMessage);
      
      // 선택된 채팅방의 메시지인 경우에만 UI 업데이트
      if (selectedChat && receivedMessage.roomId === selectedChat) {
        // setMessages(prev => [...prev, receivedMessage]); // 스토어에서 관리
      }
      
      // 스토어에도 메시지 추가
      addMessage(receivedMessage.roomId, receivedMessage);
    };

    wsClient.onMessage(handleMessage);
    return () => {
      wsClient.offMessage(handleMessage);
    };
  }, [selectedChat, currentUserId, addMessage]);

  // 채팅방 선택 시 메시지 로드
  useEffect(() => {
    if (selectedChat) {
      const loadMessages = async () => {
        try {
          console.log(`Loading messages for room ${selectedChat}`);
          
          // 이전 채팅방 구독 해제 (필요한 경우)
          // wsClient.unsubscribeFromRoom(previousRoom);
          
          // 새로운 채팅방 구독
          wsClient.subscribeToRoom(selectedChat);
          
          // 스토어에서 메시지 로드
          await loadRoomMessages(selectedChat);
          
        } catch (error) {
          console.error('Failed to load messages:', error);
        }
      };

      loadMessages();
    }
  }, [selectedChat, loadRoomMessages]);

  const handleSendMessage = () => {
    if (message.trim() && selectedChat) {
      // WebSocket으로 메시지 전송
      wsClient.sendMessage({
        roomId: selectedChat,
        senderId: currentUserId,
        content: message.trim()
      });
      
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // 메시지 시간 포맷팅 함수
  const formatMessageTime = (timestamp: string | number | Array<number>): string => {
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
      const result = `${hours}:${minutes}`;
      return result;
    } catch (_error) {
      console.error('Date parsing error:', _error, 'for date:', timestamp);
      return '알 수 없는 시간';
    }
  };

  // 안전한 날짜 포맷팅 함수
  const formatDate = (timestamp: string | null | undefined): string => {
    if (!timestamp) return '날짜 정보 없음';
    
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
      } else {
        return '날짜 정보 없음';
      }
    
      if (isNaN(date.getTime())) {
        return '날짜 정보 없음';
      }
      
      const result = format(date, 'yyyy-MM-dd');
      return result;
    } catch {
      return '날짜 정보 없음';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="flex h-[600px]">
            {/* 채팅방 목록 */}
            <div className="w-1/3 border-r border-gray-200">
              <div className="p-4 border-b border-gray-200 h-20 flex flex-col justify-center">
                <h2 className="text-lg font-semibold text-gray-900">채팅</h2>
                <p className="text-sm text-gray-600">1:1 문의</p>
              </div>
              
              <div className="overflow-y-auto h-full">
                {isLoading ? (
                  <div className="flex justify-center items-center h-32">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
                  </div>
                ) : chatRooms.length > 0 ? (
                  chatRooms.map((room, index) => (
                    <div
                      key={`room-${room.id}-${index}`}
                      onClick={() => setSelectedChat(room.id)}
                      className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedChat === room.id ? 'bg-orange-50 border-orange-200' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">
                            {opponentNames[room.id] || `사용자 ${room.firstMemberId === currentUserId ? room.secondMemberId : room.firstMemberId}`}
                          </h3>
                          <p className="text-sm text-gray-600 truncate">
                            채팅방 #{room.id}
                          </p>
                          <p className="text-xs text-gray-500">
                            생성일: {formatDate(room.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    채팅방이 없습니다.
                  </div>
                )}
              </div>
            </div>

            {/* 채팅 영역 */}
            <div className="flex-1 flex flex-col">
              {selectedChat ? (
                <>
                  {/* 채팅 헤더 */}
                  <div className="p-4 border-b border-gray-200 h-20 flex flex-col justify-center">
                    <h3 className="font-semibold text-gray-900">
                      {opponentNames[selectedChat] || `사용자 ${chatRooms.find(room => room.id === selectedChat)?.firstMemberId === currentUserId ? chatRooms.find(room => room.id === selectedChat)?.secondMemberId : chatRooms.find(room => room.id === selectedChat)?.firstMemberId}`}
                    </h3>
                    <p className="text-sm text-gray-600">
                      채팅방 #{selectedChat}
                    </p>
                  </div>

                  {/* 메시지 영역 */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.length === 0 ? (
                      <div className="flex justify-center items-center h-full">
                        <p className="text-gray-500">메시지가 없습니다.</p>
                      </div>
                    ) : (
                      messages.map((msg, index) => (
                        <div
                          key={`msg-${msg.id}-${index}`}
                          className={`flex ${msg.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              msg.senderId === currentUserId
                                ? 'bg-orange-500 text-white'
                                : 'bg-gray-200 text-gray-900'
                            }`}
                          >
                            <p className="text-sm">{msg.content}</p>
                            <p className={`text-xs mt-1 ${
                              msg.senderId === currentUserId ? 'text-orange-100' : 'text-gray-500'
                            }`}>
                              {formatMessageTime(msg.sentAt)}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* 메시지 입력 */}
                  <div className="p-4 border-t border-gray-200">
                    <div className="flex space-x-2">
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="메시지를 입력하세요..."
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
                        rows={2}
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={!message.trim()}
                        className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        전송
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                // 채팅방 선택 안됨
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-gray-400 text-6xl mb-4">💬</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      채팅방을 선택하세요
                    </h3>
                    <p className="text-gray-600">
                      왼쪽에서 상담하고 싶은 보호자를 선택해주세요
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
} 