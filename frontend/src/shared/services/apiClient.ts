// API 클라이언트 설정
// 팀원들의 기존 환경과 호환성을 위한 우선순위 설정
const API_BASE_URL = 
  process.env.NEXT_PUBLIC_API_URL ||  // 환경변수 우선
  'http://localhost:8080';             // Docker 환경 기본값

interface ApiResponse<T> {
  content: T;
  message: string;
  success: boolean;
  code: string;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('accessToken');
    console.log('🔑 Auth Token Check:', {
      hasToken: !!token,
      tokenLength: token ? token.length : 0,
      tokenPreview: token ? `${token.substring(0, 20)}...` : 'none'
    });
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    // 엔드포인트가 이미 /api로 시작하는지 확인
    const normalizedEndpoint = endpoint.startsWith('/api') ? endpoint : `/api${endpoint}`;
    const url = `${this.baseURL}${normalizedEndpoint}`;
    
    console.log('🌐 API Request:', {
      method: options.method || 'GET',
      url: url,
      baseURL: this.baseURL,
      endpoint: endpoint,
      normalizedEndpoint: normalizedEndpoint
    });
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
        ...options.headers,
      },
      // CORS 문제 해결을 위해 credentials 제거
      // credentials: 'include', 
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        console.error('❌ API Error:', {
          status: response.status,
          statusText: response.statusText,
          url: url
        });
        
        // 401 Unauthorized 에러 처리
        if (response.status === 401) {
          // 토큰이 만료되었거나 유효하지 않은 경우
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('userId');
          localStorage.removeItem('userEmail');
          localStorage.removeItem('userName');
          
          // 로그인 페이지로 리다이렉트
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        }
        throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
      }
      
      // 응답이 비어있는지 확인
      const responseText = await response.text();
      
      // 응답이 비어있으면 빈 객체 반환
      if (!responseText.trim()) {
        console.log('✅ API Success (Empty Response):', url);
        return {
          content: undefined as T,
          message: 'Success',
          success: true,
          code: '200'
        };
      }
      
      // JSON 파싱
      const data = JSON.parse(responseText);
      console.log('✅ API Success:', { url: url, data: data });
      return data;
    } catch (error) {
      console.error('🚨 API Request Failed:', {
        url: url,
        error: error,
        message: error instanceof Error ? error.message : 'Unknown error'
      });
      
      // Network error에 대한 더 구체적인 메시지
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new Error(`서버에 연결할 수 없습니다. 백엔드 서버(${this.baseURL})가 실행 중인지 확인해주세요.`);
      }
      
      throw error;
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);