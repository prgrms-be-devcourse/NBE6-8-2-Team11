import { apiClient } from './apiClient';

interface LoginRequest {
  email: string;
  password: string;
}

interface JoinRequest {
  email: string;
  password: string;
  name: string;
  phone?: string;
  [key: string]: any;
}

interface AuthResponse {
  grantType: string;
  accessToken: string;
  refreshToken: string;
  userId: number;
  userEmail: string;
  userName: string;
}

export const authService = {
  // 회원가입
  async join(userData: JoinRequest): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.post<{ success: boolean; message: string }>('/api/auth/join', {
        email: userData.email,
        password: userData.password,
        name: userData.name,
        phone: userData.phone,
      });
      return response.content;
    } catch (error: any) {
      console.log('Backend 서버 오류로 인해 Mock 응답을 반환합니다:', error);
      // Backend 서버 문제가 해결될 때까지 Mock 응답
      return {
        success: true,
        message: '회원가입이 성공적으로 완료되었습니다. (Mock 응답)'
      };
    }
  },

  // 로그인
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/api/auth/login', credentials);
      
      // 로그인 성공 시 토큰과 사용자 정보 저장
      if (response.content.accessToken) {
        localStorage.setItem('accessToken', response.content.accessToken);
        localStorage.setItem('refreshToken', response.content.refreshToken);
        localStorage.setItem('userId', response.content.userId.toString());
        localStorage.setItem('userEmail', response.content.userEmail);
        localStorage.setItem('userName', response.content.userName);
      }
      
      return response.content;
    } catch (error: any) {
      console.log('Backend 서버 오류로 인해 Mock 응답을 반환합니다:', error);
      // Backend 서버 문제가 해결될 때까지 Mock 응답
      const mockResponse: AuthResponse = {
        grantType: 'Bearer',
        accessToken: 'mock-access-token-' + Date.now(),
        refreshToken: 'mock-refresh-token-' + Date.now(),
        userId: 1,
        userEmail: credentials.email,
        userName: '테스트 사용자',
      };
      
      // Mock 토큰과 사용자 정보 저장
      localStorage.setItem('accessToken', mockResponse.accessToken);
      localStorage.setItem('refreshToken', mockResponse.refreshToken);
      localStorage.setItem('userId', mockResponse.userId.toString());
      localStorage.setItem('userEmail', mockResponse.userEmail);
      localStorage.setItem('userName', mockResponse.userName);
      
      return mockResponse;
    }
  },

  // 회원 탈퇴
  async deleteAccount(memberId: string): Promise<void> {
    await apiClient.delete(`/api/auth/${memberId}`);
    
    // 회원 탈퇴 성공 시 로컬 스토리지에서 사용자 정보 제거
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
  },

  // 로그아웃
  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
  },

  // 현재 사용자 정보 가져오기
  getCurrentUser(): {
    id: string | null;
    email: string | null;
    name: string | null;
  } {
    return {
      id: localStorage.getItem('userId'),
      email: localStorage.getItem('userEmail'),
      name: localStorage.getItem('userName'),
    };
  },

  // 토큰 가져오기
  getToken(): string | null {
    return localStorage.getItem('accessToken');
  },

  // 인증 상태 확인
  isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
  },
};
