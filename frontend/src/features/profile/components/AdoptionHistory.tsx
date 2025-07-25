'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { AdoptionRecord } from '../types';
import { formatDate } from '../../../shared/utils';

export default function AdoptionHistory() {
  const [adoptionRecords, setAdoptionRecords] = useState<AdoptionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const loadAdoptionHistory = async () => {
      setIsLoading(true);
      try {
        // 모의 로딩 시간
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // 모의 입양 이력 데이터
        const mockRecords: AdoptionRecord[] = [
          {
            id: 1,
            petId: 1,
            petName: '멍멍이',
            petImage: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=100&h=100&fit=crop',
            shelterName: '행복한 동물보호소',
            status: 'completed',
            appliedAt: new Date('2024-01-15'),
            updatedAt: new Date('2024-02-01')
          },
          {
            id: 2,
            petId: 3,
            petName: '나비',
            petImage: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=100&h=100&fit=crop',
            shelterName: '사랑의 동물병원',
            status: 'pending',
            appliedAt: new Date('2024-03-10')
          },
          {
            id: 3,
            petId: 5,
            petName: '토토',
            petImage: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=100&h=100&fit=crop',
            shelterName: '미래동물병원',
            status: 'rejected',
            appliedAt: new Date('2024-02-20'),
            updatedAt: new Date('2024-02-25')
          },
          {
            id: 4,
            petId: 7,
            petName: '루시',
            petImage: 'https://images.unsplash.com/photo-1597626133663-53df9633b799?w=200&h=200&fit=crop',
            shelterName: '희망동물보호소',
            status: 'approved',
            appliedAt: new Date('2024-03-15'),
            updatedAt: new Date('2024-03-18')
          }
        ];
        
        setAdoptionRecords(mockRecords);
      } catch (error) {
        console.error('입양 이력 로딩 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAdoptionHistory();
  }, []);

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return '검토 중';
      case 'approved': return '승인됨';
      case 'rejected': return '거절됨';
      case 'completed': return '완료됨';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredRecords = adoptionRecords.filter(record => {
    if (filter === 'all') return true;
    return record.status === filter;
  });

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
        <p className="text-gray-500 mt-2">입양 이력을 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 필터 */}
      <div className="flex items-center space-x-4">
        <span className="text-sm font-medium text-gray-700">상태별 필터:</span>
        <div className="flex space-x-2">
          {[
            { value: 'all', label: '전체' },
            { value: 'pending', label: '검토 중' },
            { value: 'approved', label: '승인됨' },
            { value: 'rejected', label: '거절됨' },
            { value: 'completed', label: '완료됨' }
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setFilter(option.value)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filter === option.value
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* 입양 이력 목록 */}
      <div className="space-y-4">
        {filteredRecords.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🐾</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">입양 이력이 없습니다</h3>
            <p className="text-gray-500">아직 입양 신청을 하지 않으셨네요.</p>
          </div>
        ) : (
          filteredRecords.map((record) => (
            <div key={record.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow relative">
              <div className="flex items-start space-x-4">
                {/* 동물 이미지 */}
                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                  {record.petImage ? (
                    <Image
                      src={record.petImage}
                      alt={record.petName}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <span className="text-2xl">🐾</span>
                    </div>
                  )}
                </div>

                {/* 정보 */}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{record.petName}</h3>
                      <p className="text-sm text-gray-600">{record.shelterName}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                      {getStatusLabel(record.status)}
                    </span>
                  </div>

                  <div className="mt-2 text-sm text-gray-500">
                    <p>신청일: {formatDate(record.appliedAt)}</p>
                    {record.updatedAt && (
                      <p>처리일: {formatDate(record.updatedAt)}</p>
                    )}
                  </div>
                </div>

                {/* 액션 버튼 */}
                <div className="flex flex-col space-y-2">
                  <button className="text-sm text-orange-600 hover:text-orange-700 font-medium">
                    상세보기
                  </button>
                </div>
              </div>

              {/* 신청 취소 버튼 - 우측 하단에 배치 */}
              {record.status === 'pending' && (
                <div className="absolute bottom-4 right-4">
                  <button className="text-sm text-red-600 hover:text-red-700 font-medium bg-red-50 hover:bg-red-100 px-3 py-1 rounded-lg transition-colors">
                    입양 취소
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* 통계 */}
      {adoptionRecords.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-3">입양 신청 통계</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{adoptionRecords.length}</div>
              <div className="text-gray-600">전체 신청</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {adoptionRecords.filter(r => r.status === 'pending').length}
              </div>
              <div className="text-gray-600">검토 중</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {adoptionRecords.filter(r => r.status === 'approved' || r.status === 'completed').length}
              </div>
              <div className="text-gray-600">승인됨</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {adoptionRecords.filter(r => r.status === 'rejected').length}
              </div>
              <div className="text-gray-600">거절됨</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 