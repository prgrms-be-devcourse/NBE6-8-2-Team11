// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { PetStatusType } from '../../../shared/types';

interface FilterState {
  species: string;
  gender: string;
  age: string;
  status: string; // petStatus 필터 추가
}

interface AnimalFilterProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
}

export default function AnimalFilter({ filters, onChange }: AnimalFilterProps) {
  const handleFilterChange = (key: keyof FilterState, value: string) => {
    onChange({
      ...filters,
      [key]: value,
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* 동물 종류 필터 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          동물 종류
        </label>
        <select
          value={filters.species}
          onChange={(e) => handleFilterChange('species', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        >
          <option value="">전체</option>
          <option value="dog">강아지</option>
          <option value="cat">고양이</option>
          <option value="rabbit">토끼</option>
          <option value="bird">새</option>
          <option value="other">기타</option>
        </select>
      </div>

      {/* 성별 필터 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          성별
        </label>
        <select
          value={filters.gender}
          onChange={(e) => handleFilterChange('gender', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        >
          <option value="">전체</option>
          <option value="MALE">수컷</option>
          <option value="FEMALE">암컷</option>
        </select>
      </div>

      {/* 나이 필터 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          나이
        </label>
        <select
          value={filters.age}
          onChange={(e) => handleFilterChange('age', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        >
          <option value="">전체</option>
          <option value="0-1">1살 이하</option>
          <option value="1-3">1-3살</option>
          <option value="3-7">3-7살</option>
          <option value="7-10">7-10살</option>
          <option value="10-15">10-15살</option>
          <option value="15-999">15살 이상</option>
        </select>
      </div>

      {/* 상태 필터 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          상태
        </label>
        <select
          value={filters.status}
          onChange={(e) => handleFilterChange('status', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        >
          <option value="">전체</option>
          <option value="AVAILABLE_BOTH">입양 및 돌봄 가능</option>
          <option value="AVAILABLE_FOR_ADOPTION">입양 가능</option>
          <option value="AVAILABLE_FOR_CARE">돌봄 가능</option>
          <option value="ADOPTED">입양 완료</option>
          <option value="CARE_IN_PROGRESS">돌봄 진행중</option>
          <option value="CARE_COMPLETED">돌봄 완료</option>
        </select>
      </div>
    </div>
  );
} 