import { apiClient } from './apiClient';

export interface User {
  id: number;
  email: string;
  name: string;
  phone?: string;
  role: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  userId: number;
  userEmail: string;
  userName: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  name: string;
  phone: string;
}

export const memberService = {
  // 로그인
  async login(request: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/auth/login', request);
    // 백엔드 응답 구조: { success: boolean, content: LoginResponse, message: string }
    return response.content;
  },

  // 회원가입
  async signup(request: SignupRequest): Promise<void> {
    await apiClient.post<void>('/auth/join', request);
  },

  // 현재 사용자 정보 조회 (저장된 사용자 정보 사용)
  async getCurrentUser(): Promise<User> {
    console.log('🔍 [DEBUG] memberService.getCurrentUser() 시작');
    
    try {
      // localStorage에서 사용자 정보 가져오기
      const userStr = localStorage.getItem('user');
      console.log('🔍 [DEBUG] localStorage.getItem("user"):', userStr);
      
      if (userStr) {
        const user = JSON.parse(userStr);
        console.log('🔍 [DEBUG] localStorage에서 파싱된 사용자:', user);
        return user;
      }
      
      console.log('🔍 [DEBUG] localStorage에 사용자 정보 없음, API 호출');
      // localStorage에 없으면 API에서 가져오기 (fallback)
      const response = await apiClient.get<User>('/members/1');
      console.log('🔍 [DEBUG] API 응답:', response);
      return response.content;
    } catch (error) {
      console.error('❌ [DEBUG] getCurrentUser 실패:', error);
      // 기본 사용자 정보 반환
      const defaultUser = {
        id: 1,
        email: 'user@example.com',
        name: '사용자',
        phone: '',
        role: 'USER'
      };
      console.log('🔍 [DEBUG] 기본 사용자 정보 반환:', defaultUser);
      return defaultUser;
    }
  },

  // 사용자 ID로 사용자 정보 조회
  async getUserById(userId: number): Promise<User> {
    try {
      const response = await apiClient.get<User>(`/members/${userId}`);
      return response.content;
    } catch (error) {
      console.error('Failed to get user by ID:', error);
      // 기본 사용자 정보 반환
      return {
        id: userId,
        email: `user${userId}@example.com`,
        name: `사용자 ${userId}`,
        phone: '',
        role: 'USER'
      };
    }
  },
}; 