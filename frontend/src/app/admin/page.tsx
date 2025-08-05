'use client';

import { useState, useEffect, useCallback, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import Header from '../../shared/components/layout/Header';
import Footer from '../../shared/components/layout/Footer';
import LoadingSpinner from '../../shared/components/common/LoadingSpinner';
import { adminService, CreatePetRequest, UpdatePetRequest } from '../../shared/services/admin';
import { Pet } from '../../shared/types';
import { formatDate } from '../../shared/utils';

// 회원 데이터 타입 정의
interface MemberData {
  memberId: number;
  name: string;
  email: string;
  createdAt: string;
}

// PetStatusType Enum 값
const petStatusTypes = [
  'AVAILABLE_BOTH',
  'AVAILABLE_FOR_ADOPTION',
  'ADOPTED',
  'AVAILABLE_FOR_CARE',
  'CARE_IN_PROGRESS',
  'CARE_COMPLETED'
];

// 펫 폼 모달에서 사용할 데이터 타입
interface PetFormData {
  id?: number;
  name: string;
  species: string;
  age: number;
  gender: 'MALE' | 'FEMALE';
  description: string;
  imageUrl: string;
  shelterName: string;
  statuses: string[];
  petOwnerId?: number;
  createdAt?: Date | string;
  petStatuses?: string[];
}

// 펫 폼 모달 컴포넌트
const PetFormModal = ({ pet, onClose, onSave }: { pet: Partial<Pet> | null, onClose: () => void, onSave: (petData: PetFormData) => void }) => {
  // FIX: pet?.petStatuses가 있으면 그 값을, 없으면 기본값을 사용하도록 초기화 로직 수정
  const initialStatuses = pet?.petStatuses && pet.petStatuses.length > 0 ? pet.petStatuses : ['AVAILABLE_FOR_ADOPTION'];

  const [formData, setFormData] = useState<PetFormData>({
    name: '',
    species: 'dog',
    age: 0,
    gender: 'MALE',
    description: '',
    imageUrl: '',
    shelterName: '',
    ...pet,
    statuses: initialStatuses, // petStatuses를 statuses로 매핑하여 초기화
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    // 상태(statuses) 필드는 항상 배열 형태로 값을 저장
    if (name === 'statuses') {
      setFormData(prev => ({ ...prev, statuses: [value] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: name === 'age' ? parseInt(value, 10) || 0 : value }));
    }
  };
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-6">{pet?.id ? '펫 정보 수정' : '새 펫 등록'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="name" value={formData.name} onChange={handleChange} placeholder="이름" required className="w-full p-2 border rounded" />
          <input name="species" value={formData.species} onChange={handleChange} placeholder="종" required className="w-full p-2 border rounded" />
          <input name="age" type="number" value={formData.age} onChange={handleChange} placeholder="나이" required className="w-full p-2 border rounded" />
          <select name="gender" value={formData.gender} onChange={handleChange} className="w-full p-2 border rounded">
            <option value="MALE">수컷</option>
            <option value="FEMALE">암컷</option>
          </select>
          <textarea name="description" value={formData.description} onChange={handleChange} placeholder="설명" className="w-full p-2 border rounded" />
          <input name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="이미지 URL" className="w-full p-2 border rounded" />
          <input name="shelterName" value={formData.shelterName} onChange={handleChange} placeholder="보호소 이름 (없으면 비워두세요)" className="w-full p-2 border rounded" />

          <div>
            <label className="block text-sm font-medium text-gray-700">펫 상태 *</label>
            <select
              name="statuses"
              required
              value={formData.statuses[0]}
              onChange={handleChange}
              className="mt-1 w-full p-2 border rounded"
            >
              {petStatusTypes.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">취소</button>
            <button type="submit" className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600">저장</button>
          </div>
        </form>
      </div>
    </div>
  );
};


export default function AdminPage() {
  const { userInfo, isLoggedIn, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('members');

  const [members, setMembers] = useState<MemberData[]>([]);
  const [isMembersLoading, setIsMembersLoading] = useState(true);
  const [memberError, setMemberError] = useState('');

  const [pets, setPets] = useState<Pet[]>([]);
  const [isPetsLoading, setIsPetsLoading] = useState(true);
  const [petError, setPetError] = useState('');

  const [isPetModalOpen, setIsPetModalOpen] = useState(false);
  const [editingPet, setEditingPet] = useState<Partial<Pet> | null>(null);

  const isAdmin = userInfo?.auth?.includes('ADMIN');

  const fetchMembers = useCallback(async () => {
    setIsMembersLoading(true);
    setMemberError('');
    try {
      const memberData = await adminService.getMembers();
      setMembers(memberData as unknown as MemberData[]);
    } catch (error) {
      console.error('Failed to fetch members:', error);
      setMemberError('회원 목록을 불러오는 데 실패했습니다.');
    } finally {
      setIsMembersLoading(false);
    }
  }, []);

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
  
  useEffect(() => {
    if (isAdmin) {
      if (activeTab === 'members') {
        fetchMembers();
      } else if (activeTab === 'pets') {
        fetchPets();
      }
    }
  }, [isAdmin, activeTab, fetchMembers, fetchPets]);

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
        fetchMembers();
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
        fetchPets();
      } catch (error) {
        alert('펫 삭제에 실패했습니다.');
        console.error('Failed to delete pet:', error);
      }
    }
  };

  const handleOpenPetModal = (pet: Partial<Pet> | null = null) => {
    setEditingPet(pet);
    setIsPetModalOpen(true);
  };

  const handleClosePetModal = () => {
    setIsPetModalOpen(false);
    setEditingPet(null);
  };

  // FIX: handleSavePet 로직 수정
  const handleSavePet = async (petData: PetFormData) => {
    try {
      if (editingPet && editingPet.id) {
        // FIX: 수정 시 DTO에 불필요한 id, petOwnerId, createdAt, 그리고 petStatuses 필드를 제거
        const { id, petOwnerId, createdAt, petStatuses, ...updateData } = petData;
        
        await adminService.updatePet(editingPet.id.toString(), updateData as UpdatePetRequest);
        alert('펫 정보가 성공적으로 수정되었습니다.');
      } else {
        await adminService.createPet(petData as CreatePetRequest);
        alert('펫이 성공적으로 등록되었습니다.');
      }
      handleClosePetModal();
      fetchPets();
    } catch (error) {
      alert(`펫 ${editingPet?.id ? '수정' : '등록'}에 실패했습니다.`);
      console.error('Failed to save pet:', error);
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
        {/* ... (이하 JSX 코드는 이전과 동일) ... */}
        <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">관리자 대시보드</h1>
            <p className="text-gray-600">사용자와 반려동물 정보를 관리하세요.</p>
        </div>

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
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">가입일</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">작업</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {members.map(member => (
                                        <tr key={member.memberId}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.memberId}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{member.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.email}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(new Date(member.createdAt))}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <button onClick={() => handleDeleteMember(member.memberId)} className="text-red-600 hover:text-red-900">삭제</button>
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
                        <button onClick={() => handleOpenPetModal()} className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-600">
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
                                                <button onClick={() => handleOpenPetModal(pet)} className="text-indigo-600 hover:text-indigo-900">수정</button>
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
        
        {isPetModalOpen && <PetFormModal pet={editingPet} onClose={handleClosePetModal} onSave={handleSavePet} />}
      </main>
      <Footer />
    </div>
  );
}