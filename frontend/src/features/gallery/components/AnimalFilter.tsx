interface FilterState {
  species: string;
  gender: string;
  age: string;
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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          <option value="male">수컷</option>
          <option value="female">암컷</option>
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
    </div>
  );
} 