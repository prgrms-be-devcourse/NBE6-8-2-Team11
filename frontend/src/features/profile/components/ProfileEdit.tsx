'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { User } from '../types';
import { apiClient } from '../../../shared/services/apiClient';

interface ProfileEditProps {
  user: User | null;
  setUser: (user: User | null) => void;
}

// 1. 백엔드 MemberResponseDto에 해당하는 타입 정의
interface MemberData {
  memberId: number;
  email: string;
  name: string;
  phone: string;
  address?: string;
  bio?: string;
}

// 2. 백엔드 API 응답 전체에 대한 타입 정의
interface UpdateProfileResponse {
  success: boolean;
  code: string;
  message: string;
  content: MemberData;
}

export default function ProfileEdit({ user, setUser }: ProfileEditProps) {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    bio: user?.bio || ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        throw new Error('사용자 ID를 찾을 수 없습니다.');
      }

      console.log('프로필 수정 요청:', { userId, formData });

      // 3. apiClient.put 호출 시 응답 타입을 <UpdateProfileResponse>로 명시
      const response = await apiClient.put<UpdateProfileResponse>(`/members/${userId}`, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        bio: formData.bio
      });

      console.log('프로필 수정 응답:', response);

      if (response.success && response.content) {
        // 성공 시 로컬 상태 업데이트
        const updatedUser: User = {
          ...user,
          name: response.content.name,
          email: response.content.email,
          phone: response.content.phone,
          address: response.content.address || '',
          bio: response.content.bio || ''
        };
        
        setUser(updatedUser);
        setSuccess('프로필이 성공적으로 수정되었습니다.');
        
        // localStorage의 사용자 정보도 업데이트
        localStorage.setItem('userName', response.content.name);
        localStorage.setItem('userEmail', response.content.email);
      } else {
        throw new Error(response.message || '프로필 수정에 실패했습니다.');
      }
    } catch (err) {
      console.error('프로필 수정 실패:', err);
      setError((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">사용자 정보를 불러올 수 없습니다.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</div>}
      {success && <div className="text-sm text-green-600 bg-green-50 p-3 rounded-md">{success}</div>}

      {/* 기본 정보 */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">기본 정보</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              이름 *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              이메일 *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              전화번호 *
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
              주소 *
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
            자기소개
          </label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            placeholder="자신에 대해 소개해주세요..."
          />
        </div>
      </div>

      {/* 제출 버튼 */}
      <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={() => {
            setFormData({
              name: user.name,
              email: user.email,
              phone: user.phone,
              address: user.address,
              bio: user.bio || ''
            });
            setError('');
            setSuccess('');
          }}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          취소
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? '저장 중...' : '저장'}
        </button>
      </div>
    </form>
  );
} 