// 숫자 포맷팅 함수
export const formatNumber = (num: number): string => {
  return num.toLocaleString();
};

// 날짜 포맷팅 함수
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

// 동물 나이 표시 함수
export const formatAnimalAge = (age: number): string => {
  if (age === 1) return '1살';
  return `${age}살`;
};

// 동물 성별 표시 함수
export const formatAnimalGender = (gender: 'male' | 'female'): string => {
  return gender === 'male' ? '수컷' : '암컷';
};

// 동물 크기 표시 함수
export const formatAnimalSize = (size: 'small' | 'medium' | 'large'): string => {
  const sizeMap = {
    small: '소형',
    medium: '중형',
    large: '대형',
  };
  return sizeMap[size];
};

// 동물 타입 표시 함수
export const formatAnimalType = (type: string): string => {
  const typeMap: Record<string, string> = {
    dog: '강아지',
    cat: '고양이',
    rabbit: '토끼',
    bird: '새',
    other: '기타',
  };
  return typeMap[type] || type;
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
  get: (key: string): any => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  },
  
  set: (key: string, value: any): void => {
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
export const debounce = <T extends (...args: any[]) => any>(
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