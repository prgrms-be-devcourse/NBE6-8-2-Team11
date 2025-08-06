'use client';

import { useState, useEffect } from 'react';
import Header from '../../shared/components/layout/Header';
import Footer from '../../shared/components/layout/Footer';
import ProfileInfo from '../../features/profile/components/ProfileInfo';
import ProfileEdit from '../../features/profile/components/ProfileEdit';
import MyPets from '@/features/profile/components/MyPets';
import AdoptionHistory from '../../features/profile/components/AdoptionHistory';
import ReceivedAdoptionHistory from '../../features/profile/components/ReceivedAdoptionHistory';
import LoadingSpinner from '../../shared/components/common/LoadingSpinner';
import ErrorBoundary from '../../shared/components/common/ErrorBoundary';
import { User } from '../../features/profile/types';
import { ProfileService } from '../../shared/services/profileService';
import { useMemberType } from '../../context/MemberTypeContext';


export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('info');
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [showMemberTypeAlert, setShowMemberTypeAlert] = useState(false);
  const { memberType } = useMemberType();

  useEffect(() => {
    // URL 파라미터에서 탭 정보와 memberType 필수 설정 여부 읽기
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    const memberTypeRequired = urlParams.get('memberTypeRequired');
    
    if (tabParam && ['info', 'edit', 'history', 'getHistory'].includes(tabParam)) {
      setActiveTab(tabParam);
    }

    // OAuth2 로그인 후 memberType 설정이 필요한 경우
    if (memberTypeRequired === 'true' && !memberType) {
      setActiveTab('edit');
      setShowMemberTypeAlert(true);
    }
    
    // 실제 API 호출 대신 모의 데이터 사용
    const loadUserData = async () => {
      setIsLoading(true);
      try {
        const userInfoStr = localStorage.getItem('userInfo');
        if (!userInfoStr) throw new Error('No userInfo found');

        const userInfo = JSON.parse(userInfoStr);
        console.log('parsed userInfo:', userInfo);
        const userId = Number(userInfo.id);
        console.log('userId:', userId);
        console.log("userInfo in ProfilePage:", userInfo);
        if (userId && !isNaN(userId)) {
          const fetchedUser = await ProfileService.fetchUserById(userId);
          setUser(fetchedUser);
        } else {
          throw new Error('Invalid userId in userInfo');
        }
      } catch (error) {
        console.error('사용자 정보 로딩 실패:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [memberType]);

  const tabs = [
    { id: 'info', label: '내 정보', icon: '👤' },
    { id: 'edit', label: '정보 수정', icon: '✏️' },
    { id: 'history', label: '입양/돌봄 신청 이력', icon: '📋' },
    { id: 'getHistory', label: '받은 신청 이력', icon: '📖' }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <LoadingSpinner size="lg" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <main className="max-w-6xl mx-auto px-4 py-8">
          {/* 페이지 헤더 */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">내 프로필</h1>
            <p className="text-gray-600">내 정보와 입양 이력을 관리하세요</p>
          </div>

          {/* 탭 네비게이션 */}
          <div className="bg-white rounded-lg shadow-sm mb-8">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-orange-500 text-orange-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* memberType 설정 안내 메시지 */}
            {showMemberTypeAlert && !memberType && (
              <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-orange-800">
                      회원 유형 설정이 필요합니다
                    </h3>
                    <div className="mt-2 text-sm text-orange-700">
                      <p>서비스 이용을 위해 회원 유형(입양 희망자/보호소)을 선택해주세요.</p>
                    </div>
                  </div>
                  <div className="ml-auto">
                    <button
                      onClick={() => setShowMemberTypeAlert(false)}
                      className="text-orange-400 hover:text-orange-600"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 탭 컨텐츠 */}
            <div className="p-6">
              {activeTab === 'info' && <ProfileInfo user={user} />}
              {activeTab === 'edit' && <ProfileEdit user={user} setUser={setUser} />}
              {activeTab === 'pets' && <MyPets />}
              {activeTab === 'history' && <AdoptionHistory />}
              {activeTab === 'getHistory' && <ReceivedAdoptionHistory />}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </ErrorBoundary>
  );
} 