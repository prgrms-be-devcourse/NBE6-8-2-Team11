'use client';

import { useState, useEffect } from 'react';
import { Pet } from '@/shared/types';
import { petService } from '@/shared/services/petService';
import Header from '@/shared/components/layout/Header';
import Footer from '@/shared/components/layout/Footer';
import AnimalGrid from '@/features/gallery/components/AnimalGrid';
import AnimalFilter from '@/features/gallery/components/AnimalFilter';
import AnimalSearch from '@/features/gallery/components/AnimalSearch';
import LoadingSpinner from '@/shared/components/common/LoadingSpinner';
import ErrorBoundary from '@/shared/components/common/ErrorBoundary';

export default function GalleryPage() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [filteredPets, setFilteredPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    species: '',
    gender: '',
    age: '',
  });
  const [searchQuery, setSearchQuery] = useState('');

  // API에서 동물 데이터 로드
  useEffect(() => {
    const loadPets = async () => {
      try {
        setLoading(true);
        const petsData = await petService.getPets();
        setPets(petsData);
        setFilteredPets(petsData);
      } catch (err) {
        setError('동물 정보를 불러오는데 실패했습니다.');
        console.error('Failed to load pets:', err);
      } finally {
        setLoading(false);
      }
    };

    loadPets();
  }, []);

  // 필터링 및 검색 적용
  useEffect(() => {
    let filtered = [...pets];

    // 검색 필터
    if (searchQuery) {
      filtered = filtered.filter(pet =>
        pet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pet.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // 필터 적용
    if (filters.species) {
      filtered = filtered.filter(pet => pet.species === filters.species);
    }
    if (filters.gender) {
      filtered = filtered.filter(pet => pet.gender === filters.gender);
    }
    if (filters.age) {
      const ageRange = filters.age.split('-');
      if (ageRange.length === 2) {
        const [minAge, maxAge] = ageRange.map(Number);
        filtered = filtered.filter(pet => 
          pet.age >= minAge && pet.age <= maxAge
        );
      }
    }

    setFilteredPets(filtered);
  }, [pets, filters, searchQuery]);

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleClearFilters = () => {
    setFilters({
      species: '',
      gender: '',
      age: '',
    });
    setSearchQuery('');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">오류가 발생했습니다</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        {/* 헤더 섹션 */}
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                보호중인 동물들
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                사랑스러운 반려동물들이 새로운 가족을 기다리고 있습니다. 
                마음에 드는 동물을 찾아 입양/돌봄을 신청해보세요.
              </p>
            </div>
          </div>
        </div>

        {/* 필터 및 검색 섹션 */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1">
                <AnimalSearch
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="동물 이름, 설명으로 검색..."
                />
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={handleClearFilters}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  필터 초기화
                </button>
                <span className="text-sm text-gray-500">
                  {filteredPets.length}마리 발견
                </span>
              </div>
            </div>
            
            <div className="mt-6">
              <AnimalFilter
                filters={filters}
                onChange={handleFilterChange}
              />
            </div>
          </div>
        </div>

        {/* 동물 그리드 */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          {filteredPets.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🐾</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                조건에 맞는 동물이 없습니다
              </h3>
              <p className="text-gray-500 mb-6">
                검색 조건을 변경해보세요
              </p>
              <button
                onClick={handleClearFilters}
                className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
              >
                모든 동물 보기
              </button>
            </div>
          ) : (
            <AnimalGrid pets={filteredPets} />
          )}
        </div>
        
        <Footer />
      </div>
    </ErrorBoundary>
  );
} 