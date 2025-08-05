'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import Header from '../../shared/components/layout/Header';
import Footer from '../../shared/components/layout/Footer';
import LoadingSpinner from '../../shared/components/common/LoadingSpinner';
import { adminService, AdminUser, AdminPet } from '../../shared/services/admin';
import { formatDate } from '../../shared/utils';

export default function AdminPage() {
  const { userInfo, isLoggedIn, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('members'); // 'members' or 'pets'

  // States for Member Management
  const [members, setMembers] = useState<AdminUser[]>([]);
  const [isMembersLoading, setIsMembersLoading] = useState(true);
  const [memberError, setMemberError] = useState('');

  // States for Pet Management
  const [pets, setPets] = useState<AdminPet[]>([]);
  const [isPetsLoading, setIsPetsLoading] = useState(true);
  const [petError, setPetError] = useState('');

  const isAdmin = userInfo?.auth?.includes('ADMIN');

  // Fetch members data
  const fetchMembers = useCallback(async () => {
    setIsMembersLoading(true);
    setMemberError('');
    try {
      const memberData = await adminService.getMembers();
      setMembers(memberData);
    } catch (error) {
      console.error('Failed to fetch members:', error);
      setMemberError('회원 목록을 불러오는 데 실패했습니다.');
    } finally {
      setIsMembersLoading(false);
    }
  }, []);

  // Fetch pets data
  const fetchPets = useCallback(async () => {
    setIsPetsLoading(true);
    setPetError('');
    try {
      const petData = await adminService.getPets();
      setPets(petData);
    } catch (error) {
      console.error('Failed to fetch pets:', error);
      setPetError('펫 목록을 불러오는 데 실패했습니다.');
    } finally {
      setIsPetsLoading(false);
    }
  }, []);
  
  // Initial data loading based on active tab
  useEffect(() => {
    if (isAdmin) {
      if (activeTab === 'members') {
        fetchMembers();
      } else if (activeTab === 'pets') {
        fetchPets();
      }
    }
  }, [isAdmin, activeTab, fetchMembers, fetchPets]);

  // Auth check effect
  useEffect(() => {
    if (!isAuthLoading) {
      if (!isLoggedIn || !isAdmin) {
        alert('접근 권한이 없습니다.');
        router.replace('/');
      }
    }
  }, [isAuthLoading, isLoggedIn, isAdmin, router]);

  const handleDeleteMember = async (memberId: number) => {
    if (window.confirm(`정말로 회원 ID ${memberId}를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`)) {
      try {
        await adminService.deleteMember(memberId.toString());
        alert('회원이 성공적으로 삭제되었습니다.');
        fetchMembers(); // Refresh the list
      } catch (error) {
        alert('회원 삭제에 실패했습니다.');
        console.error('Failed to delete member:', error);
      }
    }
  };

  const handleDeletePet = async (petId: number) => {
    if (window.confirm(`정말로 펫 ID ${petId}를 삭제하시겠습니까?`)) {
      try {
        await adminService.deletePet(petId.toString());
        alert('펫이 성공적으로 삭제되었습니다.');
        fetchPets(); // Refresh the list
      } catch (error) {
        alert('펫 삭제에 실패했습니다.');
        console.error('Failed to delete pet:', error);
      }
    }
  };


  if (isAuthLoading || !isLoggedIn || !isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <LoadingSpinner size="lg" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">관리자 대시보드</h1>
            <p className="text-gray-600">사용자와 반려동물 정보를 관리하세요.</p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6 border-b border-gray-200">
            <nav className="flex space-x-4">
                <button 
                    onClick={() => setActiveTab('members')}
                    className={`py-2 px-4 text-sm font-medium ${activeTab === 'members' ? 'border-b-2 border-orange-500 text-orange-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    회원 관리
                </button>
                <button 
                    onClick={() => setActiveTab('pets')}
                    className={`py-2 px-4 text-sm font-medium ${activeTab === 'pets' ? 'border-b-2 border-orange-500 text-orange-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    펫 관리
                </button>
            </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm p-6">
            {activeTab === 'members' && (
                <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">회원 목록</h2>
                    {isMembersLoading ? <LoadingSpinner /> : memberError ? <p className="text-red-500">{memberError}</p> : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">이름</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">이메일</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">역할</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">가입일</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">작업</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {members.map(member => (
                                        <tr key={member.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.id}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{member.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.email}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.role}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(new Date(member.createdAt))}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <button onClick={() => handleDeleteMember(member.id)} className="text-red-600 hover:text-red-900">삭제</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'pets' && (
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-800">펫 목록</h2>
                        <button className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-600">
                            새 펫 등록
                        </button>
                    </div>
                    {isPetsLoading ? <LoadingSpinner /> : petError ? <p className="text-red-500">{petError}</p> : (
                         <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">이름</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">종</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">나이</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">등록일</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">작업</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {pets.map(pet => (
                                        <tr key={pet.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pet.id}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{pet.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pet.species}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pet.age}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(new Date(pet.createdAt))}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-4">
                                                <button className="text-indigo-600 hover:text-indigo-900">수정</button>
                                                <button onClick={() => handleDeletePet(pet.id)} className="text-red-600 hover:text-red-900">삭제</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
      </main>
      <Footer />
    </div>
  );
}