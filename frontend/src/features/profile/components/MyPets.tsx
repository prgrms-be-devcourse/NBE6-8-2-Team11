'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Pet } from '../../../shared/types';
import { petService } from '../../../shared/services/petService';
import { useAuth } from '../../../context/AuthContext';
import { formatAnimalAge, formatAnimalGender, formatAnimalSpecies } from '../../../shared/utils';
import Image from 'next/image';

export default function MyPets() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { userInfo } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const loadMyPets = async () => {
      if (!userInfo) return;
      
      try {
        setIsLoading(true);
        
        // 모든 펫을 가져와서 내 펫만 필터링
        const allPets = await petService.getPets();
        
        // 사용자 ID 추출 (JWT 토큰의 id 클레임 우선 사용)
        const currentUserId = userInfo.id || 
                             (userInfo.sub ? parseInt(userInfo.sub, 10) : 0) || 
                             0;
        
        if (currentUserId === 0) {
          console.error('유효하지 않은 사용자 ID:', userInfo);
          setError('사용자 정보를 불러올 수 없습니다.');
          return;
        }
        
        const myPets = allPets.filter(pet => pet.petOwnerId === currentUserId);
        setPets(myPets);
      } catch (err) {
        console.error('Failed to load my pets:', err);
        setError('내 펫 목록을 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    loadMyPets();
  }, [userInfo]);

  const handleDeletePet = async (petId: number, petName: string) => {
    if (window.confirm(`정말로 "${petName}"을(를) 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`)) {
      try {
        await petService.deletePet(petId.toString());
        alert('펫이 성공적으로 삭제되었습니다.');
        // 펫 목록 새로고침
        setPets(prev => prev.filter(pet => pet.id !== petId));
      } catch (err) {
        alert('펫 삭제에 실패했습니다.');
        console.error('Failed to delete pet:', err);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (pets.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🐾</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">등록된 펫이 없습니다</h3>
        <p className="text-gray-500 mb-6">새로운 가족을 찾아줄 펫을 등록해보세요!</p>
        <button
          onClick={() => router.push('/pets/register')}
          className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
        >
          펫 등록하기
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">내가 등록한 펫 ({pets.length}마리)</h3>
        <button
          onClick={() => router.push('/pets/register')}
          className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
        >
          새 펫 등록
        </button>
      </div>

      {/* 펫 카드 리스트 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pets.map((pet) => (
          <div key={pet.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            {/* 펫 이미지 */}
            <div className="aspect-square relative">
              {pet.imageUrl ? (
                <Image
                  src={pet.imageUrl}
                  alt={pet.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <span className="text-4xl text-gray-400">🐾</span>
                </div>
              )}
            </div>

            {/* 펫 정보 */}
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-lg font-semibold text-gray-900">{pet.name}</h4>
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                  입양 가능
                </span>
              </div>
              
              <div className="space-y-1 text-sm text-gray-600 mb-4">
                <p>{formatAnimalSpecies(pet.species)} • {formatAnimalAge(pet.age)} • {formatAnimalGender(pet.gender)}</p>
                <p className="line-clamp-2">{pet.description}</p>
              </div>

              {/* 버튼들 */}
              <div className="flex gap-2">
                <button
                  onClick={() => router.push(`/gallery/${pet.id}`)}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded text-sm hover:bg-gray-200 transition-colors"
                >
                  상세보기
                </button>
                <button
                  onClick={() => router.push(`/pets/edit/${pet.id}`)}
                  className="flex-1 bg-blue-500 text-white py-2 px-3 rounded text-sm hover:bg-blue-600 transition-colors"
                >
                  수정
                </button>
                <button
                  onClick={() => handleDeletePet(pet.id, pet.name)}
                  className="bg-red-500 text-white py-2 px-3 rounded text-sm hover:bg-red-600 transition-colors"
                >
                  삭제
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}