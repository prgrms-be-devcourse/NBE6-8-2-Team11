'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { NAV_ITEMS, BRAND_INFO } from '../../constants';

// 실제 토큰 기반 로그인 상태 관리
const useAuth = () => {
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // localStorage에서 토큰 확인
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (accessToken && refreshToken) {
      // 토큰이 있으면 로그인된 상태로 설정
      // 실제로는 토큰을 디코드하여 사용자 정보를 가져와야 하지만,
      // 여기서는 간단히 토큰 존재 여부만 확인
      setUser({ name: '사용자' });
    } else {
      // 토큰이 없으면 로그인하지 않은 상태
      setUser(null);
    }
    
    setIsLoading(false);
  }, []);

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
  };

  return { user, isLoading, logout };
};

export default function Header() {
  const { user, isLoading, logout } = useAuth();
  const pathname = usePathname();

  const handleNotificationClick = () => {
    // 알림 기능은 추후 구현
    console.log('알림 버튼 클릭됨');
  };

  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-orange-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center">
              <Image
                src="/DolBomZ4.jpg"
                alt="DolBömZ 로고"
                width={32}
                height={32}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-xl font-bold text-gray-800">{BRAND_INFO.name}</span>
          </div>
          
          {/* 가운데: 네비게이션 (항상 중앙 고정) */}
          <nav className="hidden md:flex space-x-8 absolute left-1/2 transform -translate-x-1/2">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-700 hover:text-orange-500 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          
          {/* 오른쪽: 사용자 메뉴 */}
          <div className="flex items-center space-x-4">
            {!isLoading && (
              <>
                {user ? (
                  // 로그인된 상태: 사용자 이름, 알림, 내 프로필, 로그아웃 버튼
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-700 font-medium">
                      {user.name} 님
                    </span>
                    
                    {/* 알림 버튼 */}
                    <button
                      onClick={handleNotificationClick}
                      className="relative p-2 text-gray-600 hover:text-orange-500 transition-colors"
                      title="알림"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5} // 버튼 두께 조정
                          d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z"
                        />
                      </svg>
                      
                      {/* 알림 표시 배지 (새 알림이 있을 때만 표시) */}
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full opacity-0">
                        {/* 추후 알림 개수에 따라 표시 */}
                      </span>
                    </button>
                    
                    <Link
                      href="/profile"
                      className={`text-sm font-medium transition-colors ${
                        pathname === '/profile'
                          ? 'text-orange-600'
                          : 'text-gray-700 hover:text-orange-500'
                      }`}
                    >
                      내 프로필
                    </Link>
                    <button 
                      onClick={logout}
                      className="text-sm text-gray-500 hover:text-gray-700 font-medium transition-colors"
                    >
                      로그아웃
                    </button>
                  </div>
                ) : (
                  // 로그인하지 않은 상태: 로그인 버튼
                  <Link
                    href="/login"
                    className={`px-4 py-2 rounded-full font-semibold text-sm transition-all duration-200 ${
                      pathname === '/login'
                        ? 'bg-orange-500 text-white shadow-md'
                        : 'bg-orange-100 text-orange-600 hover:bg-orange-200 hover:shadow-md hover:scale-105'
                    }`}
                  >
                    로그인
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
} 