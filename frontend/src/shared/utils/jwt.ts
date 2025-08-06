// JWT 토큰 디코딩 유틸리티

interface JWTPayload {
  id?: number;
  sub?: string;
  auth?: string;
  exp?: number;
  nickname?: string;
  email?: string;
  [key: string]: unknown;
}

export interface UserInfo {
  id?: number;
  sub?: string;
  auth: string;
  exp?: number;
  nickname?: string;
  email?: string;
}

export function decodeJWT(token: string): JWTPayload | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    return JSON.parse(jsonPayload) as JWTPayload;
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return null;
  }
}

// JWT 토큰에서 사용자 정보 추출
export function getUserInfoFromToken(token: string): UserInfo | null {
  const payload = decodeJWT(token);
  if (!payload) return null;
  
  console.log('JWT payload:', payload); // 디버깅용 - 실제 JWT 페이로드 확인
  
  return {
    id: payload.id,
    sub: payload.sub,
    auth: payload.auth || 'ROLE_USER',
    exp: payload.exp,
    nickname: payload.nickname,
    email: payload.email,
  };
}
