// 네비게이션 메뉴 상수
export const NAV_ITEMS = [
  { label: '홈', href: '/' },
  { label: '보호중인 동물', href: '/gallery' },
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
    id: 'matching',
    title: '매칭 서비스',
    description: '보호소와 입양희망자를 연결하여 최적의 매칭을 도와드립니다.',
    icon: '🤝',
  },
];

// 통계 데이터
export const STATS_DATA = [
  { label: '성공한 입양 및 돌봄', value: 1234 },
  { label: '보호중인 동물', value: 567 },
  { label: '협력 보호소', value: 89 },
  { label: '입양/돌봄 희망자', value: 2345 },
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