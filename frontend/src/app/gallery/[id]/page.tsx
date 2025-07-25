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
      <main className="max-w-3xl mx-auto px-4 py-10">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col md:flex-row">
          {/* 이미지 */}
          <div className="relative w-full md:w-1/2 h-72 md:h-auto">
            {pet.imageUrl ? (
              <Image
                src={pet.imageUrl}
                alt={pet.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
                <span className="text-6xl">🐾</span>
              </div>
            )}
          </div>
          {/* 정보 */}
          <div className="flex-1 p-8 flex flex-col justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{pet.name}</h2>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                  {formatAnimalSpecies(pet.species)}
                </span>
                <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                  {formatAnimalGender(pet.gender)}
                </span>
                <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded">
                  {formatAnimalAge(pet.age)}
                </span>
              </div>
              <p className="text-gray-700 mb-6 whitespace-pre-line">{pet.description}</p>
              <div className="text-sm text-gray-500 mb-2">
                <span className="font-medium">등록일:</span> {pet.createdAt instanceof Date ? pet.createdAt.toLocaleDateString() : String(pet.createdAt)}
              </div>
              {shelter && (
                <div className="text-sm text-gray-500">
                  <span className="font-medium">보호소:</span> {shelter.name} <br />
                  <span className="font-medium">주소:</span> {shelter.address} <br />
                  <span className="font-medium">연락처:</span> {shelter.phone}
                </div>
              )}
            </div>
            <div className="mt-8 flex gap-4">
              <button className="flex-1 bg-orange-500 text-white py-3 rounded-lg text-lg font-semibold hover:bg-orange-600 transition-colors">
                입양 신청하기
              </button>
              <button onClick={() => router.push('/gallery')} className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg text-lg font-semibold hover:bg-gray-200 transition-colors">
                목록으로
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 