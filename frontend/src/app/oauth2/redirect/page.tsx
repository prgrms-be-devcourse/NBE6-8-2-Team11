'use client';
import { useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';

// 동적 렌더링 강제
export const dynamic = 'force-dynamic';

function OAuth2RedirectHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { login } = useAuth();
  const hasProcessed = useRef(false);

  useEffect(() => {
    // 이미 처리되었으면 다시 실행하지 않음
    if (hasProcessed.current) {
      return;
    }

    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');

    if (accessToken) {
      try {
        hasProcessed.current = true; // 처리 시작을 표시

        const base64Url = accessToken.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const binaryString = atob(base64);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        const decodedString = new TextDecoder('utf-8').decode(bytes);
        const decodedPayload = JSON.parse(decodedString);

        const userInfo = {
          sub: decodedPayload.sub,
          auth: decodedPayload.auth,
          exp: decodedPayload.exp,
          nickname: decodedPayload.nickname || null,
          email: decodedPayload.email || null,
        };

        // localStorage에 저장하고 전역 상태도 업데이트
        login(accessToken, refreshToken || '', userInfo);

        console.log('OAuth 로그인 및 정보 저장 완료:', userInfo);

        // 성공적으로 처리된 후 홈으로 리다이렉트
        router.replace('/');

      } catch (error) {
        console.error("토큰 디코딩 또는 저장 중 오류 발생:", error);
        hasProcessed.current = true; // 오류가 발생해도 처리 완료로 표시
        router.replace('/');
      }
    } else {
      console.warn("URL에 accessToken이 없습니다.");
      hasProcessed.current = true; // 토큰이 없어도 처리 완료로 표시
      router.replace('/');
    }
  }, []); // 빈 의존성 배열로 한 번만 실행

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
        <p className="text-gray-600">로그인 처리 중...</p>
      </div>
    </div>
  );
}

export default function OAuth2RedirectPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">토큰 정보를 로딩 중...</p>
        </div>
      </div>
    }>
      <OAuth2RedirectHandler />
    </Suspense>
  );
}