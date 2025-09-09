'use client';
import { useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { useMemberType } from '../../../context/MemberTypeContext';
import { getUserInfoFromToken } from '../../../shared/utils/jwt';
import { memberService } from '../../../shared/services/member';

// 동적 렌더링 강제
export const dynamic = 'force-dynamic';

function OAuth2RedirectHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { login } = useAuth();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { memberType } = useMemberType();
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

        // AuthContext의 login 함수에 토큰만 전달 (사용자 정보는 토큰에서 추출)
        login(accessToken, refreshToken || '');

        const userInfo = getUserInfoFromToken(accessToken);

        if (userInfo && userInfo.id) {
          memberService.getUserById(userInfo.id).then(userProfile => {
            if (!userProfile.phone || !userProfile.address) {
              console.log('프로필 정보 미완성, 프로필 설정 페이지로 이동');
              router.replace('/profile?tab=edit&memberTypeRequired=true');
            } else {
              console.log('프로필 정보 완성됨, 홈으로 이동');
              router.replace('/');
            }
          })
          .catch(error => {
            console.error("사용자 정보 조회 실패:", error);
            router.replace('/');
          });
        } else {
          console.error("토큰에서 사용자 ID 추출 불가");
          router.replace('/');
        }
      } catch (error) {
        console.error("토큰 처리 중 오류:", error);
        hasProcessed.current = true;
        router.replace('/');
      }
    } else {
      // URL에 토큰이 없는 예외 케이스 처리
      hasProcessed.current = true;
      router.replace('/');
    }
    }, [login, router, searchParams]); 

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