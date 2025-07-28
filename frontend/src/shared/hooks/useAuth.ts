'use client';

import { useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      // 토큰이 있으면 사용자 정보를 가져오는 로직
      // 여기서는 간단히 토큰 존재 여부만 확인
      setUser({
        id: '1',
        email: 'user@example.com',
        name: '사용자'
      });
    }
    setIsLoading(false);
  }, []);

  const login = (accessToken: string, refreshToken: string) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    setUser({
      id: '1',
      email: 'user@example.com',
      name: '사용자'
    });
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
  };

  return {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user
  };
}; 