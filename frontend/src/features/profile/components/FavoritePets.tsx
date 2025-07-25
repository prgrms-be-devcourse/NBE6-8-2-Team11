'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FavoritePet } from '../types';
import { formatDate, formatAnimalAge, formatAnimalGender, formatAnimalSpecies } from '../../../shared/utils';

export default function FavoritePets() {
  const [favoritePets, setFavoritePets] = useState<FavoritePet[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadFavoritePets = async () => {
      setIsLoading(true);
      try {
        // 모의 로딩 시간
        await new Promise(resolve => setTimeout(resolve, 600));
        
        // 모의 관심 동물 데이터
        const mockFavorites: FavoritePet[] = [
          {
            id: 1,
            petId: 1,
            petName: '멍멍이',
            petImage: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=200&h=200&fit=crop',
            species: 'dog',
            age: 3,
            gender: 'male',
            addedAt: new Date('2024-03-01')
          },
          {
            id: 2,
            petId: 3,
            petName: '나비',
            petImage: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200&h=200&fit=crop',
            species: 'cat',
            age: 2,
            gender: 'female',
            addedAt: new Date('2024-03-05')
          },
          {
            id: 3,
            petId: 5,
            petName: '토토',
            petImage: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=200&h=200&fit=crop',
            species: 'dog',
            age: 1,
            gender: 'male',
            addedAt: new Date('2024-03-10')
          },
          {
            id: 4,
            petId: 7,
            petName: '루시',
            petImage: 'https://images.unsplash.com/photo-1597626133663-53df9633b799?w=200&h=200&fit=crop',
            species: 'cat',
            age: 4,
            gender: 'female',
            addedAt: new Date('2024-03-12')
          },
          {
            id: 5,
            petId: 9,
            petName: '초코',
            petImage: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=200&h=200&fit=crop',
            species: 'dog',
            age: 2,
            gender: 'male',
            addedAt: new Date('2024-03-15')
          },
          {
            id: 6,
            petId: 11,
            petName: '미미',
            petImage: 'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=200&h=200&fit=crop',
            species: 'rabbit',
            age: 1,
            gender: 'female',
            addedAt: new Date('2024-03-18')
          }
        ];
        
        setFavoritePets(mockFavorites);
      } catch (error) {
        console.error('관심 동물 로딩 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFavoritePets();
  }, []);

  const removeFavorite = (favoriteId: number) => {
    setFavoritePets(prev => prev.filter(fav => fav.id !== favoriteId));
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
        <p className="text-gray-500 mt-2">관심 동물을 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">관심 동물</h3>
          <p className="text-sm text-gray-600">좋아하는 동물들을 한눈에 확인하세요</p>
        </div>
        <div className="text-sm text-gray-500">
          총 {favoritePets.length}마리
        </div>
      </div>

      {/* 관심 동물 그리드 */}
      {favoritePets.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">❤️</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">관심 동물이 없습니다</h3>
          <p className="text-gray-500 mb-4">갤러리에서 마음에 드는 동물을 찾아보세요!</p>
          <button className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors">
            갤러리 보기
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoritePets.map((favorite) => (
            <div key={favorite.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
              {/* 이미지 */}
              <div className="relative h-48 bg-gray-100">
                {favorite.petImage ? (
                  <Image
                    src={favorite.petImage}
                    alt={favorite.petName}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <span className="text-4xl">🐾</span>
                  </div>
                )}
                
                {/* 관심 표시 */}
                <button
                  onClick={() => removeFavorite(favorite.id)}
                  className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                  title="관심 목록에서 제거"
                >
                  ❤️
                </button>
              </div>

              {/* 정보 */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{favorite.petName}</h4>
                  <span className="text-sm text-gray-500">
                    {formatAnimalAge(favorite.age)}
                  </span>
                </div>

                {/* 특성 태그 */}
                <div className="flex flex-wrap gap-1 mb-3">
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    {formatAnimalSpecies(favorite.species)}
                  </span>
                  <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                    {formatAnimalGender(favorite.gender)}
                  </span>
                </div>

                {/* 추가 날짜 */}
                <div className="text-xs text-gray-500 mb-4">
                  관심 추가: {formatDate(favorite.addedAt)}
                </div>

                {/* 액션 버튼 */}
                <div className="flex gap-2">
                  <button className="flex-1 bg-orange-500 text-white text-center py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium">
                    상세보기
                  </button>
                  <button className="bg-gray-100 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-200 transition-colors text-sm">
                    입양신청
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 통계 */}
      {favoritePets.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-3">관심 동물 통계</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{favoritePets.length}</div>
              <div className="text-gray-600">전체</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {favoritePets.filter(pet => pet.species === 'dog').length}
              </div>
              <div className="text-gray-600">강아지</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {favoritePets.filter(pet => pet.species === 'cat').length}
              </div>
              <div className="text-gray-600">고양이</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {favoritePets.filter(pet => !['dog', 'cat'].includes(pet.species)).length}
              </div>
              <div className="text-gray-600">기타</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 