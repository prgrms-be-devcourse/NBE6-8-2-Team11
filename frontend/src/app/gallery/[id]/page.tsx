'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Header from '../../../shared/components/layout/Header';
import Footer from '../../../shared/components/layout/Footer';
import { MOCK_PETS, MOCK_SHELTERS } from '../../../shared/constants';
import { Pet } from '../../../shared/types';
import { formatAnimalAge, formatAnimalGender, formatAnimalSpecies } from '../../../shared/utils';
import Image from 'next/image';

export default function AnimalDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [pet, setPet] = useState<Pet | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!params?.id) return;
    setIsLoading(true);
    const found = MOCK_PETS.find((p) => p.id === Number(params.id));
    setPet(found || null);
    setIsLoading(false);
  }, [params?.id]);

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
          <h2 className="text-2xl font-bold mb-2">동물을 찾을 수 없습니다</h2>
          <p className="text-gray-500 mb-6">존재하지 않는 동물입니다.</p>
          <button onClick={() => router.push('/gallery')} className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors">목록으로 돌아가기</button>
        </div>
        <Footer />
      </div>
    );
  }

  const shelter = MOCK_SHELTERS.find((s) => s.id === pet.shelterId);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* 헤더 영역 */}
        <div className="border-b border-gray-200 p-6 mb-8">
          <div className="flex justify-between items-start">
            {/* 좌측: 입양 + 동물 이름 */}
            <div>
              <div className="text-sm text-orange-600 font-medium mb-3">입양</div>
              <h1 className="text-3xl font-bold text-gray-900">{pet.name}</h1>
            </div>
            
            {/* 우측: 날짜 + 상태 */}
            <div className="text-right">
              <div className="text-sm text-gray-500 mb-1">
                {pet.createdAt instanceof Date ? pet.createdAt.toLocaleDateString() : String(pet.createdAt)}
              </div>
              <div className="flex items-center justify-end">
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                  입양 가능
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 본문 영역 */}
        <div>
          {/* 동물 사진 */}
          <div className="mb-8">
            {pet.imageUrl ? (
              <div className="w-full relative">
                <Image
                  src={pet.imageUrl.split('?')[0]}
                  alt={pet.name}
                  width={800}
                  height={600}
                  className="w-full h-auto rounded-lg"
                  priority
                />
              </div>
            ) : (
              <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-6xl text-gray-400">🐾</span>
              </div>
            )}
          </div>

          {/* 동물 정보 */}
          <div className="space-y-6">
            {/* 기본 정보 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-200 p-4 rounded-lg">
                <div className="text-sm text-gray-500 mb-1">종류</div>
                <div className="font-semibold text-gray-900">{formatAnimalSpecies(pet.species)}</div>
              </div>
              <div className="bg-gray-200 p-4 rounded-lg">
                <div className="text-sm text-gray-500 mb-1">나이</div>
                <div className="font-semibold text-gray-900">{formatAnimalAge(pet.age)}</div>
              </div>
              <div className="bg-gray-200 p-4 rounded-lg">
                <div className="text-sm text-gray-500 mb-1">성별</div>
                <div className="font-semibold text-gray-900">{formatAnimalGender(pet.gender)}</div>
              </div>
            </div>

            {/* 상세 설명 */}
            <div className="bg-gray-200 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">상세 정보</h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">{pet.description}</p>
            </div>

            {/* 보호소 정보 */}
            {shelter && (
              <div className="bg-orange-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">보호소 정보</h3>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">보호소명:</span> {shelter.name}</div>
                  <div><span className="font-medium">주소:</span> {shelter.address}</div>
                  <div><span className="font-medium">연락처:</span> {shelter.phone}</div>
                </div>
              </div>
            )}
          </div>

          {/* 입양·돌봄 신청 버튼 */}
          <div className="mt-10 mb-10 pt-6 border-t border-gray-200 flex justify-center">
            <div className="w-60 h-16 flex items-center justify-center">
              <button className="w-full h-full bg-orange-500 text-white py-4 rounded-lg text-lg font-semibold border-0 outline outline-1 outline-white/50 transition-all duration-[1250ms] ease-[cubic-bezier(0.19,1,0.22,1)] 
              hover:border hover:border-solid hover:outline-offset-[15px] hover:outline-white/0 hover:shadow-[inset_0_0_20px_rgba(255,255,255,0.5),0_0_20px_rgba(255,255,255,0.2)] hover:text-shadow hover:scale-105">
                입양 · 돌봄 신청하기
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 