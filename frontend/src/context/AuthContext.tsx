'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface UserInfo {
  id?: number;
  sub: string;
  auth: 'ROLE_USER' | 'ROLE_ADMIN';
  exp: number;
  nickname?: string;
  email?: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  userInfo: UserInfo | null;
  isLoading: boolean;
  login: (accessToken: string, refreshToken: string, userData: UserInfo) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 컴포넌트 마운트 시 localStorage에서 정보 로드
    const token = localStorage.getItem('accessToken');
    const storedUserInfo = localStorage.getItem('userInfo');

    if (token && storedUserInfo) {
      try {
        setUserInfo(JSON.parse(storedUserInfo));
        setIsLoggedIn(true);
      } catch (e) {
        console.error("Failed to parse userInfo from localStorage", e);
        // 파싱 오류 시 로그인 상태 초기화
        localStorage.clear();
        setIsLoggedIn(false);
        setUserInfo(null);
      }
    } else {
      setIsLoggedIn(false);
      setUserInfo(null);
    }
    setIsLoading(false);
  }, []); // 빈 배열: 컴포넌트 마운트 시 한 번만 실행

  const login = (accessToken: string, refreshToken: string, userData: UserInfo) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('userInfo', JSON.stringify(userData));
    setUserInfo(userData);
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.clear(); // 모든 저장된 토큰 및 정보 삭제
    setIsLoggedIn(false);
    setUserInfo(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userInfo, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}