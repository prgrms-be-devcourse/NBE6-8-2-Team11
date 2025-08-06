'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '../../../../shared/components/layout/Header';
import Footer from '../../../../shared/components/layout/Footer';
import { petService } from '../../../../shared/services/petService';
import { useAuth } from '../../../../context/AuthContext';
import { Pet, PetUpdateRequestDto } from '../../../../shared/types';

export default function PetEditPage() {
  const params = useParams();
  const router = useRouter();
  const { isLoggedIn, userInfo } = useAuth();
  
  const [pet, setPet] = useState<Pet | null>(null);
  const [formData, setFormData] = useState<PetUpdateRequestDto>({
    name: '',
    species: '',
    age: 0,
    gender: 'MALE',
    description: '',
    imageUrl: '',
    statuses: ['AVAILABLE_FOR_ADOPTION']
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // 펫 데이터 로드
  useEffect(() => {
    if (!params?.id) return;
    
    const loadPetData = async () => {
      try {
        setIsLoading(true);
        const petData = await petService.getPet(params.id as string);
        setPet(petData);
        
        // 폼 데이터 초기화
        setFormData({
          name: petData.name,
          species: petData.species,
          age: petData.age,
          gender: petData.gender,
          description: petData.description || '',
          imageUrl: petData.imageUrl || '',
          shelterName: petData.shelterName || '',
          statuses: petData.petStatuses || ['AVAILABLE_FOR_ADOPTION']
        });
      } catch (err) {
        setError('펫 정보를 불러오는데 실패했습니다.');
        console.error('Failed to load pet:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadPetData();
  }, [params?.id]);

  // 권한 체크
  useEffect(() => {
    if (!isLoggedIn) {
      alert('로그인이 필요한 서비스입니다.');
      router.replace('/login');
      return;
    }

    if (pet && userInfo) {
      // 여러 방법으로 사용자 ID 확인
      let currentUserId: number;
      
      if (userInfo.id && userInfo.id !== null && userInfo.id !== undefined) {
        currentUserId = typeof userInfo.id === 'number' ? userInfo.id : parseInt(String(userInfo.id), 10);
      } else if (userInfo.sub) {
        currentUserId = parseInt(userInfo.sub, 10);
      } else {
        // localStorage에서 userInfo 다시 확인
        const storedUserInfo = localStorage.getItem('userInfo');
        if (storedUserInfo) {
          try {
            const parsedUserInfo = JSON.parse(storedUserInfo);
            currentUserId = parseInt(parsedUserInfo.id || parsedUserInfo.sub || '0', 10);
          } catch {
            currentUserId = 0;
          }
        } else {
          currentUserId = 0;
        }
      }

      const isOwner = currentUserId === pet.petOwnerId;
      const isAdmin = userInfo.auth?.includes('ADMIN') || userInfo.auth === 'ROLE_ADMIN';
      
      console.log('권한 체크:', {
        currentUserId,
        petOwnerId: pet.petOwnerId,
        isOwner,
        isAdmin,
        userAuth: userInfo.auth
      });
      
      if (!isOwner && !isAdmin) {
        alert('수정 권한이 없습니다.');
        router.replace(`/gallery/${pet.id}`);
        return;
      }
    }
  }, [isLoggedIn, pet, userInfo, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'age' ? parseInt(value, 10) || 0 : value 
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pet) return;

    if (!formData.name || !formData.species || !formData.gender) {
      setError('이름, 품종, 성별은 필수 항목입니다.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await petService.updatePet(pet.id.toString(), formData);
      alert('펫 정보가 성공적으로 수정되었습니다!');
      router.push(`/gallery/${pet.id}`);
    } catch (err: unknown) {
      let errorMessage = '펫 정보 수정에 실패했습니다. 잠시 후 다시 시도해주세요.';
      
      if (err && typeof err === 'object' && 'response' in err) {
        const responseError = err as { response?: { data?: { message?: string } } };
        if (responseError.response?.data?.message) {
          errorMessage = responseError.response.data.message;
        }
      }
      setError(errorMessage);
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!pet) return;
    
    if (window.confirm(`정말로 "${pet.name}"을(를) 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`)) {
      try {
        await petService.deletePet(pet.id.toString());
        alert('펫이 성공적으로 삭제되었습니다.');
        router.push('/gallery');
      } catch (err) {
        alert('펫 삭제에 실패했습니다.');
        console.error('Failed to delete pet:', err);
      }
    }
  };

  if (!isLoggedIn) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="text-6xl mb-4">🐾</div>
          <h2 className="text-2xl font-bold mb-2">펫을 찾을 수 없습니다</h2>
          <button onClick={() => router.push('/gallery')} className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors">목록으로 돌아가기</button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">펫 정보 수정</h1>
            <p className="text-gray-500">{pet.name}의 정보를 수정해주세요.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1">이름 *</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                value={formData.name} 
                onChange={handleInputChange} 
                required 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="species" className="block text-sm font-semibold text-gray-700 mb-1">품종 *</label>
                <input 
                  type="text" 
                  id="species" 
                  name="species" 
                  value={formData.species} 
                  onChange={handleInputChange} 
                  required 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" 
                  placeholder="예: 코리안 숏헤어" 
                />
              </div>
              <div>
                <label htmlFor="age" className="block text-sm font-semibold text-gray-700 mb-1">나이 (살)</label>
                <input 
                  type="number" 
                  id="age" 
                  name="age" 
                  min="0" 
                  value={formData.age} 
                  onChange={handleInputChange} 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" 
                />
              </div>
            </div>

            <div>
              <label htmlFor="gender" className="block text-sm font-semibold text-gray-700 mb-1">성별 *</label>
              <select 
                id="gender" 
                name="gender" 
                value={formData.gender} 
                onChange={handleInputChange} 
                required 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
              >
                <option value="MALE">수컷</option>
                <option value="FEMALE">암컷</option>
                <option value="NEUTERED_MALE">중성화 (수컷)</option>
                <option value="NEUTERED_FEMALE">중성화 (암컷)</option>
                <option value="UNKNOWN">모름</option>
              </select>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-1">특징 및 설명</label>
              <textarea 
                id="description" 
                name="description" 
                value={formData.description} 
                onChange={handleInputChange} 
                rows={4} 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" 
                placeholder="성격, 습관, 좋아하는 것 등을 자유롭게 적어주세요." 
              />
            </div>

            <div>
              <label htmlFor="imageUrl" className="block text-sm font-semibold text-gray-700 mb-1">사진 (URL)</label>
              <input 
                type="url" 
                id="imageUrl" 
                name="imageUrl" 
                value={formData.imageUrl} 
                onChange={handleInputChange} 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" 
                placeholder="https://example.com/image.jpg" 
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center bg-red-100 p-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <button 
                type="button"
                onClick={() => router.back()}
                className="flex-1 bg-gray-500 text-white py-3 px-4 rounded-lg font-bold text-lg hover:bg-gray-600 transition-all duration-300"
              >
                취소
              </button>
              <button 
                type="submit" 
                disabled={isSubmitting} 
                className="flex-1 bg-orange-500 text-white py-3 px-4 rounded-lg font-bold text-lg hover:bg-orange-600 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isSubmitting ? '수정 중...' : '수정 완료'}
              </button>
            </div>

            {/* 삭제 버튼 */}
            <div className="pt-4 border-t border-gray-200">
              <button 
                type="button"
                onClick={handleDelete}
                className="w-full bg-red-500 text-white py-3 px-4 rounded-lg font-bold text-lg hover:bg-red-600 transition-all duration-300"
              >
                펫 삭제하기
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}