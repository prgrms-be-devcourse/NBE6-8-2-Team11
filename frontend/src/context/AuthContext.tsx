'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getUserInfoFromToken, type UserInfo } from '../shared/utils/jwt';
import { memberService } from '../shared/services/member';

interface AuthContextType {
  isLoggedIn: boolean;
  userInfo: UserInfo | null;
  isLoading: boolean;
  login: (accessToken: string, refreshToken: string, userData?: UserInfo) => void;
  logout: () => void;
  deleteAccount: () => Promise<void>;
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
    const validateTokenOnLoad = async () => {
      const token = localStorage.getItem('accessToken');
      const storedUserInfo = localStorage.getItem('userInfo');

    if (token && storedUserInfo) {
      try {
        // 토큰에서 사용자 정보 추출
        const parsedUserInfo = JSON.parse(storedUserInfo) as UserInfo;
        const userId = parsedUserInfo.id;

        if (!userId) {
          throw new Error('User ID not found in stored info.');
        }
        const user = await memberService.validateTokenAndGetCurrentUser(userId);

        if (user) {
          const combinedUserInfo = { ...parsedUserInfo, nickname: user.name, email: user.email };
          setUserInfo(combinedUserInfo);
          setIsLoggedIn(true);
          localStorage.setItem('userInfo', JSON.stringify(combinedUserInfo));
        } else {
          throw new Error('User not found from API');
        }
      } catch (e) {
        console.error("Token validation failed", e);
        // 토큰 오류 시 로그인 상태 초기화
        localStorage.clear();
        setIsLoggedIn(false);
        setUserInfo(null);
      }
    }

    validateTokenOnLoad();
  };

  },[]); // 빈 배열: 컴포넌트 마운트 시 한 번만 실행

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

  const deleteAccount = async () => {
    if (!userInfo?.id) {
      throw new Error('사용자 정보가 없습니다.');
    }
    
    try {
      await memberService.deleteAccount(userInfo.id);
      // 계정 삭제 성공 시 로그아웃 처리
      logout();
    } catch (error) {
      console.error('계정 삭제 실패:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userInfo, isLoading, login, logout, deleteAccount }}>
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