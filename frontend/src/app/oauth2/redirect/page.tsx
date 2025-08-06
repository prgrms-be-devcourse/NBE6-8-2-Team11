'use client';
import { useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { useMemberType } from '../../../context/MemberTypeContext';

// 동적 렌더링 강제
export const dynamic = 'force-dynamic';

function OAuth2RedirectHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { login } = useAuth();
  const { memberType } = useMemberType();

  useEffect(() => {
    const handleOAuthRedirect = async () => {
      try {
        const accessToken = searchParams.get('accessToken');
        const refreshToken = searchParams.get('refreshToken');
        const memberType = searchParams.get('memberType');

        if (accessToken && refreshToken) {
          // 토큰에서 사용자 정보 추출
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
            id: decodedPayload.id,
            sub: decodedPayload.sub,
            auth: decodedPayload.auth,
            exp: decodedPayload.exp,
            nickname: decodedPayload.nickname || null,
            email: decodedPayload.email || null,
          };
          
          if (memberType) {
            localStorage.setItem('memberType', memberType);
          }

          // 로그인 처리
          login(accessToken, refreshToken, userInfo);
          
          // 메인 페이지로 리다이렉트
          router.push('/');
        } else {
          console.error('OAuth redirect failed: missing tokens');
          router.push('/login');
        }
      } catch (error) {
        console.error('OAuth redirect error:', error);
        router.push('/login');
      }
    };

    handleOAuthRedirect();
  }, [searchParams, login, memberType, router]); 

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
        <p className="text-gray-600">로그인 처리 중...</p>
      </div>
    </div>
  );
}

export default function OAuthRedirectPage() {
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const { memberType } = useMemberType();
  const router = useRouter();
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