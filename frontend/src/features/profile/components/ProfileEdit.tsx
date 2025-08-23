'use client';

import { useState, useEffect } from 'react';
import { User } from '../types';
import { useMemberType } from '../../../context/MemberTypeContext';

interface ProfileEditProps {
  user: User | null;
  setUser: (user: User | null) => void;
}

export default function ProfileEdit({ user, setUser }: ProfileEditProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { memberType, setMemberType, getMemberType, tempFormData, setTempFormData, clearTempFormData } = useMemberType();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    bio: '',
    memberType: 'adopter' as 'adopter' | 'shelter'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  // 초기화 및 데이터 복원
  useEffect(() => {
    if (user) {
      // 임시 저장된 데이터가 있으면 우선 사용, 없으면 사용자 데이터 사용
      setFormData({
        name: tempFormData.name || user.name || '',
        email: user.email || '',
        phone: tempFormData.phone || user.phone || '',
        address: tempFormData.address || user.address || '',
        bio: tempFormData.bio || user.bio || '',
        memberType: getMemberType(user.memberType)
      });
    }
  }, [user, tempFormData, getMemberType]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    const newFormData = {
      ...formData,
      [name]: value
    };
    
    setFormData(newFormData);
    
    // 입력 값을 임시 저장 (이메일 제외)
    if (name !== 'email') {
      setTempFormData({
        name: newFormData.name,
        phone: newFormData.phone,
        address: newFormData.address,
        bio: newFormData.bio
      });
    }
    
    // memberType 변경 시 Context에 즉시 저장
    if (name === 'memberType') {
      setMemberType(value as 'adopter' | 'shelter');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      if (!user) {
        throw new Error('사용자 정보가 없습니다.');
      }

      // memberType 설정 여부 확인
      if (!formData.memberType) {
        throw new Error('회원 유형을 선택해주세요.');
      }

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
          // currentPassword: '',
          // newPassword: '',
        }),
      });

      if (!response.ok) {
        throw new Error('서버 오류가 발생했습니다.');
      }

      const data = await response.json();

      const rawCreatedAt = data.content.createdAt;
      const createdAt = Array.isArray(rawCreatedAt)
          ? new Date(rawCreatedAt[0], rawCreatedAt[1] - 1, rawCreatedAt[2])
          : new Date(rawCreatedAt);

      const updatedUser: User = {
        memberId: data.content.memberId,
        name: data.content.name,
        email: data.content.email,
        phone: data.content.phone,
        address: data.content.address,
        bio: data.content.bio,
        createdAt,
        // Context의 현재 값을 User 객체에도 동기화
        memberType: getMemberType(),
      };

      setUser(updatedUser);
      // 성공적으로 저장되면 임시 데이터 삭제
      clearTempFormData();
      setMessage('정보가 성공적으로 수정되었습니다!');
    } catch (error) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : '정보 수정에 실패했습니다. 다시 시도해주세요.';
      setMessage(errorMessage);
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
        {message && (
            <div className={`p-4 rounded-lg ${
                message.includes('성공')
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
            }`}>
              {message}
            </div>
        )}

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
                  readOnly
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
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
            
            {!formData.memberType && (
              <p className="mt-1 text-sm text-red-600">회원 유형을 선택해주세요.</p>
            )}
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
                const resetMemberType = getMemberType(user?.memberType);
                setFormData({
                  name: user?.name || '',
                  email: user?.email || '',
                  phone: user?.phone || '',
                  address: user?.address || '',
                  bio: user?.bio || '',
                  memberType: resetMemberType
                });
                // Context도 원래 값으로 복원하고 임시 데이터 삭제
                setMemberType(resetMemberType);
                clearTempFormData();
                setMessage('');
              }}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            취소
          </button>
          <button
              type="submit"
              disabled={isSubmitting || !formData.memberType}
              className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? '저장 중...' : '저장'}
          </button>
        </div>
      </form>
  );
}