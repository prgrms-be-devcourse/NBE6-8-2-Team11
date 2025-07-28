'use client';

import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  const handleKakaoLogin = () => {
    // 백엔드의 OAuth2 엔드포인트로 리다이렉트
    window.location.href = 'http://localhost:8080/oauth2/authorization/kakao';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            로그인
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            카카오 계정으로 간편하게 로그인하세요
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <div>
            <button
              onClick={handleKakaoLogin}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
            >
              <svg
                className="w-5 h-5 mr-2"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 3c5.799 0 10.5 3.664 10.5 8.185 0 4.52-4.701 8.184-10.5 8.184a13.5 13.5 0 0 1-1.727-.11l-4.408 2.883c-.501.265-.678.236-.472-.413l.892-3.678c-2.88-1.46-4.785-3.99-4.785-6.866C1.5 6.665 6.201 3 12 3z"/>
              </svg>
              카카오로 로그인
            </button>
          </div>
          <div className="text-center">
            <button
              onClick={() => router.push('/')}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              홈으로 돌아가기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 