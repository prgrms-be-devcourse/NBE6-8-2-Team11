import { apiClient } from './apiClient';
import { Member } from '../types';

export const memberService = {
  // 현재 로그인한 사용자 정보 조회
  async getCurrentUser(): Promise<Member> {
    const response = await apiClient.get<Member>('/api/members/me');
    return response.content;
  },

  // 회원 정보 조회
  async getMember(memberId: string): Promise<Member> {
    const response = await apiClient.get<Member>(`/api/members/${memberId}`);
    return response.content;
  },

  // 회원 정보 수정
  async updateMember(memberId: string, memberData: Partial<Member>): Promise<Member> {
    const response = await apiClient.put<Member>(`/api/members/${memberId}`, memberData);
    return response.content;
  },
}; 