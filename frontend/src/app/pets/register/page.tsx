'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../../shared/components/layout/Header';
import Footer from '../../../shared/components/layout/Footer';
import { petService } from '../../../shared/services/petService';
import { useAuth } from '../../../context/AuthContext';
// 1. 올바른 경로의 중앙 타입 정의 파일을 사용한다.
import { PetCreateRequestDto } from '../../../shared/types';

/**
 * 사용자가 새로운 펫을 등록하는 페이지 컴포넌트이다.
 * 타입 정의, API 요청 데이터 형식 등 모든 오류를 수정한 최종 버전이다.
 */
export default function PetRegistrationPage() {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  
  // 2. 폼 데이터 타입을 PetCreateRequestDto로 명확히 지정한다.
  const [formData, setFormData] = useState<PetCreateRequestDto>({
    name: '',
    species: '',
    age: 0,
    gender: 'MALE',
    description: '',
    imageUrl: '',
    statuses: ['AVAILABLE_FOR_ADOPTION'] 
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // 비로그인 사용자는 접근할 수 없도록 처리한다.
  useEffect(() => {
    if (!isLoggedIn) {
      alert('로그인이 필요한 서비스입니다.');
      router.replace('/login');
      return;
    }

    // 추가 토큰 검증
    const token = localStorage.getItem('accessToken');
    const userInfo = localStorage.getItem('userInfo');
    
    if (!token || !userInfo) {
      alert('인증 정보가 없습니다. 다시 로그인해주세요.');
      localStorage.clear(); // 모든 localStorage 초기화
      router.replace('/login');
      return;
    }

    console.log('✅ Pet Registration Access Check Passed');
  }, [isLoggedIn, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    // 3. 'prev' 파라미터에 타입을 명시하여 'any' 타입 오류를 해결한다.
    setFormData((prev: PetCreateRequestDto) => ({ 
        ...prev, 
        // age 필드는 숫자로 변환한다.
        [name]: name === 'age' ? parseInt(value, 10) || 0 : value 
    }));
  };

  const handleStatusChange = (status: string) => {
    setFormData((prev: PetCreateRequestDto) => ({
      ...prev,
      statuses: [status] // 라디오 버튼이므로 하나만 선택
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.species || !formData.gender) {
      setError('이름, 품종, 성별은 필수 항목입니다.');
      return;
    }

    if (formData.statuses.length === 0) {
      setError('동물 상태를 선택해주세요.');
      return;
    }

    // 토큰 및 로그인 상태 재확인
    const token = localStorage.getItem('accessToken');
    const userInfo = localStorage.getItem('userInfo');

    console.log('🔐 Login Status Check:', {
      hasToken: !!token,
      hasUserInfo: !!userInfo,
      isLoggedIn: isLoggedIn
    });

    if (!token || !userInfo || !isLoggedIn) {
      alert('로그인이 필요합니다. 다시 로그인해주세요.');
      router.push('/login');
      return;
    }
    
    setIsLoading(true);
    setError('');

    try {
      // 4. formData 자체가 백엔드 DTO와 형식이 일치하므로 그대로 전송한다.
      //    (500 에러 및 타입 불일치 오류 해결)
      console.log('📝 Submitting Pet Data:', formData);
      await petService.createPet(formData);
      
      alert('펫 등록이 성공적으로 완료되었습니다! 갤러리 페이지로 이동합니다.');
      router.push('/gallery');

    } catch (err: unknown) { // 5. ESLint 에러 해결을 위해 'any' 대신 'unknown' 타입을 사용한다.
      let errorMessage = '펫 등록에 실패했습니다. 잠시 후 다시 시도해주세요.';
      
      // 'unknown' 타입의 에러를 안전하게 처리한다.
      if (err && typeof err === 'object' && 'response' in err) {
        const responseError = err as { response?: { data?: { message?: string } } };
        if (responseError.response?.data?.message) {
          errorMessage = responseError.response.data.message;
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      console.error('🚨 Pet Creation Error:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!isLoggedIn) {
    return null;
  }

  // JSX 렌더링 부분은 수정할 필요가 없으므로 그대로 사용한다.
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">새로운 가족 찾아주기</h1>
            <p className="text-gray-500">소중한 반려동물의 정보를 정성껏 입력해주세요.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1">이름 *</label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="species" className="block text-sm font-semibold text-gray-700 mb-1">품종 *</label>
                <input type="text" id="species" name="species" value={formData.species} onChange={handleInputChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" placeholder="예: 코리안 숏헤어" />
              </div>
              <div>
                <label htmlFor="age" className="block text-sm font-semibold text-gray-700 mb-1">나이 (살)</label>
                <input type="number" id="age" name="age" min="0" value={formData.age} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" />
              </div>
            </div>

            <div>
              <label htmlFor="gender" className="block text-sm font-semibold text-gray-700 mb-1">성별 *</label>
              <select id="gender" name="gender" value={formData.gender} onChange={handleInputChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white">
                <option value="MALE">수컷</option>
                <option value="FEMALE">암컷</option>
                <option value="NEUTERED_MALE">중성화 (수컷)</option>
                <option value="NEUTERED_FEMALE">중성화 (암컷)</option>
                <option value="UNKNOWN">모름</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">동물 상태 *</label>
              <div className="space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input 
                    type="radio" 
                    checked={formData.statuses.includes('AVAILABLE_FOR_ADOPTION')}
                    onChange={() => handleStatusChange('AVAILABLE_FOR_ADOPTION')}
                    className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <span className="text-sm text-gray-700">입양 가능</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input 
                    type="radio" 
                    checked={formData.statuses.includes('AVAILABLE_FOR_CARE')}
                    onChange={() => handleStatusChange('AVAILABLE_FOR_CARE')}
                    className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <span className="text-sm text-gray-700">돌봄 가능</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input 
                    type="radio" 
                    checked={formData.statuses.includes('AVAILABLE_BOTH')}
                    onChange={() => handleStatusChange('AVAILABLE_BOTH')}
                    className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <span className="text-sm text-gray-700">입양과 돌봄 모두 가능</span>
                </label>
              </div>
              <p className="text-xs text-gray-500 mt-2">하나의 상태를 선택해주세요.</p>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-1">특징 및 설명</label>
              <textarea id="description" name="description" value={formData.description} onChange={handleInputChange} rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" placeholder="성격, 습관, 좋아하는 것 등을 자유롭게 적어주세요." />
            </div>

            <div>
              <label htmlFor="imageUrl" className="block text-sm font-semibold text-gray-700 mb-1">사진 (URL)</label>
              <input type="url" id="imageUrl" name="imageUrl" value={formData.imageUrl} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" placeholder="https://example.com/image.jpg" />
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center bg-red-100 p-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="pt-4">
              <button type="submit" disabled={isLoading} className="w-full bg-orange-500 text-white py-3 px-4 rounded-lg font-bold text-lg hover:bg-orange-600 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed">
                {isLoading ? '등록 중...' : '새로운 가족 찾아주기'}
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}