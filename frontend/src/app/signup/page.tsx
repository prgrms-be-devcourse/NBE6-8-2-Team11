'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../shared/components/layout/Header';
import Footer from '../../shared/components/layout/Footer';
import { apiClient } from '../../shared/services/apiClient';

interface SignupFormData {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  phone: string;
}

export default function SignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState<SignupFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = (): boolean => {
    // 기본 필드 검증
    if (!formData.email || !formData.password || !formData.name || !formData.phone) {
      setError('모든 필수 항목을 입력해주세요.');
      return false;
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('올바른 이메일 형식을 입력해주세요.');
      return false;
    }

    // 비밀번호 확인
    if (formData.password !== formData.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return false;
    }

    // 비밀번호 길이 검증
    if (formData.password.length < 6) {
      setError('비밀번호는 최소 6자 이상이어야 합니다.');
      return false;
    }

    // 전화번호 형식 검증
    const phoneRegex = /^[0-9-+\s()]+$/;
    if (!phoneRegex.test(formData.phone)) {
      setError('올바른 전화번호 형식을 입력해주세요.');
      return false;
    }

    // 이름 형식 검증
    if (formData.name.trim().length < 2) {
      setError('이름은 최소 2자 이상이어야 합니다.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      console.log('회원가입 시도:', formData);
      
      const response = await apiClient.post('/auth/join', {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        phone: formData.phone,
      }) as unknown as {
        success: boolean;
        code: string;
        message: string;
        content?: {
          id: number;
          email: string;
          name: string;
          phone: string;
        };
      };
      
      console.log('회원가입 응답:', response);
      
      if (response.success) {
        console.log('회원가입 성공!');
        setSuccess('회원가입이 성공적으로 완료되었습니다! 2초 후 로그인 페이지로 이동합니다.');
        
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        console.log('회원가입 실패:', response);
        setError(response.message || '회원가입에 실패했습니다.');
      }
    } catch (error) {
      console.log('회원가입 에러:', error);
      setError('회원가입 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
      <Header />
      
      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                회원가입
              </h1>
              <p className="text-gray-600">
                계정을 생성하고 서비스를 이용해보세요
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 이름 입력 */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  이름 *
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  placeholder="이름을 입력하세요"
                />
              </div>

              {/* 이메일 입력 */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  이메일 *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  placeholder="example@email.com"
                />
              </div>

              {/* 비밀번호 입력 */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  비밀번호 *
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  placeholder="최소 6자 이상"
                />
              </div>

              {/* 비밀번호 확인 */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  비밀번호 확인 *
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  placeholder="비밀번호를 다시 입력하세요"
                />
              </div>

              {/* 전화번호 입력 */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  전화번호 *
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  placeholder="010-1234-5678"
                />
              </div>

              {/* 에러 메시지 */}
              {error && (
                <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg">
                  {error}
                </div>
              )}

              {/* 성공 메시지 */}
              {success && (
                <div className="text-green-600 text-sm text-center bg-green-50 p-3 rounded-lg">
                  {success}
                </div>
              )}

              {/* 회원가입 버튼 */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-orange-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? '회원가입 중...' : '회원가입'}
              </button>
            </form>

            {/* 로그인 링크 */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                이미 계정이 있으신가요?{' '}
                <a href="/login" className="text-orange-600 hover:text-orange-700 font-medium">
                  로그인
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
} 