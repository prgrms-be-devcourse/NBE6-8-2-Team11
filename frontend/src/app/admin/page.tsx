'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import Header from '../../shared/components/layout/Header';
import Footer from '../../shared/components/layout/Footer';
import LoadingSpinner from '../../shared/components/common/LoadingSpinner';

export default function AdminPage() {
  const { userInfo, isLoggedIn, isLoading } = useAuth();
  const router = useRouter();

  const isAdmin = userInfo?.auth?.includes('ADMIN');

  useEffect(() => {
    // 로딩 중이 아닐 때 접근 권한 확인
    if (!isLoading) {
      if (!isLoggedIn || !isAdmin) {
        alert('접근 권한이 없습니다.');
        router.replace('/');
      }
    }
  }, [isLoading, isLoggedIn, isAdmin, router]);

  // 로딩 중이거나 리다이렉션 중일 때 로딩 화면 표시
  if (isLoading || !isLoggedIn || !isAdmin) {
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

  // 관리자일 경우 페이지 내용 표시
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            관리자 페이지
          </h1>
          <p className="text-gray-600">
            이곳에서 사용자, 반려동물, 입양 신청 등을 관리할 수 있습니다.
          </p>
          {/* 여기에 관리자용 컴포넌트 및 기능 추가 */}
        </div>
      </main>
      <Footer />
    </div>
  );
}