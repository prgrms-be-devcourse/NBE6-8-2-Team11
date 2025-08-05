import Image from 'next/image';
import Link from 'next/link';
import { Pet } from '../../../shared/types';
import { formatAnimalAge, formatAnimalGender, formatAnimalSpecies, getPetStatusDisplayText, getPetStatusColorClass } from '../../../shared/utils';

interface AnimalCardProps {
  pet: Pet;
}

export default function AnimalCard({ pet }: AnimalCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
      {/* 이미지 */}
      <div className="relative h-48 bg-gray-200">
        {pet.imageUrl ? (
          <Image
            src={pet.imageUrl}
            alt={pet.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <div className="text-4xl">🐾</div>
          </div>
        )}
        
        {/* 상태 배지 */}
        {pet.petStatuses && pet.petStatuses.length > 0 && (
          <div className="absolute top-2 right-2">
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${getPetStatusColorClass(pet.petStatuses)}`}>
              {getPetStatusDisplayText(pet.petStatuses)}
            </span>
          </div>
        )}
      </div>

      {/* 정보 */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {pet.name}
          </h3>
          <span className="text-sm text-gray-500">
            {formatAnimalAge(pet.age)}
          </span>
        </div>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {pet.description}
        </p>

        {/* 특성 태그들 */}
        <div className="flex flex-wrap gap-1 mb-4">
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
            {formatAnimalSpecies(pet.species)}
          </span>
          <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
            {formatAnimalGender(pet.gender)}
          </span>
        </div>

        {/* 보호소 정보 */}
        <div className="text-xs text-gray-500 mb-4">
          {pet.shelterName ? (
            <p>보호소: {pet.shelterName}</p>
          ) : (
            <p>보호소 정보 없음</p>
          )}
        </div>

        {/* 액션 버튼 */}
        <div className="flex gap-2">
          <Link
            href={`/gallery/${pet.id}`}
            className="w-full bg-orange-500 text-white text-center py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium"
          >
            상세보기
          </Link>
        </div>
      </div>
    </div>
  );
} 