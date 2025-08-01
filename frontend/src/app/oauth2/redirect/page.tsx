'use client';
import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext'; // AuthContext 경로에 맞게 수정

export default function OAuth2RedirectHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { login } = useAuth(); // AuthContext의 login 함수 가져오기

  useEffect(() => {
    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');

    if (accessToken) {
      try {
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

      } catch (error) {
        console.error("토큰 디코딩 또는 저장 중 오류 발생:", error);
        // 오류 발생 시에도 메인 페이지로 리다이렉트하거나, 오류 페이지로 리다이렉트할 수 있습니다.
      }
    } else {
      console.warn("URL에 accessToken이 없습니다.");
      // accessToken이 없는 경우 처리 로직 (예: 로그인 페이지로 리다이렉트)
    }

    router.replace('/');
  }, []); // login 함수를 의존성 배열에 추가

  return null;
}