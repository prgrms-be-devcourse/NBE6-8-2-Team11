import { memberService, User } from './member';

export async function getCurrentUser(): Promise<User | null> {
  if (typeof window !== 'undefined') {
    const userId = localStorage.getItem('userId');
    const userEmail = localStorage.getItem('userEmail');
    const userName = localStorage.getItem('userName');
    if (userId && userEmail && userName) {
      try {
        return {
          id: parseInt(userId, 10),
          email: userEmail,
          name: userName,
          phone: '',
          role: 'USER'
        };
      } catch (error) {
        console.error('Failed to parse user from localStorage:', error);
      }
    }
  }
  // 사용자 정보가 없으면 API에서 가져오기
  try {
    const user = await memberService.getCurrentUser();
    setCurrentUser(user);
    return user;
  } catch (error) {
    console.error('Failed to get current user:', error);
    return null;
  }
}

export async function getCurrentUserId(): Promise<number | null> {
  const user = await getCurrentUser();
  return user?.id || null;
}

export function getCurrentUserIdSync(): number {
  if (typeof window !== 'undefined') {
    const userId = localStorage.getItem('userId');
    if (userId) {
      try {
        return parseInt(userId, 10);
      } catch (error) {
        console.error('Failed to parse userId from localStorage:', error);
      }
    }
  }
  return 1; // 기본값
}

export async function initializeUserFromToken(): Promise<User | null> {
  try {
    const user = await memberService.getCurrentUser();
    setCurrentUser(user);
    return user;
  } catch (error) {
    console.error('Failed to initialize user from token:', error);
    return null;
  }
}

export function setCurrentUser(user: User): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('userId', user.id.toString());
    localStorage.setItem('userEmail', user.email);
    localStorage.setItem('userName', user.name);
  }
}

export function clearCurrentUser(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
  }
} 