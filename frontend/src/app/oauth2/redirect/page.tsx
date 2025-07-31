'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../../shared/hooks/useAuth';

function OAuth2RedirectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const handleOAuth2Redirect = async () => {
      try {
        // URL 파라미터에서 토큰 및 사용자 정보 추출 (다양한 변수명 시도)
        const accessToken = searchParams.get('accessToken') || searchParams.get('access_token');
        const refreshToken = searchParams.get('refreshToken') || searchParams.get('refresh_token');
        
        // 다양한 변수명으로 사용자 정보 시도
        const userId = searchParams.get('userId') || searchParams.get('user_id') || searchParams.get('id');
        const userEmail = searchParams.get('userEmail') || searchParams.get('user_email') || searchParams.get('email');
        const userName = searchParams.get('userName') || searchParams.get('user_name') || searchParams.get('name') || searchParams.get('nickname');

        console.log('OAuth2 리다이렉트 파라미터:', {
          accessToken: accessToken ? '존재' : '없음',
          refreshToken: refreshToken ? '존재' : '없음',
          userId,
          userEmail,
          userName
        });

        // 모든 URL 파라미터 확인 (디버깅용)
        const allParams: Record<string, string | null> = {};
        searchParams.forEach((value, key) => {
          allParams[key] = value;
        });
        console.log('모든 URL 파라미터:', allParams);

        if (accessToken && userId && userEmail && userName) {
          // useAuth의 login 함수를 호출하여 상태와 localStorage를 한번에 업데이트
          login(
            { 
              id: parseInt(userId, 10), 
              email: userEmail, 
              name: userName 
            },
            { 
              accessToken, 
              refreshToken: refreshToken || accessToken 
            }
          );

          console.log('OAuth2 로그인 성공, 홈페이지로 이동합니다.');
          
          // 홈페이지로 리다이렉트
          router.push('/');
        } else {
          console.error('OAuth2 토큰 또는 사용자 정보 누락:', {
            accessToken: !!accessToken,
            userId: !!userId,
            userEmail: !!userEmail,
            userName: !!userName
          });
          
          setError('로그인에 실패했습니다. 다시 시도해주세요.');
          
          // 3초 후 로그인 페이지로 리다이렉트
          setTimeout(() => {
            router.push('/login?error=oauth_failed');
          }, 3000);
        }
      } catch (error) {
        console.error('OAuth2 리다이렉트 처리 실패:', error);
        setError('로그인 처리 중 오류가 발생했습니다.');
        
        // 3초 후 로그인 페이지로 리다이렉트
        setTimeout(() => {
          router.push('/login?error=oauth_failed');
        }, 3000);
      } finally {
        setIsProcessing(false);
      }
    };

    handleOAuth2Redirect();
  }, [searchParams, router, login]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-yellow-50">
        <div className="text-center bg-white rounded-2xl shadow-xl p-8 max-w-md mx-4">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">로그인 실패</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500">잠시 후 로그인 페이지로 이동합니다...</p>
        </div>
      </div>
    );
  }

  if (isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-yellow-50">
        <div className="text-center bg-white rounded-2xl shadow-xl p-8 max-w-md mx-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">로그인 처리 중</h2>
          <p className="text-gray-600">잠시만 기다려주세요...</p>
        </div>
      </div>
    );
  }

  return null;
}

export default function OAuth2RedirectPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-yellow-50">
        <div className="text-center bg-white rounded-2xl shadow-xl p-8 max-w-md mx-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">로딩 중</h2>
          <p className="text-gray-600">페이지를 불러오는 중...</p>
        </div>
      </div>
    }>
      <OAuth2RedirectContent />
    </Suspense>
  );
} 