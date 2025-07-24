// 동물 정보 타입
export interface Animal {
  id: string;
  name: string;
  type: 'dog' | 'cat' | 'rabbit' | 'bird' | 'other';
  age: number;
  gender: 'male' | 'female';
  size: 'small' | 'medium' | 'large';
  description: string;
  imageUrl: string;
  shelterId: string;
  status: 'available' | 'adopted' | 'pending';
  createdAt: Date;
  updatedAt: Date;
}

// 보호소 정보 타입
export interface Shelter {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  description: string;
  imageUrl?: string;
}

// 사용자 정보 타입
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  profileImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

// 입양 신청 타입
export interface AdoptionApplication {
  id: string;
  userId: string;
  animalId: string;
  status: 'pending' | 'approved' | 'rejected';
  message: string;
  createdAt: Date;
  updatedAt: Date;
}

// 통계 정보 타입
export interface Stats {
  totalAdoptions: number;
  animalsInCare: number;
  partnerShelters: number;
  adoptionApplicants: number;
}

// 네비게이션 메뉴 타입
export interface NavItem {
  label: string;
  href: string;
  icon?: string;
}

// 서비스 카드 타입
export interface ServiceCard {
  id: string;
  title: string;
  description: string;
  icon: string;
}

// CTA 버튼 타입
export interface CTAButton {
  label: string;
  href?: string;
  onClick?: () => void;
  variant: 'primary' | 'secondary';
} 