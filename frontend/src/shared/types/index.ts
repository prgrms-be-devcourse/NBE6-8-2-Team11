// 동물 정보 타입 (pet 테이블 기반)
export interface Pet {
  id: number;
  name: string;
  species: string; // dog, cat, rabbit, bird, other
  age: number;
  gender: 'MALE' | 'FEMALE';
  description: string;
  imageUrl?: string;
  shelterId: number;
  memberIdCreatedBy: number;
  createdAt: Date;
}

// 보호소 정보 타입 (shelter 테이블 기반)
export interface Shelter {
  id: number;
  name: string;
  address: string;
  city: string;
  state?: string;
  zipCode?: string;
  phone?: string;
  createdAt: Date;
}

// 사용자 정보 타입 (member 테이블 기반)
export interface Member {
  id: number;
  member: string; // username/login ID
  email: string;
  password: string;
  name: string;
  role: 'user' | 'admin' | 'shelter_manager';
  phone?: string;
  createdAt: Date;
}

// 입양 신청 타입 (adoption 테이블 기반)
export interface Adoption {
  id: number;
  memberId: number;
  petId: number;
  message: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
}

// 임시 보호 신청 타입 (care 테이블 기반)
export interface Care {
  id: number;
  memberId: number;
  petId: number;
  message: string;
  desiredStartDate: Date;
  desiredEndDate: Date;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
}

// 동물 상태 타입 (pet_status 테이블 기반)
export interface PetStatus {
  id: number;
  petId: number;
  status: 'available' | 'adopted' | 'in_care';
  createdAt: Date;
}

// 채팅방 타입 (chat_room 테이블 기반)
export interface ChatRoom {
  id: number;
  member1Id: number;
  member2Id: number;
  createdAt: Date;
}

// 채팅 메시지 타입 (chat_message 테이블 기반)
export interface ChatMessage {
  id: number;
  chatRoomId: number;
  senderId: number;
  message: string;
  sentAt: Date;
}

// 알림 타입 (notification 테이블 기반)
export interface Notification {
  id: number;
  memberId: number;
  adoptionId?: number;
  careId?: number;
  type: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
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