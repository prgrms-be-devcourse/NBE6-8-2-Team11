import { apiClient } from './apiClient';
import { Pet } from '../types';

export const petService = {
  // 모든 동물 조회
  async getPets(): Promise<Pet[]> {
    const response = await apiClient.get<Pet[]>('/api/pets');
    return response.data;
  },

  // 특정 동물 조회
  async getPet(petId: string): Promise<Pet> {
    const response = await apiClient.get<Pet>(`/api/pets/${petId}`);
    return response.data;
  },

  // 동물 생성
  async createPet(petData: Omit<Pet, 'id'>): Promise<Pet> {
    const response = await apiClient.post<Pet>('/api/pets', petData);
    return response.data;
  },

  // 특정 동물 정보 수정
  async updatePet(petId: string, petData: Partial<Pet>): Promise<Pet> {
    const response = await apiClient.put<Pet>(`/api/pets/${petId}`, petData);
    return response.data;
  },

  // 특정 동물 삭제
  async deletePet(petId: string): Promise<void> {
    await apiClient.delete(`/api/pets/${petId}`);
  },
}; 