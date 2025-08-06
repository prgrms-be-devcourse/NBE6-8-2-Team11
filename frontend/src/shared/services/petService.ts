import { apiClient } from './apiClient';
// ▼▼▼ 1. 변경된 부분: PetUpdateRequestDto 타입을 추가로 import 한다. ▼▼▼
import { Pet } from '../types';
import { PetCreateRequestDto, PetUpdateRequestDto } from '../types'; // PetUpdateRequestDto 추가

export const petService = {
  // 모든 동물 조회
  async getPets(): Promise<Pet[]> {
    const response = await apiClient.get<Pet[]>('/pets');
    return response.content;
  },

  // 특정 동물 조회
  async getPet(petId: string): Promise<Pet> {
    const response = await apiClient.get<Pet>(`/pets/${petId}`);
    return response.content;
  },

  // ▼▼▼ 2. 변경된 부분: 함수의 파라미터 타입을 수정했다. ▼▼▼
  /**
   * 새로운 펫 정보를 서버에 등록한다.
   * @param petData - 사용자가 폼에 입력한 펫 정보 (PetCreateRequestDto)
   * @returns 생성된 펫 정보 (Pet)
   */
  async createPet(petData: PetCreateRequestDto): Promise<Pet> {
    const response = await apiClient.post<Pet>('/pets', petData);
    return response.content;
  },
  // ▲▲▲▲▲ 여기까지 수정 ▲▲▲▲▲

  // 특정 동물 정보 수정
  async updatePet(petId: string, petData: PetUpdateRequestDto): Promise<Pet> {
    const response = await apiClient.put<Pet>(`/pets/${petId}`, petData);
    return response.content;
  },

  // 특정 동물 삭제
  async deletePet(petId: string): Promise<void> {
    await apiClient.delete(`/pets/${petId}`);
  },
};