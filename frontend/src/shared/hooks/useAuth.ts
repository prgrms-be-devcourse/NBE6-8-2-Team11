'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';

interface User {
  id: number;
  email: string;
  name: string;
}

interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  // 페이지 로드 시 localStorage에서 로그인 정보 확인
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const userName = localStorage.getItem('userName');
    const userId = localStorage.getItem('userId');
    const userEmail = localStorage.getItem('userEmail');

    if (accessToken && userName && userId && userEmail) {
      setUser({
        id: parseInt(userId, 10),
        name: userName,
        email: userEmail,
      });
    } else {
      setUser(null);
    }
    setIsLoading(false);
  }, [pathname]);

  // 로그인 함수: 사용자 정보와 토큰을 받아 저장
  const login = useCallback((userData: User, tokens: Tokens) => {
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
    localStorage.setItem('userId', userData.id.toString());
    localStorage.setItem('userEmail', userData.email);
    localStorage.setItem('userName', userData.name);
    setUser(userData);
  }, []);

  // 로그아웃 함수
  const logout = useCallback(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    setUser(null);
    router.push('/');
  }, [router]);

  return {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user
  };
}; 