'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

// 동적 렌더링 강제
export const dynamic = 'force-dynamic';

function UserInfoDecoder() {
  const searchParams = useSearchParams();
  const accessToken = searchParams.get('accessToken');

  let userInfo = null;

  if (accessToken) {
    try {
      // JWT를 . (점) 기준으로 분리하여 페이로드 부분만 가져옵니다.
      const base64Url = accessToken.split('.')[1];

      // Base64 URL-safe 문자열을 일반 Base64 문자열로 변환합니다.
      // 패딩 문자 '='가 없을 수 있으므로 추가하거나, URL-safe 디코딩 함수를 사용합니다.
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

      // atob() 함수를 사용하여 Base64를 디코딩합니다.
      // (Node.js 환경에서는 Buffer.from(base64, 'base64').toString() 사용)
      const decodedString = atob(base64);

      // JSON 문자열을 JavaScript 객체로 파싱합니다.
      userInfo = JSON.parse(decodedString);

    } catch (error) {
      console.error("Access Token 디코딩 중 오류 발생:", error);
      userInfo = { error: "Invalid Access Token" };
    }
  }

  return (
    <div>
      <h2>사용자 정보</h2>
      {userInfo ? (
        <div>
          <p>서브젝트 (sub): {userInfo.sub}</p>
          <p>권한 (auth): {userInfo.auth}</p>
          <p>만료 시간 (exp): {new Date(userInfo.exp * 1000).toLocaleString()}</p>
          {/* 다른 정보들도 여기에 표시할 수 있습니다. */}
        </div>
      ) : (
        <p>액세스 토큰이 없습니다.</p>
      )}
    </div>
  );
}

export default function OAuthRedirectPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">토큰 정보를 로딩 중...</p>
        </div>
      </div>
    }>
      <UserInfoDecoder />
    </Suspense>
  );
}