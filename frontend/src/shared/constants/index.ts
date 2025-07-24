// 네비게이션 메뉴 상수
export const NAV_ITEMS = [
  { label: '홈', href: '/' },
  { label: '입양동물', href: '/gallery' },
  { label: '내정보', href: '/profile' },
  { label: '입양신청', href: '/apply' },
];

// 서비스 카드 데이터
export const SERVICE_CARDS = [
  {
    id: 'search',
    title: '동물 검색',
    description: '다양한 유기동물들을 갤러리 형태로 쉽게 찾아보고 상세 정보를 확인할 수 있습니다.',
    icon: '🔍',
  },
  {
    id: 'apply',
    title: '입양 신청',
    description: '간편한 신청서를 통해 원하는 동물에 대한 입양을 신청할 수 있습니다.',
    icon: '📝',
  },
  {
    id: 'matching',
    title: '매칭 서비스',
    description: '보호소와 입양희망자를 연결하여 최적의 매칭을 도와드립니다.',
    icon: '🤝',
  },
];

// 통계 데이터
export const STATS_DATA = [
  { label: '성공한 입양', value: 1234 },
  { label: '보호중인 동물', value: 567 },
  { label: '협력 보호소', value: 89 },
  { label: '입양희망자', value: 2345 },
];

// 샘플 동물 데이터
export const SAMPLE_ANIMALS = [
  {
    id: '1',
    name: '멍멍이 1호',
    type: 'dog' as const,
    age: 3,
    gender: 'male' as const,
    size: 'medium' as const,
    description: '활발하고 친근한 성격의 강아지입니다.',
    imageUrl: '/api/placeholder/300/200',
    shelterId: 'shelter1',
    status: 'available' as const,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: '멍멍이 2호',
    type: 'dog' as const,
    age: 2,
    gender: 'female' as const,
    size: 'small' as const,
    description: '조용하고 순한 성격의 강아지입니다.',
    imageUrl: '/api/placeholder/300/200',
    shelterId: 'shelter1',
    status: 'available' as const,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    name: '멍멍이 3호',
    type: 'dog' as const,
    age: 4,
    gender: 'male' as const,
    size: 'large' as const,
    description: '충성스럽고 지킴이 역할을 잘하는 강아지입니다.',
    imageUrl: '/api/placeholder/300/200',
    shelterId: 'shelter1',
    status: 'available' as const,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '4',
    name: '멍멍이 4호',
    type: 'dog' as const,
    age: 1,
    gender: 'female' as const,
    size: 'medium' as const,
    description: '장난스럽고 에너지 넘치는 강아지입니다.',
    imageUrl: '/api/placeholder/300/200',
    shelterId: 'shelter1',
    status: 'available' as const,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// 연락처 정보
export const CONTACT_INFO = {
  email: 'info@petfriend.com',
  phone: '02-1234-5678',
  address: '서울시 강남구 테헤란로 123',
};

// 브랜드 정보
export const BRAND_INFO = {
  name: '돌봄즈',
  logo: '🐾',
  description: '유기동물과 입양희망자를 연결하는 따뜻한 플랫폼입니다.',
}; 