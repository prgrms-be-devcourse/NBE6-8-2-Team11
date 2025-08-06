// 'use client';
// import { useEffect, useRef, Suspense } from 'react';
// import { useSearchParams, useRouter } from 'next/navigation';
// import { useAuth } from '../../../context/AuthContext';
// import { useMemberType } from '../../../context/MemberTypeContext';

// // 동적 렌더링 강제
// export const dynamic = 'force-dynamic';

// function OAuth2RedirectHandler() {
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const { login } = useAuth();
//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   const { memberType } = useMemberType();

//   useEffect(() => {
//     const handleOAuthRedirect = async () => {
//       try {

//         // AuthContext의 login 함수에 토큰만 전달 (사용자 정보는 토큰에서 추출)
//         // login(accessToken, refreshToken || '');

//         console.log('OAuth 로그인 완료');

//         // memberType이 설정되어 있는지 확인
//         const savedMemberType = localStorage.getItem('memberType');
//         if (!savedMemberType) {
//           console.log('memberType이 설정되지 않음, 프로필 설정 페이지로 이동');
//           router.replace('/profile?tab=edit&memberTypeRequired=true');
//         } else {
//           console.log('memberType 이미 설정됨:', savedMemberType, ', 홈으로 이동');
//           router.replace('/');
//         }
//       } catch (error) {
//         console.error("토큰 처리 중 오류 발생:", error);
//         hasProcessed.current = true;
//         router.replace('/');
//       }
//     }; 
//   }, [login, router, searchParams]); 

//   return (
//     <div className="flex items-center justify-center min-h-screen">
//       <div className="text-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
//         <p className="text-gray-600">로그인 처리 중...</p>
//       </div>
//     </div>
//   );
// }

// export default function OAuthRedirectPage() {
//   const searchParams = useSearchParams();
//   const { login } = useAuth();
//   const { memberType } = useMemberType();
//   const router = useRouter();
//   return (
//     <Suspense fallback={
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
//           <p className="text-gray-600">토큰 정보를 로딩 중...</p>
//         </div>
//       </div>
//     }>
//       <OAuth2RedirectHandler />
//     </Suspense>
//   );
// }
