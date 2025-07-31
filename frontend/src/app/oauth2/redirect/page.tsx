'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../../shared/hooks/useAuth';

function OAuth2RedirectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // URL 파라미터에서 모든 값들을 로그로 확인
    const allParams: Record<string, string> = {}; // 타입을 명시적으로 지정
    searchParams.forEach((value, key) => {
      allParams[key] = value;
    });
    console.log('OAuth2 리다이렉트 파라미터:', allParams);

    // 다양한 파라미터 이름으로 토큰과 사용자 정보 추출
    const accessToken = searchParams.get('accessToken') || searchParams.get('access_token');
    const refreshToken = searchParams.get('refreshToken') || searchParams.get('refresh_token');
    const userId = searchParams.get('userId') || searchParams.get('user_id') || searchParams.get('memberId');
    const userEmail = searchParams.get('userEmail') || searchParams.get('user_email') || searchParams.get('email');
    const userName = searchParams.get('userName') || searchParams.get('user_name') || searchParams.get('name');

    console.log('추출된 값들:', {
      accessToken: !!accessToken,
      refreshToken: !!refreshToken,
      userId,
      userEmail,
      userName
    });

    if (accessToken && refreshToken) {
      // 토큰이 있으면 로그인 처리
      // 사용자 정보가 없으면 토큰에서 추출하거나 기본값 사용
      let finalUserId = userId;
      let finalUserEmail = userEmail;
      let finalUserName = userName;

      // 토큰에서 사용자 정보 추출 시도 (JWT 토큰인 경우)
      if (!finalUserId || !finalUserEmail || !finalUserName) {
        try {
          // JWT 토큰 디코딩 (간단한 방법)
          const tokenPayload = accessToken.split('.')[1];
          if (tokenPayload) {
            const decodedPayload = JSON.parse(atob(tokenPayload));
            console.log('토큰에서 추출한 정보:', decodedPayload);
            
            if (!finalUserId && decodedPayload.sub) {
              finalUserId = decodedPayload.sub;
            }
            if (!finalUserEmail && decodedPayload.email) {
              finalUserEmail = decodedPayload.email;
            }
            if (!finalUserName && decodedPayload.name) {
              finalUserName = decodedPayload.name;
            }
          }
        } catch (e) {
          console.log('토큰에서 사용자 정보 추출 실패:', e);
        }
      }

      // 기본값 설정
      if (!finalUserId) finalUserId = '1'; // 임시 ID
      if (!finalUserEmail) finalUserEmail = 'kakao@example.com'; // 임시 이메일
      if (!finalUserName) finalUserName = '카카오 사용자'; // 임시 이름

      // useAuth의 login 함수를 사용하여 상태와 localStorage를 한번에 업데이트
      login(
        { 
          id: parseInt(finalUserId, 10), 
          email: finalUserEmail, 
          name: finalUserName 
        },
        { 
          accessToken: accessToken, 
          refreshToken: refreshToken 
        }
      );

      console.log('카카오 로그인 성공:', { 
        userId: finalUserId, 
        userEmail: finalUserEmail, 
        userName: finalUserName 
      });
      
      // 메인 페이지로 리다이렉트
      router.push('/');
    } else {
      // 토큰이 없으면 에러 상태로 설정하고 3초 후 홈으로 리다이렉트
      const missingFields = [];
      if (!accessToken) missingFields.push('accessToken');
      if (!refreshToken) missingFields.push('refreshToken');
      
      console.error('필수 토큰 누락:', missingFields);
      setError(`로그인에 실패했습니다. 누락된 토큰: ${missingFields.join(', ')}`);
      
      // 3초 후 홈으로 리다이렉트
      setTimeout(() => {
        router.push('/');
      }, 3000);
    }
  }, [searchParams, router, login]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">로그인 실패</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500">잠시 후 홈페이지로 이동합니다...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">로그인 처리 중...</p>
      </div>
    </div>
  );
}

export default function OAuth2RedirectPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    }>
      <OAuth2RedirectContent />
    </Suspense>
  );
} 