'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getUserInfoFromToken, type UserInfo } from '../shared/utils/jwt';

interface AuthContextType {
  isLoggedIn: boolean;
  userInfo: UserInfo | null;
  isLoading: boolean;
  login: (accessToken: string, refreshToken: string, userData?: UserInfo) => void;
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

    if (token) {
      try {
        // 토큰에서 사용자 정보 추출
        const extractedUserInfo = getUserInfoFromToken(token);
        if (extractedUserInfo) {
          setUserInfo(extractedUserInfo);
          setIsLoggedIn(true);
          // localStorage에 사용자 정보도 저장
          localStorage.setItem('userInfo', JSON.stringify(extractedUserInfo));
        } else {
          throw new Error('Invalid token');
        }
      } catch (e) {
        console.error("Failed to extract userInfo from token", e);
        // 토큰 오류 시 로그인 상태 초기화
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

  const login = (accessToken: string, refreshToken: string, userData?: UserInfo) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    
    try {
      // userData가 제공되면 사용하고, 그렇지 않으면 토큰에서 추출
      const userInfoToUse = userData || getUserInfoFromToken(accessToken);
      
      if (userInfoToUse) {
        localStorage.setItem('userInfo', JSON.stringify(userInfoToUse));
        setUserInfo(userInfoToUse);
        setIsLoggedIn(true);
        console.log('User info set:', userInfoToUse); // 디버깅용
      } else {
        console.error('Failed to get user info from token');
      }
    } catch (error) {
      console.error('Error in login function:', error);
    }
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