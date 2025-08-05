'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Header from '../../shared/components/layout/Header';
import Footer from '../../shared/components/layout/Footer';
import { memberService } from '../../shared/services/member';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // JWT 토큰 디코딩 함수 추가
  const decodeToken = (token: string) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("Invalid token:", error);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
  
    try {
      const response = await memberService.login({
        email: formData.email,
        password: formData.password,
      });
      
      console.log('로그인 성공:', response);

      const decodedToken = decodeToken(response.accessToken);
      if (!decodedToken) {
        throw new Error('Invalid token');
      }
    
      // context/AuthContext의 login 함수를 호출하여 상태와 localStorage를 한번에 업데이트
      const userInfo = {
        sub: response.userId.toString(),
        auth: decodedToken.auth,
        exp: decodedToken.exp,
        nickname: response.userName,
        email: response.userEmail,
      };
      
      login(response.accessToken, response.refreshToken, userInfo);
      
      console.log('로그인 상태 업데이트 완료, 홈페이지로 이동합니다.');
      
      // 로그인 성공 시 즉시 홈페이지로 이동
      router.push('/');
      
    } catch (error: unknown) {
      console.log('로그인 에러:', error);
      
      // 에러 메시지 처리
      let errorMessage = '로그인에 실패했습니다. 다시 시도해주세요.';
      
      if (error && typeof error === 'object' && 'response' in error) {
        const errorResponse = error as { response?: { data?: { message?: string } } };
        if (errorResponse.response?.data?.message) {
          errorMessage = errorResponse.response.data.message;
        }
      } else if (error && typeof error === 'object' && 'message' in error) {
        const errorObj = error as { message: string };
        errorMessage = errorObj.message;
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKakaoLogin = () => {
    // 백엔드의 OAuth2 엔드포인트로 리다이렉트
    window.location.href = 'http://localhost:8080/oauth2/authorization/kakao';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
      <Header />
      
      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                로그인
              </h1>
              <p className="text-gray-600">
                계정 정보를 입력하거나 카카오로 간편 로그인하세요
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 이메일 입력 */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  이메일
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  placeholder="이메일을 입력하세요"
                />
              </div>

              {/* 비밀번호 입력 */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  비밀번호
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  placeholder="비밀번호를 입력하세요"
                />
              </div>

              {/* 에러 메시지 */}
              {error && (
                <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg">
                  {error}
                </div>
              )}

              {/* 로그인 버튼 */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-orange-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? '로그인 중...' : '로그인'}
              </button>
            </form>

            {/* 구분선 */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">또는</span>
              </div>
            </div>

            {/* 카카오 로그인 버튼 */}
            <div className="text-center">
              <button
                onClick={handleKakaoLogin}
                className="hover:opacity-80 transition-opacity"
              >
                <Image
                  src="/kakao_login_medium_narrow.png"
                  alt="카카오 로그인"
                  width={183}
                  height={45}
                  className="cursor-pointer"
                />
              </button>
            </div>

            {/* 추가 링크들 */}
            <div className="mt-6 text-center space-y-2">
              <div className="text-sm">
                <a href="#" className="text-orange-600 hover:text-orange-700 font-medium">
                  아이디 찾기
                </a>
                <span className="mx-2 text-gray-400">|</span>
                <a href="#" className="text-orange-600 hover:text-orange-700 font-medium">
                  비밀번호 찾기
                </a>
              </div>
              <div className="text-sm text-gray-600">
                계정이 없으신가요?{' '}
                <a href="/signup" className="text-orange-600 hover:text-orange-700 font-medium">
                  회원가입
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
} 