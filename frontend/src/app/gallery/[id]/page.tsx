'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Header from '../../../shared/components/layout/Header';
import Footer from '../../../shared/components/layout/Footer';
import { petService } from '../../../shared/services/petService';
import { chatService } from '../../../shared/services/chat';
import { Pet } from '../../../shared/types';
import { formatAnimalAge, formatAnimalGender, formatAnimalSpecies, getPetStatusDisplayText, getPetStatusColorClass } from '../../../shared/utils';
import { useAuth } from '../../../context/AuthContext';
import { wsClient } from '../../../shared/lib/websocket';

import { useNotificationStore } from '../../../shared/components/common/notify/NotificationStore';
import Image from 'next/image';

export default function AnimalDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { userInfo } = useAuth();
  const { addNotification } = useNotificationStore();
  const [pet, setPet] = useState<Pet | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreatingChat, setIsCreatingChat] = useState(false);

  useEffect(() => {
    if (!params?.id) return;
    
    const loadPetData = async () => {
      try {
        setIsLoading(true);
        const petData = await petService.getPet(params.id as string);
        setPet(petData);
      } catch (err) {
        setError('동물 정보를 불러오는데 실패했습니다.');
        console.error('Failed to load pet:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadPetData();
  }, [params?.id]);

  // WebSocket 연결 및 알림 처리
  useEffect(() => {
    if (!userInfo) return;

    const token = localStorage.getItem('accessToken');
    if (token && userInfo) {
      const userId = parseInt(userInfo.sub, 10);
      console.log('Gallery page - Connecting WebSocket with userId:', userId);
      
      // WebSocket 연결
      wsClient.connect(token, userId);
      
      // 알림 구독
      setTimeout(() => {
        if (wsClient.getConnectionStatus()) {
          wsClient.subscribeToPersonalNotifications();
        }
      }, 1000);

      // 알림 핸들러 등록
      const handleNotification = (notification: { title?: string; message?: string; content?: string; type?: string }) => {
        console.log('Gallery page - Received notification:', notification);
        addNotification({
          title: notification.title || '새 알림',
          message: notification.message || notification.content || '새로운 알림이 도착했습니다.',
          type: (notification.type as 'NEW_MESSAGE' | 'ADOPTION_REQUESTED' | 'ADOPTION_ACCEPTED' | 'ADOPTION_REJECTED' | 'CARE_REQUESTED' | 'CARE_ACCEPTED' | 'CARE_REJECTED' | 'CHAT_ROOM_DELETED') || 'NEW_MESSAGE',
          userId: userId,
        });
      };

      wsClient.onNotification(handleNotification);

      // 컴포넌트 언마운트 시 정리
      return () => {
        wsClient.offNotification(handleNotification);
      };
    }
  }, [userInfo, addNotification]);

  const handleInquiryClick = async () => {
    if (!userInfo || !pet) {
      alert('로그인이 필요합니다.');
      router.push('/login');
      return;
    }

    try {
      setIsCreatingChat(true);
      const currentUserId = parseInt(userInfo.sub, 10);
      
      // 채팅방 생성
      const chatRoom = await chatService.createChatRoom({
        firstMemberId: currentUserId,
        secondMemberId: pet.petOwnerId,
      });

      // 채팅방에 바로 입장하여 상대방에게 알림 전송 (무조건 실행)
      if (wsClient.getConnectionStatus()) {
        wsClient.joinChatRoom(chatRoom.id, currentUserId);
      }

      // 알림을 받을 시간을 위해 약간의 지연 추가
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 채팅 페이지로 이동
      router.push(`/allchat?roomId=${chatRoom.id}&petName=${encodeURIComponent(pet.name)}`);
    } catch (error) {
      console.error('채팅방 생성 실패:', error);
      alert('채팅방 생성에 실패했습니다.');
    } finally {
      setIsCreatingChat(false);
    }
  };

  // 동물 상태에 따른 신청 가능 여부 결정
  const canApply = () => {
    if (!pet || !pet.petStatuses) return false;
    
    const statuses = pet.petStatuses;
    
    // 입양과 돌봄 모두 가능하거나, 입양만 가능하거나, 돌봄만 가능한 경우
    return statuses.includes('AVAILABLE_BOTH') || 
           statuses.includes('AVAILABLE_FOR_ADOPTION') || 
           statuses.includes('AVAILABLE_FOR_CARE');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !pet) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="text-6xl mb-4">🐾</div>
          <h2 className="text-2xl font-bold mb-2">동물을 찾을 수 없습니다</h2>
          <p className="text-gray-500 mb-6">
            {error || '존재하지 않는 동물입니다.'}
          </p>
          <button onClick={() => router.push('/gallery')} className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors">목록으로 돌아가기</button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* 헤더 영역 */}
        <div className="border-b border-gray-200 p-6 mb-8">
          <div className="flex justify-between items-start">
            {/* 좌측: 입양 + 동물 이름 */}
            <div>
              <div className="text-sm text-orange-600 font-medium mb-3">입양</div>
              <h1 className="text-3xl font-bold text-gray-900">{pet.name}</h1>
            </div>
            
            {/* 우측: 상태 */}
            <div className="text-right">
              <div className="flex items-center justify-end mb-3">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${getPetStatusColorClass(pet.petStatuses)}`}>
                  {getPetStatusDisplayText(pet.petStatuses)}
                </span>
              </div>
              {/* 1대1 문의 버튼 */}
              <button
                onClick={handleInquiryClick}
                disabled={isCreatingChat || !canApply()}
                className={`text-sm px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2 ${
                  canApply() 
                    ? 'bg-orange-500 hover:bg-orange-600 text-white' 
                    : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                }`}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                <span>{isCreatingChat ? '채팅방 생성 중...' : '1대1 문의'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* 본문 영역 */}
        <div>
          {/* 동물 사진 */}
          <div className="mb-8">
            {pet.imageUrl ? (
              <div className="w-full relative">
                <Image
                  src={pet.imageUrl.split('?')[0]}
                  alt={pet.name}
                  width={800}
                  height={600}
                  className="w-full h-auto rounded-lg"
                  priority
                />
              </div>
            ) : (
              <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-6xl text-gray-400">🐾</span>
              </div>
            )}
          </div>

          {/* 동물 정보 */}
          <div className="space-y-6">
            {/* 기본 정보 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-200 p-4 rounded-lg">
                <div className="text-sm text-gray-500 mb-1">종류</div>
                <div className="font-semibold text-gray-900">{formatAnimalSpecies(pet.species)}</div>
              </div>
              <div className="bg-gray-200 p-4 rounded-lg">
                <div className="text-sm text-gray-500 mb-1">나이</div>
                <div className="font-semibold text-gray-900">{formatAnimalAge(pet.age)}</div>
              </div>
              <div className="bg-gray-200 p-4 rounded-lg">
                <div className="text-sm text-gray-500 mb-1">성별</div>
                <div className="font-semibold text-gray-900">{formatAnimalGender(pet.gender)}</div>
              </div>
            </div>

            {/* 상세 설명 */}
            <div className="bg-gray-200 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">상세 정보</h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">{pet.description}</p>
            </div>

            {/* 보호소 정보 */}
            {pet.shelterName && (
              <div className="bg-orange-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">보호소 정보</h3>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">보호소명:</span> {pet.shelterName}</div>
                </div>
              </div>
            )}
          </div>

          {/* 입양·돌봄 신청 버튼 */}
          <div className="mt-10 mb-10 pt-6 border-t border-gray-200 flex justify-center">
            <div className="w-60 h-16 flex items-center justify-center">
              <button 
                onClick={() => router.push(`/apply?petId=${pet.id}`)}
                disabled={!canApply()}
                className={`w-full h-full py-4 rounded-lg text-lg font-semibold border-0 outline outline-1 outline-white/50 transition-all duration-[1250ms] ease-[cubic-bezier(0.19,1,0.22,1)] 
                ${
                  canApply()
                    ? 'bg-orange-500 text-white hover:border hover:border-solid hover:outline-offset-[15px] hover:outline-white/0 hover:shadow-[inset_0_0_20px_rgba(255,255,255,0.5),0_0_20px_rgba(255,255,255,0.2)] hover:text-shadow hover:scale-105'
                    : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                }`}
              >
                {canApply() ? '입양 · 돌봄 신청하기' : '신청 불가'}
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 