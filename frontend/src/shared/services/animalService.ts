import { apiClient } from './apiClient';
import { Animal } from '../types';

export interface GetAnimalsParams {
  page?: number;
  limit?: number;
  type?: string;
  size?: string;
  gender?: string;
}

export interface GetAnimalsResponse {
  animals: Animal[];
  total: number;
  page: number;
  limit: number;
}

export const animalService = {
  // 모든 동물 조회
  async getAnimals(params: GetAnimalsParams = {}): Promise<GetAnimalsResponse> {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.type) queryParams.append('type', params.type);
    if (params.size) queryParams.append('size', params.size);
    if (params.gender) queryParams.append('gender', params.gender);
    
    const queryString = queryParams.toString();
    const endpoint = `/animals${queryString ? `?${queryString}` : ''}`;
    
    const response = await apiClient.get<GetAnimalsResponse>(endpoint);
    return response.data;
  },

  // 특정 동물 조회
  async getAnimal(id: string): Promise<Animal> {
    const response = await apiClient.get<Animal>(`/animals/${id}`);
    return response.data;
  },

  // 동물 검색
  async searchAnimals(query: string): Promise<Animal[]> {
    const response = await apiClient.get<Animal[]>(`/animals/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  // 입양 신청
  async applyForAdoption(animalId: string, applicationData: any): Promise<any> {
    const response = await apiClient.post(`/animals/${animalId}/apply`, applicationData);
    return response.data;
  },
}; 