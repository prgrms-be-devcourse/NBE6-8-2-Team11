'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { NAV_ITEMS, BRAND_INFO } from '../../constants';
import { useNotificationStore } from '../common/notify/NotificationStore';
import NotificationDropdown from '../common/notify/NotificationDropdown';
import { wsClient } from '../../lib/websocket';
import { useAuth } from '../../../context/AuthContext'; // 전역 AuthContext의 useAuth 훅 임포트

export default function Header() {
  // 이제 Header 컴포넌트 내부의 로컬 useAuth 훅 정의는 삭제되었습니다.
  // 전역 AuthContext에서 제공하는 상태와 함수를 사용합니다.
  const { isLoggedIn, userInfo, logout } = useAuth();
  const router = useRouter(); // useRouter 훅 초기화
  const pathname = usePathname(); // usePathname 훅 초기화
  const { unreadCount, addNotification } = useNotificationStore();
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout(); // AuthContext의 logout 함수 호출
    router.push('/'); // 로그아웃 후 메인 페이지로 리다이렉트
  };
   
  // 알림 버튼 클릭 핸들러
  const handleNotificationClick = () => {
    setIsNotificationDropdownOpen(!isNotificationDropdownOpen);
  };

  // 웹소켓 연결 상태 확인
  useEffect(() => {
    const checkConnection = () => {
      wsClient.getConnectionStatus();
    };

    // 초기 상태 확인
    checkConnection();

    // 1초마다 연결 상태 확인
    const interval = setInterval(checkConnection, 1000);

    return () => clearInterval(interval);
  }, []);

  // userInfo.auth 문자열에 'ADMIN'이 포함되어 있는지 확인
  const isAdmin = userInfo?.auth?.includes('ADMIN');

  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-orange-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
         <Link href="/">
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
         </Link>
          
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
            
            {/* ▼▼▼▼▼ 변경된 부분 ▼▼▼▼▼ */}
            {/* 로그인 상태(isLoggedIn)가 true일 때만 '펫 등록하기' 링크가 보이도록 한다. */}
            {isLoggedIn && (
              <Link
                href="/pets/register"
                className="font-semibold text-orange-600 hover:text-orange-500 transition-colors"
              >
                펫 등록하기
              </Link>
            )}
            {/* ▲▲▲▲▲ 여기까지 변경 ▲▲▲▲▲ */}
          </nav>

          {/* 오른쪽: 사용자 메뉴 */}
          <div className="flex items-center space-x-4">
            {/* isLoading 상태는 이제 AuthContext에서 관리하므로, 직접 확인할 필요가 없습니다.
                AuthContext의 useEffect에서 초기 로딩이 완료된 후 상태가 설정됩니다. */}
            <>
              {isLoggedIn ? (
                // 로그인된 상태: 실제 사용자 이름, 알림 버튼, 채팅 버튼, 내 프로필, 로그아웃 버튼
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-700 font-medium">
                    {/* userInfo가 있을 때 nickname 또는 email, 없으면 '사용자'로 표시 */}
                    {userInfo?.nickname || userInfo?.email || '사용자'} 님
                  </span>

                {/* 알림 버튼 */}
                <div className="relative">
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
                        strokeWidth={1.5}
                        d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z"
                      />
                    </svg>
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-xs text-white font-medium">
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                      </span>
                    )}
                  </button>

                  
                  {/* 알림 드롭다운 */}
                  <NotificationDropdown
                    isOpen={isNotificationDropdownOpen}
                    onClose={() => setIsNotificationDropdownOpen(false)}
                  />
                </div>


                  {/* 채팅 버튼 */}
                  <Link
                    href="/allchat"
                    className="relative p-2 text-gray-600 hover:text-orange-500 transition-colors"
                    title="채팅"
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
                        strokeWidth={1.5}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>

                  {/* 새 메시지 표시 배지 (새 메시지가 있을 때만 표시) */}
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full opacity-0">
                    {/* 추후 새 메시지 개수에 따라 표시 */}
                  </span>
                </Link>
                
                  {/* 관리자일 경우 관리자 페이지 링크 표시 */}
                {isAdmin && (
                    <Link
                      href="/admin"
                      className={`text-sm font-medium transition-colors ${
                        pathname === '/admin'
                          ? 'text-red-600'
                          : 'text-gray-700 hover:text-red-500'
                      }`}
                    >
                      관리자
                    </Link>
                  )}

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
                    onClick={handleLogout} // `handleLogout` 사용
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
          </div>
        </div>
      </div>
    </header>
  );
}