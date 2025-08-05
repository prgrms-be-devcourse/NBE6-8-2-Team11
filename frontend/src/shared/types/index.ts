// 동물 정보 타입 (pet 테이블 기반)
export interface Pet {
  id: number;
  petOwnerId: number; // 보호소 ID 또는 사용자 ID
  name: string;
  species: string; // dog, cat, rabbit, bird, other
  age: number;
  gender: 'MALE' | 'FEMALE' | 'UNKNOWN' | 'NEUTERED_MALE' | 'NEUTERED_FEMALE';
  description: string;
  imageUrl?: string;
  createdAt: Date;
  shelterName?: string; // Backend DTO에서 제공하는 보호소 이름
  petStatuses?: string[]; // 백엔드에서 제공하는 상태 목록
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
  role: 'USER' | 'ADMIN';
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
  status: PetStatusType;
  createdAt: Date;
}

// 동물 상태 enum (백엔드 PetStatusType과 일치)
export type PetStatusType = 
  | 'AVAILABLE_FOR_ADOPTION' 
  | 'AVAILABLE_FOR_CARE' 
  | 'AVAILABLE_BOTH'
  | 'ADOPTED' 
  | 'CARE_IN_PROGRESS' 
  | 'CARE_COMPLETED';

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