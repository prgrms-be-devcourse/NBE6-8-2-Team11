'use client';

import { useState, useEffect } from 'react';
import Header from '../../shared/components/layout/Header';
import Footer from '../../shared/components/layout/Footer';
import ProfileInfo from '../../features/profile/components/ProfileInfo';
import ProfileEdit from '../../features/profile/components/ProfileEdit';
import AdoptionHistory from '../../features/profile/components/AdoptionHistory';
import LoadingSpinner from '../../shared/components/common/LoadingSpinner';
import ErrorBoundary from '../../shared/components/common/ErrorBoundary';
import { User } from '../../features/profile/types';
import { apiClient } from '../../shared/services/apiClient';
import { useRouter } from 'next/navigation';

// 백엔드 MemberResponseDto에 해당하는 타입 정의
interface MemberData {
  memberId: number;
  email: string;
  name: string;
  phone: string;
}

// 백엔드 실제 응답 전체에 대한 타입 정의
interface MemberApiResponse {
  success: boolean;
  code: string;
  message: string;
  content: MemberData;
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('info');
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadUserData = async () => {
      setIsLoading(true);
      try {
        const userId = localStorage.getItem('userId');

        if (!userId) {
          alert('로그인이 필요한 서비스입니다.');
          router.push('/login');
          return;
        }

        // 이제 apiClient.get은 백엔드 응답을 그대로 반환합니다.
        const response = await apiClient.get<MemberApiResponse>(`/members/${userId}`);
        
        if (response.success && response.content) {
          const userData: User = {
            id: response.content.memberId,
            name: response.content.name,
            email: response.content.email,
            phone: response.content.phone,
            address: '주소를 입력해주세요.',
            profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face', 
            memberType: 'adopter',
            createdAt: new Date(),
            bio: '소개글을 작성해주세요.'
          };
          setUser(userData);
        } else {
          throw new Error(response.message || '사용자 정보 로딩 실패');
        }

      } catch (error) {
        console.error('사용자 정보 로딩 실패:', error);
        alert('사용자 정보를 불러오는 데 실패했습니다. 다시 로그인해주세요.');
        router.push('/login'); 
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [router]);

  // 이하 JSX 코드는 수정할 필요 없습니다.
  const tabs = [
    { id: 'info', label: '내 정보', icon: '👤' },
    { id: 'edit', label: '정보 수정', icon: '✏️' },
    { id: 'history', label: '입양 이력', icon: '📋' }
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
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">내 프로필</h1>
            <p className="text-gray-600">내 정보와 입양 이력을 관리하세요</p>
          </div>
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
            <div className="p-6">
              {activeTab === 'info' && <ProfileInfo user={user} />}
              {activeTab === 'edit' && <ProfileEdit user={user} setUser={setUser} />}
              {activeTab === 'history' && <AdoptionHistory />}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </ErrorBoundary>
  );
}