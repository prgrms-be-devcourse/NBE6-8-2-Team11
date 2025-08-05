import { PetStatusType } from '../types';

// 숫자 포맷팅 함수
export const formatNumber = (num: number): string => {
  if (typeof num !== 'number' || isNaN(num)) {
    console.warn('Invalid number provided:', num);
    return '0';
  }
  return num.toLocaleString();
};

// 날짜 포맷팅 함수
export const formatDate = (date: Date): string => {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    console.warn('Invalid date provided:', date);
    return '날짜 미상';
  }
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

// 동물 나이 표시 함수
export const formatAnimalAge = (age: number): string => {
  if (typeof age !== 'number' || age < 0) {
    console.warn('Invalid age provided:', age);
    return '나이 미상';
  }
  if (age === 1) return '1살';
  return `${age}살`;
};

// 동물 성별 표시 함수
export const formatAnimalGender = (gender: 'MALE' | 'FEMALE' | 'UNKNOWN' | 'NEUTERED_MALE' | 'NEUTERED_FEMALE' ): string => {
  switch (gender) {
    case 'MALE':
      return '수컷';
    case 'FEMALE':
      return '암컷';
    case 'UNKNOWN':
      return '성별 미상';
    case 'NEUTERED_MALE':
      return '중성화된 수컷';
    case 'NEUTERED_FEMALE':
      return '중성화된 암컷';
    default:
      console.warn('Unknown gender:', gender);
      return '성별 미상';
  }
};

// 동물 종류 표시 함수 (species 기반)
export const formatAnimalSpecies = (species: string): string => {
  if (!species || typeof species !== 'string') {
    console.warn('Invalid species provided:', species);
    return '종류 미상';
  }
  const speciesMap: Record<string, string> = {
    dog: '강아지',
    cat: '고양이',
    rabbit: '토끼',
    bird: '새',
    other: '기타',
  };
  return speciesMap[species] || species;
};

// 클래스명 조합 함수
export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

// 스크롤 애니메이션 함수
export const scrollToSection = (sectionId: string): void => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

// 로컬 스토리지 헬퍼 함수들
export const storage = {
  get: (key: string): unknown => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  },
  
  set: (key: string, value: unknown): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  },
  
  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  },
};

// 디바운스 함수
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// 쿼리 파라미터 파싱 함수
export const parseQueryParams = (queryString: string): Record<string, string> => {
  const params = new URLSearchParams(queryString);
  const result: Record<string, string> = {};
  
  for (const [key, value] of params.entries()) {
    result[key] = value;
  }
  
  return result;
}; 

// 동물 상태에 따른 표시 텍스트 반환
export const getPetStatusDisplayText = (statuses: PetStatusType[] | undefined): string => {
  if (!statuses || statuses.length === 0) {
    return '상태 미정';
  }

  // 입양 및 돌봄 가능이 있으면 "입양 및 돌봄 가능"
  if (statuses.includes('AVAILABLE_BOTH')) {
    return '입양 및 돌봄 가능';
  }
  
  // 입양 가능이 있으면 "입양 가능"
  if (statuses.includes('AVAILABLE_FOR_ADOPTION')) {
    return '입양 가능';
  }
  
  // 돌봄 가능이 있으면 "돌봄 가능"
  if (statuses.includes('AVAILABLE_FOR_CARE')) {
    return '돌봄 가능';
  }
  
  // 입양 완료, 돌봄 진행중, 돌봄 완료가 있으면 "입양/돌봄 불가능"
  if (statuses.includes('ADOPTED') || statuses.includes('CARE_IN_PROGRESS') || statuses.includes('CARE_COMPLETED')) {
    return '입양/돌봄 불가능';
  }
  
  return '상태 미정';
};

// 동물 상태에 따른 배경색 클래스 반환
export const getPetStatusColorClass = (statuses: PetStatusType[] | undefined): string => {
  if (!statuses || statuses.length === 0) {
    return 'bg-gray-100 text-gray-800';
  }

  // 입양 및 돌봄 가능이 있으면 주황색
  if (statuses.includes('AVAILABLE_BOTH')) {
    return 'bg-orange-100 text-orange-800';
  }
  
  // 입양 가능이 있으면 초록색
  if (statuses.includes('AVAILABLE_FOR_ADOPTION')) {
    return 'bg-green-100 text-green-800';
  }
  
  // 돌봄 가능이 있으면 파란색
  if (statuses.includes('AVAILABLE_FOR_CARE')) {
    return 'bg-blue-100 text-blue-800';
  }
  
  // 입양 완료, 돌봄 진행중, 돌봄 완료가 있으면 회색
  if (statuses.includes('ADOPTED') || statuses.includes('CARE_IN_PROGRESS') || statuses.includes('CARE_COMPLETED')) {
    return 'bg-gray-100 text-gray-800';
  }
  
  return 'bg-gray-100 text-gray-800';
};

// 입양과 돌봄이 모두 가능한지 확인
export const isAvailableForBoth = (statuses: PetStatusType[] | undefined): boolean => {
  if (!statuses || statuses.length === 0) return false;
  return statuses.includes('AVAILABLE_BOTH') || 
         (statuses.includes('AVAILABLE_FOR_ADOPTION') && statuses.includes('AVAILABLE_FOR_CARE'));
};

// 입양 가능한지 확인
export const isAvailableForAdoption = (statuses: PetStatusType[] | undefined): boolean => {
  if (!statuses || statuses.length === 0) return false;
  return statuses.includes('AVAILABLE_FOR_ADOPTION') || statuses.includes('AVAILABLE_BOTH');
};

// 돌봄 가능한지 확인
export const isAvailableForCare = (statuses: PetStatusType[] | undefined): boolean => {
  if (!statuses || statuses.length === 0) return false;
  return statuses.includes('AVAILABLE_FOR_CARE') || statuses.includes('AVAILABLE_BOTH');
};

// 입양/돌봄 불가능한지 확인
export const isUnavailable = (statuses: PetStatusType[] | undefined): boolean => {
  if (!statuses || statuses.length === 0) return false;
  return statuses.includes('ADOPTED') || statuses.includes('CARE_IN_PROGRESS') || statuses.includes('CARE_COMPLETED');
}; 