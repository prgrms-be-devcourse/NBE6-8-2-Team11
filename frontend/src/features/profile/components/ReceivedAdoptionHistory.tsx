'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { format, parseISO } from 'date-fns';
import { adoptionService } from '../../../shared/services/adoptionService';

interface ReceivedAdoptionRecord {
  id: number;
  title: string;
  type: 'ADOPTION' | 'CARE';
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
  applicantInfo: {
    id: number;
    name: string;
    phone: string;
    email: string;
    address: string;
  };
  anotherPets: string;
  experience: string;
  message: string;
  petInfo?: {
    id: number;
    name: string;
    species: string;
    age: number;
    gender: string;
    imageUrl: string;
    shelterName?: string;
  };
  desiredStartDate?: string;
  desiredEndDate?: string;
}

export default function ReceivedAdoptionHistory() {
  const router = useRouter();
  const [receivedRecords, setReceivedRecords] = useState<ReceivedAdoptionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<ReceivedAdoptionRecord | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    const loadReceivedHistory = async () => {
      setIsLoading(true);
      
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }
      
      setIsAuthenticated(true);
      
      try {
        const applications = await adoptionService.getReceivedApplications();
        
        const records: ReceivedAdoptionRecord[] = applications.map(app => ({
          id: parseInt(app.id),
          title: app.title || `${app.type === 'ADOPTION' ? '입양' : '돌봄'} 신청`,
          type: app.type as 'ADOPTION' | 'CARE',
          status: app.status,
          createdAt: app.createdAt,
          applicantInfo: app.applicantInfo ? {
            id: app.applicantInfo.id,
            name: app.applicantInfo.name,
            phone: app.applicantInfo.phone,
            email: app.applicantInfo.email,
            address: app.applicantInfo.address
          } : {
            id: 0,
            name: '신청자 정보 없음',
            phone: '',
            email: '',
            address: ''
          },
          anotherPets: '',
          experience: '',
          message: '',
          petInfo: app.petInfo ? {
            id: parseInt(app.petInfo.id),
            name: app.petInfo.name,
            species: app.petInfo.species,
            age: app.petInfo.age,
            gender: app.petInfo.gender,
            imageUrl: app.petInfo.imageUrl,
            shelterName: app.petInfo.shelterName
          } : undefined,
          desiredStartDate: undefined,
          desiredEndDate: undefined
        }));
        
        setReceivedRecords(records);
      } catch (error) {
        console.error('받은 신청 내역 로딩 실패:', error);
        setReceivedRecords([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadReceivedHistory();
  }, []);

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PENDING': return '검토 중';
      case 'ACCEPTED': return '승인됨';
      case 'REJECTED': return '거절됨';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'ACCEPTED': return 'bg-green-100 text-green-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'ADOPTION': return '입양';
      case 'CARE': return '돌봄';
      default: return type;
    }
  };

  // 안전한 날짜 포맷팅 함수
  const formatDate = (timestamp: string | null | undefined): string => {
    if (!timestamp) return '날짜 정보 없음';
    
    try {
      let date: Date;
      
      if (Array.isArray(timestamp)) {
        // 배열 형태의 날짜 처리 [year, month, day, hour, minute, second, nano]
        const [year, month, day, hour, minute] = timestamp;
        date = new Date(year, month - 1, day, hour, minute);
      } else if (typeof timestamp === 'string') {
        // ISO 문자열인 경우 parseISO 사용
        if (timestamp.includes('T')) {
          date = parseISO(timestamp);
        } else {
          // 일반 문자열인 경우 new Date 사용
          date = new Date(timestamp);
        }
      } else {
        return '날짜 정보 없음';
      }
    
      if (isNaN(date.getTime())) {
        return '날짜 정보 없음';
      }
      
      const result = format(date, 'yyyy-MM-dd');
      return result;
    } catch {
      return '날짜 정보 없음';
    }
  };

  const filteredRecords = receivedRecords.filter(record => {
    if (filter === 'all') return true;
    return record.status === filter;
  });

  const handleAcceptApplication = async (recordId: number, type: string) => {
    try {
      await adoptionService.updateAdoptionStatus(recordId.toString(), type, { status: 'ACCEPTED' });
      setReceivedRecords(prev => prev.map(record => 
        record.id === recordId ? { ...record, status: 'ACCEPTED' } : record
      ));
    } catch (error) {
      console.error('신청 승인 실패:', error);
      alert('신청 승인에 실패했습니다.');
    }
  };

  const handleRejectApplication = async (recordId: number, type: string) => {
    try {
      await adoptionService.updateAdoptionStatus(recordId.toString(), type, { status: 'REJECTED' });
      setReceivedRecords(prev => prev.map(record => 
        record.id === recordId ? { ...record, status: 'REJECTED' } : record
      ));
    } catch (error) {
      console.error('신청 거절 실패:', error);
      alert('신청 거절에 실패했습니다.');
    }
  };

  const handleDeleteApplication = async (recordId: number, type: string) => {
    if (!confirm('정말로 이 신청을 삭제하시겠습니까?')) return;
    
    try {
      await adoptionService.deleteReceivedApplication(recordId.toString(), type);
      setReceivedRecords(prev => prev.filter(record => record.id !== recordId));
      alert('신청을 삭제했습니다.');
    } catch (error) {
      console.error('신청 삭제 실패:', error);
      alert('신청 삭제에 실패했습니다.');
    }
  };

  const handleDeleteAllApplications = async () => {
    if (!confirm('정말로 모든 신청을 삭제하시겠습니까?')) return;
    
    try {
      await adoptionService.deleteAllReceivedApplications();
      setReceivedRecords([]);
      alert('모든 신청을 삭제했습니다.');
    } catch (error) {
      console.error('전체 삭제 실패:', error);
      alert('전체 삭제에 실패했습니다.');
    }
  };

  const handleViewDetail = async (recordId: number, type: string) => {
    try {
      const detail = await adoptionService.getReceivedApplicationDetail(recordId.toString(), type);
      
      const record: ReceivedAdoptionRecord = {
        id: parseInt(detail.id),
        title: detail.title,
        type: detail.type as 'ADOPTION' | 'CARE',
        status: detail.status,
        createdAt: detail.createdAt,
        applicantInfo: detail.applicantInfo ? {
          id: detail.applicantInfo.id,
          name: detail.applicantInfo.name,
          phone: detail.applicantInfo.phone,
          email: detail.applicantInfo.email,
          address: detail.applicantInfo.address
        } : {
          id: 0,
          name: '신청자 정보 없음',
          phone: '',
          email: '',
          address: ''
        },
        anotherPets: detail.anotherPets,
        experience: detail.experience,
        message: detail.message,
        petInfo: detail.petInfo ? {
          id: parseInt(detail.petInfo.id),
          name: detail.petInfo.name,
          species: detail.petInfo.species,
          age: detail.petInfo.age,
          gender: detail.petInfo.gender,
          imageUrl: detail.petInfo.imageUrl,
          shelterName: detail.petInfo.shelterName
        } : undefined,
        desiredStartDate: detail.desiredStartDate,
        desiredEndDate: detail.desiredEndDate
      };
      
      setSelectedRecord(record);
      setShowDetailModal(true);
    } catch (error) {
      console.error('상세 정보 로딩 실패:', error);
      alert('상세 정보를 불러오는데 실패했습니다.');
    }
  };

  const handleLogin = () => {
    router.push('/login');
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
        <p className="text-gray-500 mt-2">받은 신청 내역을 불러오는 중...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔐</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">로그인이 필요합니다</h3>
        <p className="text-gray-500 mb-6">받은 신청 내역을 확인하려면 로그인해주세요.</p>
        <button 
          onClick={handleLogin}
          className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
        >
          로그인하기
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">받은 신청 내역</h2>
        {receivedRecords.length > 0 && (
          <button 
            onClick={handleDeleteAllApplications}
            className="text-sm text-red-600 hover:text-red-700 font-medium bg-red-50 hover:bg-red-100 px-3 py-1 rounded-lg transition-colors"
          >
            전체 삭제
          </button>
        )}
      </div>

      <div className="flex items-center space-x-4">
        <span className="text-sm font-medium text-gray-700">상태별 필터:</span>
        <div className="flex space-x-2">
          {[
            { value: 'all', label: '전체' },
            { value: 'PENDING', label: '검토 중' },
            { value: 'ACCEPTED', label: '승인됨' },
            { value: 'REJECTED', label: '거절됨' }
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setFilter(option.value)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filter === option.value
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredRecords.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">받은 신청 내역이 없습니다</h3>
            <p className="text-gray-500">아직 받은 입양/돌봄 신청이 없네요.</p>
          </div>
        ) : (
          filteredRecords.map((record) => (
            <div key={`${record.type}-${record.id}`} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow relative">
              <div className="flex items-start space-x-4">
                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                  {record.petInfo?.imageUrl ? (
                    <Image
                      src={record.petInfo.imageUrl.split('?')[0]}
                      alt={record.petInfo.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <span className="text-2xl">🐾</span>
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{record.petInfo?.name || '동물 정보 없음'}</h3>
                      <p className="text-sm text-gray-600">{record.title}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {getTypeLabel(record.type)} 신청 • 신청자: {record.applicantInfo.name}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                      {getStatusLabel(record.status)}
                    </span>
                  </div>

                  <div className="mt-2 text-sm text-gray-500">
                    <p>신청일: {formatDate(record.createdAt)}</p>
                    {record.type === 'CARE' && record.desiredStartDate && record.desiredEndDate && (
                      <p>돌봄 기간: {formatDate(record.desiredStartDate)} ~ {formatDate(record.desiredEndDate)}</p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col space-y-2">
                  <button 
                    onClick={() => handleViewDetail(record.id, record.type)}
                    className="text-sm text-gray-700 hover:text-gray-900 font-medium"
                  >
                    상세보기
                  </button>
                </div>
              </div>

              <div className="absolute bottom-4 right-4 flex space-x-2">
                {record.status === 'PENDING' && (
                  <>
                    <button 
                      onClick={() => handleAcceptApplication(record.id, record.type)}
                      className="text-sm text-green-600 hover:text-green-700 font-medium bg-green-50 hover:bg-green-100 px-3 py-1 rounded-lg transition-colors"
                    >
                      승인
                    </button>
                    <button 
                      onClick={() => handleRejectApplication(record.id, record.type)}
                      className="text-sm text-red-600 hover:text-red-700 font-medium bg-red-50 hover:bg-red-100 px-3 py-1 rounded-lg transition-colors"
                    >
                      거절
                    </button>
                  </>
                )}
                <button 
                  onClick={() => handleDeleteApplication(record.id, record.type)}
                  className="text-sm text-gray-600 hover:text-gray-700 font-medium bg-gray-50 hover:bg-gray-100 px-3 py-1 rounded-lg transition-colors"
                >
                  삭제
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {receivedRecords.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-3">받은 신청 통계</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{receivedRecords.length}</div>
              <div className="text-gray-600">전체 신청</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {receivedRecords.filter(r => r.status === 'PENDING').length}
              </div>
              <div className="text-gray-600">검토 중</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {receivedRecords.filter(r => r.status === 'ACCEPTED').length}
              </div>
              <div className="text-gray-600">승인됨</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {receivedRecords.filter(r => r.status === 'REJECTED').length}
              </div>
              <div className="text-gray-600">거절됨</div>
            </div>
          </div>
        </div>
      )}

      {showDetailModal && selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold">신청 상세 정보</h3>
              <button 
                onClick={() => setShowDetailModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">신청자 정보</h4>
                <div className="bg-gray-50 p-3 rounded-lg space-y-1 text-sm">
                  <p><span className="font-medium">이름:</span> {selectedRecord.applicantInfo.name}</p>
                  <p><span className="font-medium">연락처:</span> {selectedRecord.applicantInfo.phone}</p>
                  <p><span className="font-medium">이메일:</span> {selectedRecord.applicantInfo.email}</p>
                  <p><span className="font-medium">주소:</span> {selectedRecord.applicantInfo.address}</p>
                </div>
              </div>

              {selectedRecord.petInfo && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">동물 정보</h4>
                  <div className="bg-gray-50 p-3 rounded-lg space-y-1 text-sm">
                    <p><span className="font-medium">이름:</span> {selectedRecord.petInfo.name}</p>
                    <p><span className="font-medium">종류:</span> {selectedRecord.petInfo.species}</p>
                    <p><span className="font-medium">나이:</span> {selectedRecord.petInfo.age}세</p>
                    <p><span className="font-medium">성별:</span> {selectedRecord.petInfo.gender}</p>
                  </div>
                </div>
              )}

              <div>
                <h4 className="font-medium text-gray-900 mb-2">신청 내용</h4>
                <div className="bg-gray-50 p-3 rounded-lg space-y-2 text-sm">
                  <p><span className="font-medium">현재 키우는 동물:</span> {selectedRecord.anotherPets || '없음'}</p>
                  <p><span className="font-medium">키우는 경험:</span> {selectedRecord.experience || '없음'}</p>
                  <p><span className="font-medium">신청 이유:</span></p>
                  <p className="text-gray-700 pl-4">{selectedRecord.message}</p>
                </div>
              </div>

              {selectedRecord.type === 'CARE' && selectedRecord.desiredStartDate && selectedRecord.desiredEndDate && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">돌봄 기간</h4>
                  <div className="bg-gray-50 p-3 rounded-lg text-sm">
                    <p>{formatDate(selectedRecord.desiredStartDate)} ~ {formatDate(selectedRecord.desiredEndDate)}</p>
                  </div>
                </div>
              )}

              {selectedRecord.status === 'PENDING' && (
                <div className="flex space-x-3 pt-4">
                  <button 
                    onClick={() => {
                      handleAcceptApplication(selectedRecord.id, selectedRecord.type);
                      setShowDetailModal(false);
                    }}
                    className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
                  >
                    승인
                  </button>
                  <button 
                    onClick={() => {
                      handleRejectApplication(selectedRecord.id, selectedRecord.type);
                      setShowDetailModal(false);
                    }}
                    className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
                  >
                    거절
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 