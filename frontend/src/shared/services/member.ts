import { apiClient } from './apiClient';

export interface User {
  id: number;
  email: string;
  name: string;
  phone?: string;
  role: string;
  address?: string;
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
    try {
      // 1. localStorage에서 사용자 정보 확인
      const userStr = localStorage.getItem('user');
      if (userStr) {
        return JSON.parse(userStr);
      }
      
      // 2. userInfo에서 사용자 ID 가져오기
      const userInfoStr = localStorage.getItem('userInfo');
      if (userInfoStr) {
        const userInfo = JSON.parse(userInfoStr);
        const response = await apiClient.get<User>(`/members/${userInfo.id}`);
        return response.content;
      }
      
      // 3. 로그인되지 않은 경우 빈 값 반환
      return {
        id: 0,
        email: '',
        name: '',
        phone: '',
        role: ''
      };
    } catch (error) {
      console.error('Failed to get current user:', error);
      return {
        id: 0,
        email: '',
        name: '',
        phone: '',
        role: ''
      };
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

  // 토큰 검증에 사용될 사용자 정보 조회
  async validateTokenAndGetCurrentUser(userId: number): Promise<User> {
    const response = await apiClient.get<User>(`/members/${userId}`);
    return response.content;
  },
}; 