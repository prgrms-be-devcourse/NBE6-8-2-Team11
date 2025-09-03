// API 클라이언트 설정
// 팀원들의 기존 환경과 호환성을 위한 우선순위 설정
const API_BASE_URL = 
  process.env.NEXT_PUBLIC_API_URL ||  // 환경변수 우선
  'http://localhost:8080';             // Docker 환경 기본값

// 디버깅을 위한 로그
console.log('🔧 API_BASE_URL 설정:', {
  envValue: process.env.NEXT_PUBLIC_API_URL,
  finalValue: API_BASE_URL,
  hasEnv: !!process.env.NEXT_PUBLIC_API_URL
});

if (!API_BASE_URL) {
  throw new Error('API BASE URL이 설정되지 않았습니다!');
}

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
      normalizedEndpoint: normalizedEndpoint,
      envCheck: {
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
        NODE_ENV: process.env.NODE_ENV
      }
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
        
        // 서버가 보낸 에러 메시지를 읽는다.
        let errorMessage = `HTTP error! status: ${response.status} - ${response.statusText}`;
        
        try {
          const errorText = await response.text();
          console.log('🔍 Error Response Text:', errorText);
          
          if (errorText.trim()) {
            const errorData = JSON.parse(errorText);
            console.log('🔍 Parsed Error Data:', errorData);
            
            // 다양한 에러 메시지 필드 확인
            if (errorData.message) {
              errorMessage = errorData.message;
            } else if (errorData.error) {
              errorMessage = errorData.error;
            } else if (errorData.errorMessage) {
              errorMessage = errorData.errorMessage;
            } else if (errorData.detail) {
              errorMessage = errorData.detail;
            }
            
            // 백엔드 에러 코드에 따른 사용자 친화적 메시지
            if (errorData.code === 'AUTH-401') {
              // 인증 실패 시 서버 메시지 사용
              errorMessage = errorData.message;
            } else if (errorData.code === 'SERVER-500' && errorData.message === '서버 내부 오류가 발생하였습니다.') {
              // 로그인 실패 시 더 구체적인 메시지 제공
              if (url.includes('/auth/login')) {
                errorMessage = '이메일 또는 비밀번호가 올바르지 않습니다.';
              }
            }
            
            console.log('🔍 Final Error Message:', errorMessage);
          }
        } catch (jsonError) {
          console.log('🔍 JSON Parse Error:', jsonError);
          // JSON 파싱에 실패하면 기본 에러 메시지 사용
        }
        
        throw new Error(errorMessage);
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