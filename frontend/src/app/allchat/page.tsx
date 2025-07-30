'use client';

import { useState } from 'react';
import Header from '../../shared/components/layout/Header';
import Footer from '../../shared/components/layout/Footer';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'other';
  timestamp: Date;
}

interface ChatRoom {
  id: number;
  guardianName: string;
  shelterName?: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
}

export default function AllChatPage() {
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: '안녕하세요! 입양 관련 문의가 있으시면 언제든 말씀해 주세요.',
      sender: 'other',
      timestamp: new Date(Date.now() - 60000)
    },
    {
      id: 2,
      text: '네, 멍멍이 입양에 대해 궁금한 점이 있어요.',
      sender: 'user',
      timestamp: new Date(Date.now() - 30000)
    },
    {
      id: 3,
      text: '어떤 점이 궁금하신가요?',
      sender: 'other',
      timestamp: new Date()
    }
  ]);

  const [chatRooms] = useState<ChatRoom[]>([
    {
      id: 1,
      guardianName: '김보호',
      shelterName: '사랑의 동물보호소',
      lastMessage: '어떤 점이 궁금하신가요?',
      lastMessageTime: new Date(),
      unreadCount: 0
    },
    {
      id: 2,
      guardianName: '최동물',
      lastMessage: '새로운 가족을 찾고 있어요.',
      lastMessageTime: new Date(Date.now() - 10800000),
      unreadCount: 2
    }
  ]);

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage: Message = {
        id: messages.length + 1,
        text: message,
        sender: 'user',
        timestamp: new Date()
      };
      setMessages([...messages, newMessage]);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
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
                <p className="text-sm text-gray-600">보호자와 1:1 상담</p>
              </div>
              
              <div className="overflow-y-auto h-full">
                {chatRooms.map((room) => (
                  <div
                    key={room.id}
                    onClick={() => setSelectedChat(room.id)}
                    className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedChat === room.id ? 'bg-orange-50 border-orange-200' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{room.guardianName}</h3>
                        {room.shelterName && (
                          <p className="text-xs text-gray-500">{room.shelterName}</p>
                        )}
                        <p className="text-sm text-gray-600 truncate">{room.lastMessage}</p>
                        <p className="text-xs text-gray-500">
                          {room.lastMessageTime.toLocaleTimeString('ko-KR', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      {room.unreadCount > 0 && (
                        <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                          {room.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 채팅 영역 */}
            <div className="flex-1 flex flex-col">
              {selectedChat ? (
                <>
                  {/* 채팅 헤더 */}
                  <div className="p-4 border-b border-gray-200 h-20 flex flex-col justify-center">
                    <h3 className="font-semibold text-gray-900">
                      {chatRooms.find(room => room.id === selectedChat)?.guardianName}
                    </h3>
                    {chatRooms.find(room => room.id === selectedChat)?.shelterName && (
                      <p className="text-sm text-gray-600">
                        {chatRooms.find(room => room.id === selectedChat)?.shelterName}
                      </p>
                    )}
                  </div>

                  {/* 메시지 영역 */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            msg.sender === 'user'
                              ? 'bg-orange-500 text-white'
                              : 'bg-gray-200 text-gray-900'
                          }`}
                        >
                          <p className="text-sm">{msg.text}</p>
                          <p className={`text-xs mt-1 ${
                            msg.sender === 'user' ? 'text-orange-100' : 'text-gray-500'
                          }`}>
                            {msg.timestamp.toLocaleTimeString('ko-KR', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
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