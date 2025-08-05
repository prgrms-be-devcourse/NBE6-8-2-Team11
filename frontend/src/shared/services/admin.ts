import { apiClient } from './apiClient';
import { Pet, Member } from '../types';

// 펫 등록 요청 인터페이스
export interface CreatePetRequest {
  name: string;
  species: string;
  age: number;
  gender: 'MALE' | 'FEMALE';
  description: string;
  imageUrl?: string;
  shelterName?: string;
  statuses: string[];
}

// 펫 수정 요청 인터페이스
export interface UpdatePetRequest {
  name: string;
  species: string;
  age: number;
  gender: 'MALE' | 'FEMALE';
  description: string;
  imageUrl?: string;
  shelterName?: string;
  statuses: string[];
}

export const adminService = {
  // ===== 회원 관리 =====
  
  // 전체 회원 목록 조회
  async getMembers(): Promise<Member[]> {
    try {
      const response = await apiClient.get<Member[]>('/admin/members');
      if (response.success) {
        return response.content;
      } else {
        console.error('회원 목록 조회 실패:', response.message);
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('회원 목록 조회 실패:', error);
      throw error;
    }
  },

  // 특정 회원 정보 조회
  async getMemberById(memberId: string): Promise<Member> {
    try {
      const response = await apiClient.get<Member>(`/admin/members/${memberId}`);
      if (response.success) {
        return response.content;
      } else {
        console.error('회원 정보 조회 실패:', response.message);
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('회원 정보 조회 실패:', error);
      throw error;
    }
  },

  // 특정 회원 삭제 및 강제 탈퇴
  async deleteMember(memberId: string): Promise<void> {
    try {
      const response = await apiClient.delete<void>(`/admin/members/${memberId}`);
      if (response.success) {
        return;
      } else {
        console.error('회원 삭제 실패:', response.message);
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('회원 삭제 실패:', error);
      throw error;
    }
  },

  // ===== 펫 관리 =====

  // 관리자 펫 등록
  async createPet(petData: CreatePetRequest): Promise<Pet> {
    try {
      const response = await apiClient.post<Pet>('/admin/pets', petData);
      if (response.success) {
        return response.content;
      } else {
        console.error('펫 등록 실패:', response.message);
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('펫 등록 실패:', error);
      throw error;
    }
  },

  // 전체 펫 목록 조회
  async getPets(): Promise<Pet[]> {
    try {
      const response = await apiClient.get<Pet[]>('/admin/pets');
      if (response.success) {
        return response.content;
      } else {
        console.error('펫 목록 조회 실패:', response.message);
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('펫 목록 조회 실패:', error);
      throw error;
    }
  },

  // 특정 펫 정보 조회
  async getPetById(petId: string): Promise<Pet> {
    try {
      const response = await apiClient.get<Pet>(`/admin/pets/${petId}`);
      if (response.success) {
        return response.content;
      } else {
        console.error('펫 정보 조회 실패:', response.message);
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('펫 정보 조회 실패:', error);
      throw error;
    }
  },

  // 펫 정보 수정
  async updatePet(petId: string, petData: UpdatePetRequest): Promise<Pet> {
    try {
      const response = await apiClient.put<Pet>(`/admin/pets/${petId}`, petData);
      if (response.success) {
        return response.content;
      } else {
        console.error('펫 수정 실패:', response.message);
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('펫 수정 실패:', error);
      throw error;
    }
  },

  // 펫 삭제
  async deletePet(petId: string): Promise<void> {
    try {
      const response = await apiClient.delete<void>(`/admin/pets/${petId}`);
      if (response.success) {
        return;
      } else {
        console.error('펫 삭제 실패:', response.message);
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('펫 삭제 실패:', error);
      throw error;
    }
  },
};

