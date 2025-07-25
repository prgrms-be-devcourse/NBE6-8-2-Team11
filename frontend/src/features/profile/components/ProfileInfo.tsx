import Image from 'next/image';
import { User } from '../types';
import { formatDate } from '../../../shared/utils';

interface ProfileInfoProps {
  user: User | null;
}

export default function ProfileInfo({ user }: ProfileInfoProps) {
  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">사용자 정보를 불러올 수 없습니다.</p>
      </div>
    );
  }

  const getMemberTypeLabel = (type: string) => {
    return type === 'adopter' ? '입양 희망자' : '보호소';
  };

  return (
    <div className="space-y-6">
      {/* 프로필 이미지 및 기본 정보 */}
      <div className="flex items-start space-x-6">
        <div className="relative">
          {user.profileImage ? (
            <Image
              src={user.profileImage}
              alt={user.name}
              width={120}
              height={120}
              className="rounded-full object-cover"
            />
          ) : (
            <div className="w-30 h-30 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-4xl">👤</span>
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{user.name}</h2>
          <p className="text-gray-600 mb-4">{user.email}</p>
          
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full">
              {getMemberTypeLabel(user.memberType)}
            </span>
            <span>가입일: {formatDate(user.createdAt)}</span>
          </div>
        </div>
      </div>

      {/* 상세 정보 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">기본 정보</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">전화번호</span>
              <span className="font-medium">{user.phone}</span>
            </div>
            
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">주소</span>
              <span className="font-medium">{user.address}</span>
            </div>
            
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">가입일</span>
              <span className="font-medium">{formatDate(user.createdAt)}</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">소개</h3>
          <p className="text-gray-700 leading-relaxed">
            {user.bio || '소개글이 없습니다.'}
          </p>
        </div>
      </div>
    </div>
  );
} 