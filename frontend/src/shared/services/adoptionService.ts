import { apiClient } from './apiClient';

// 타입 정의
export interface AdoptionApplication {
  id: string;
  title: string;
  type: 'ADOPTION' | 'CARE';
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
}

export interface AdoptionApplicationDetail extends AdoptionApplication {
  memberName: string;
  memberPhone: string;
  memberEmail: string;
  memberAddress: string;
  anotherPets: string;
  experience: string;
  message: string;
  petInfo: {
    id: string;
    name: string;
    species: string;
    age: number;
    gender: string;
    imageUrl: string;
    shelterName?: string;
  };
  desiredStartDate?: string; // Care인 경우에만
  desiredEndDate?: string;   // Care인 경우에만
}

export interface CreateAdoptionRequest {
  petId: string;
  title: string;
  anotherPets: string;
  experience: string;
  message: string;
}

export interface CreateCareRequest {
  petId: string;
  title: string;
  message: string;
  anotherPets: string;
  experience: string;
  desiredStartDate: Date;
  desiredEndDate: Date;
}

export interface UpdateAdoptionStatusRequest {
  status: 'ACCEPTED' | 'REJECTED';
}

export const adoptionService = {
  // 입양 신청
  async createAdoption(applicationData: CreateAdoptionRequest): Promise<AdoptionApplication> {
    const response = await apiClient.post<AdoptionApplication>('/api/applies/adoption', applicationData);
    return response.content;
  },

  // 돌봄 신청 -> 해당 컨트롤러는 분리되어 있음
  // 기능 확장시 careService.ts 로 분리 예정
  async createCare(applicationData: CreateCareRequest): Promise<AdoptionApplication> {
    const response = await apiClient.post<AdoptionApplication>('/api/applies/care', applicationData);
    return response.content;
  },

  // 회원 입양/돌봄 신청 목록 조회
  async getAdoptionApplications(): Promise<AdoptionApplication[]> {
    const response = await apiClient.get<AdoptionApplication[]>('/api/applies');
    return response.content;
  },

  // 회원 입양/돌봄 신청 내역 상세 조회
  async getAdoptionApplicationDetail(typeId: string, type: string): Promise<AdoptionApplicationDetail> {
    const response = await apiClient.get<AdoptionApplicationDetail>(`/api/applies/detail?typeId=${typeId}&type=${type}`);
    return response.content;
  },

  // 회원 입양/돌봄 신청 내역 단건 취소(삭제)
  async deleteAdoptionApplication(typeId: string, type: string): Promise<void> {
    await apiClient.delete(`/api/applies?typeId=${typeId}&type=${type}`);
  },

  // 회원 입양/돌봄 신청 내역 전체 취소(삭제)
  async deleteAllAdoptionApplications(): Promise<void> {
    await apiClient.delete('/api/applies/all');
  },

  // 보호자가 받은 입양/돌봄 신청 내역 리스트 조회
  async getReceivedApplications(): Promise<AdoptionApplication[]> {
    const response = await apiClient.get<AdoptionApplication[]>('/api/applies/received');
    return response.content;
  },

  // 보호자가 받은 입양/돌봄 신청 내역 상세 조회
  async getReceivedApplicationDetail(typeId: string, type: string): Promise<AdoptionApplicationDetail> {
    const response = await apiClient.get<AdoptionApplicationDetail>(`/api/applies/received/detail?typeId=${typeId}&type=${type}`);
    return response.content;
  },

  // 보호자가 받은 입양/돌봄 신청 내역 상태 변경 - 수락/거절
  async updateAdoptionStatus(typeId: string, type: string, statusData: UpdateAdoptionStatusRequest): Promise<AdoptionApplication> {
    const requestData = {
      id: parseInt(typeId),
      type: type,
      status: statusData.status
    };
    const response = await apiClient.put<AdoptionApplication>('/applies/received', requestData);
    return response.content;
  },

  // 보호자가 받은 입양/돌봄 등록 내역 단건 취소(삭제)
  async deleteReceivedApplication(applicationId: string): Promise<void> {
    await apiClient.delete(`/api/applies/received?id=${applicationId}`);
  },

  // 보호자가 받은 입양/돌봄 등록 내역 전체 취소(삭제)
  async deleteAllReceivedApplications(): Promise<void> {
    await apiClient.delete('/api/applies/received/all');
  },
}; 