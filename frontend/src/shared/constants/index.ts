// 네비게이션 메뉴 상수
export const NAV_ITEMS = [
  { label: '홈', href: '/' },
  { label: '보호중인 동물', href: '/gallery' },
  { label: '입양/돌봄 신청', href: '/apply' },
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
    title: '입양/돌봄 신청',
    description: '간편한 신청서를 통해 원하는 동물에 대한 입양 및 돌봄을 신청할 수 있습니다.',
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
  { label: '성공한 입양 및 돌봄', value: 1234 },
  { label: '보호중인 동물', value: 567 },
  { label: '협력 보호소', value: 89 },
  { label: '입양/돌봄 희망자', value: 2345 },
];

// Mock 보호소 데이터 (shelter 테이블 기반)
export const MOCK_SHELTERS = [
  {
    id: 1,
    name: '사랑의 동물보호소',
    address: '서울시 강남구 테헤란로 123',
    city: '서울',
    state: '강남구',
    zipCode: '06123',
    phone: '02-1234-5678',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 2,
    name: '희망의 동물보호소',
    address: '서울시 서초구 서초대로 456',
    city: '서울',
    state: '서초구',
    zipCode: '06678',
    phone: '02-2345-6789',
    createdAt: new Date('2024-01-02'),
  },
  {
    id: 3,
    name: '따뜻한 동물보호소',
    address: '경기도 성남시 분당구 정자로 789',
    city: '성남',
    state: '분당구',
    zipCode: '13579',
    phone: '031-3456-7890',
    createdAt: new Date('2024-01-03'),
  },
];

// Mock 사용자 데이터 (member 테이블 기반)
export const MOCK_MEMBERS = [
  {
    id: 1,
    member: 'admin',
    email: 'admin@petfriend.com',
    password: 'hashed_password',
    name: '관리자',
    role: 'admin' as const,
    phone: '010-1234-5678',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 2,
    member: 'shelter_manager1',
    email: 'manager1@petfriend.com',
    password: 'hashed_password',
    name: '보호소 관리자 1',
    role: 'shelter_manager' as const,
    phone: '010-2345-6789',
    createdAt: new Date('2024-01-02'),
  },
  {
    id: 3,
    member: 'user1',
    email: 'user1@example.com',
    password: 'hashed_password',
    name: '김철수',
    role: 'user' as const,
    phone: '010-3456-7890',
    createdAt: new Date('2024-01-03'),
  },
];

// Mock 동물 데이터 (pet 테이블 기반)
export const MOCK_PETS = [
  {
    id: 1,
    name: '멍멍이',
    species: 'dog',
    age: 3,
    gender: 'male' as const,
    description: '활발하고 친근한 강아지입니다. 산책을 좋아하고 아이들과 잘 어울립니다.',
    imageUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop',
    shelterId: 1,
    memberIdCreatedBy: 2,
    createdAt: new Date('2024-01-15'),
  },
  {
    id: 2,
    name: '나비',
    species: 'cat',
    age: 2,
    gender: 'female' as const,
    description: '조용하고 우아한 고양이입니다. 창가에서 햇볕을 즐기며 독립적인 성격을 가지고 있습니다.',
    imageUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=300&fit=crop',
    shelterId: 2,
    memberIdCreatedBy: 2,
    createdAt: new Date('2024-01-10'),
  },
  {
    id: 3,
    name: '토토',
    species: 'rabbit',
    age: 1,
    gender: 'male' as const,
    description: '귀엽고 순한 토끼입니다. 당근을 좋아하고 깔끔한 환경을 선호합니다.',
    imageUrl: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=400&h=300&fit=crop',
    shelterId: 3,
    memberIdCreatedBy: 2,
    createdAt: new Date('2024-01-20'),
  },
  {
    id: 4,
    name: '초코',
    species: 'dog',
    age: 5,
    gender: 'female' as const,
    description: '성숙하고 안정적인 성격의 대형견입니다. 경비견으로도 적합합니다.',
    imageUrl: 'https://images.unsplash.com/photo-1546527868-ccb7ee7dfa6a?w=400&h=300&fit=crop',
    shelterId: 1,
    memberIdCreatedBy: 2,
    createdAt: new Date('2024-01-05'),
  },
  {
    id: 5,
    name: '미미',
    species: 'cat',
    age: 4,
    gender: 'female' as const,
    description: '사교적이고 장난스러운 고양이입니다. 다른 동물들과도 잘 어울립니다.',
    imageUrl: 'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=400&h=300&fit=crop',
    shelterId: 2,
    memberIdCreatedBy: 2,
    createdAt: new Date('2024-01-12'),
  },
  {
    id: 6,
    name: '앵구',
    species: 'bird',
    age: 2,
    gender: 'male' as const,
    description: '예쁜 노래를 부르는 새입니다. 깨끗한 케이지에서 잘 살 수 있습니다.',
    imageUrl: 'https://images.unsplash.com/photo-1693218722743-eba71402ab37?w=400&h=300&fit=crop',
    shelterId: 3,
    memberIdCreatedBy: 2,
    createdAt: new Date('2024-01-18'),
  },
];

// Mock 입양 신청 데이터 (adoption 테이블 기반)
export const MOCK_ADOPTIONS = [
  {
    id: 1,
    memberId: 3,
    petId: 1,
    message: '멍멍이를 입양하고 싶습니다. 아이들과 함께 살 수 있는 환경입니다.',
    status: 'pending' as const,
    createdAt: new Date('2024-01-25'),
  },
  {
    id: 2,
    memberId: 3,
    petId: 2,
    message: '나비를 입양하고 싶습니다. 조용한 환경에서 키울 수 있습니다.',
    status: 'approved' as const,
    createdAt: new Date('2024-01-26'),
  },
];

// Mock 임시 보호 신청 데이터 (care 테이블 기반)
export const MOCK_CARES = [
  {
    id: 1,
    memberId: 3,
    petId: 3,
    message: '토토를 임시로 보호하고 싶습니다. 토끼 키우는 경험이 있습니다.',
    desiredStartDate: new Date('2024-02-01'),
    desiredEndDate: new Date('2024-02-28'),
    status: 'pending' as const,
    createdAt: new Date('2024-01-27'),
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