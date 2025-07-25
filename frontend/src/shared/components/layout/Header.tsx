'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { NAV_ITEMS, BRAND_INFO } from '../../constants';

// 모의 로그인 상태 (실제로는 백엔드 API를 통해 관리)
const useAuth = () => {
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    // 현재 페이지가 프로필 페이지인지 확인
    const isProfilePage = pathname === '/profile';
    
    if (isProfilePage) {
      // 프로필 페이지에서는 로그인된 상태로 가정
      setUser({ name: '김동물' });
    } else {
      // 다른 페이지에서는 로그인하지 않은 상태로 가정
      setUser(null);
    }
    
    setIsLoading(false);
  }, [pathname]);

  return { user, isLoading };
};

export default function Header() {
  const { user, isLoading } = useAuth();

  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-orange-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">{BRAND_INFO.logo}</span>
            </div>
            <span className="text-xl font-bold text-gray-800">{BRAND_INFO.name}</span>
          </div>
          
          <nav className="hidden md:flex space-x-8">
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
          
          <div className="flex items-center space-x-4">
            {!isLoading && (
              <>
                {user ? (
                  // 로그인된 상태: 사용자 이름, 내 프로필, 로그아웃 버튼
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-700 font-medium">
                      {user.name} 님
                    </span>
                    <Link
                      href="/profile"
                      className="text-sm text-orange-600 hover:text-orange-700 font-medium transition-colors"
                    >
                      내 프로필
                    </Link>
                    <button className="text-sm text-gray-500 hover:text-gray-700 font-medium transition-colors">
                      로그아웃
                    </button>
                  </div>
                ) : (
                  // 로그인하지 않은 상태: 카카오 로그인 버튼
                  <button className="hover:opacity-80 transition-opacity">
                    <Image
                      src="/kakao_login_medium_narrow.png"
                      alt="카카오 로그인"
                      width={183}
                      height={45}
                      className="cursor-pointer"
                    />
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
} 