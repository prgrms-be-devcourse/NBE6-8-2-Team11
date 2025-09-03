'use client';

import { useState, useEffect, FormEvent } from 'react';
import { User } from '../types';
import { useMemberType } from '../../../context/MemberTypeContext';

interface ProfileEditProps {
  user: User | null;
  setUser: (user: User | null) => void;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  bio: string;
  memberType: 'adopter' | 'shelter';
}

export default function ProfileEdit({ user, setUser }: ProfileEditProps) {
  const { setMemberType: setGlobalMemberType } = useMemberType();

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    bio: '',
    memberType: 'adopter'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name ?? '',
        email: user.email ?? '',
        phone: user.phone ?? '',
        address: user.address ?? '',
        bio: user.bio ?? '',
        memberType: user.memberType ?? 'adopter',
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    if (!user) {
      setMessage('사용자 정보가 없습니다.');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`/api/members/${user.memberId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}`,
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          bio: formData.bio,
          memberType: formData.memberType,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '서버 오류가 발생했습니다.');
      }

      const data = await response.json();
      
      const updatedUser: User = {
        ...user,
        ...data.content,
        createdAt: new Date(data.content.createdAt)
      };

      setUser(updatedUser);
      setGlobalMemberType(updatedUser.memberType);

      setMessage('정보가 성공적으로 수정되었습니다!');

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '정보 수정에 실패했습니다.';
      setMessage(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!user) {
    return (
        <div className="text-center py-8">
          <p className="text-gray-500">사용자 정보를 불러오는 중...</p>
        </div>
    );
  }

  return (
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* JSX 렌더링 부분 */}
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
                  readOnly
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                전화번호
              </label>
              <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="전화번호를 입력해주세요"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                주소
              </label>
              <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="주소를 입력해주세요"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              회원 유형 *
            </label>
            <div className="w-full md:w-1/2 px-4 py-3 border border-gray-300 rounded-lg bg-white">
              <div className="flex space-x-6">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                      type="radio"
                      name="memberType"
                      value="adopter"
                      checked={formData.memberType === 'adopter'}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500 focus:ring-2"
                  />
                  <span className="text-sm font-medium text-gray-700">🙋 입양 희망자</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                      type="radio"
                      name="memberType"
                      value="shelter"
                      checked={formData.memberType === 'shelter'}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500 focus:ring-2"
                  />
                  <span className="text-sm font-medium text-gray-700">💒 보호소</span>
                </label>
              </div>
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
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
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