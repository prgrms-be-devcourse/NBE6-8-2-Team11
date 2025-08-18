'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '../../shared/components/layout/Header';
import Footer from '../../shared/components/layout/Footer';
import { Pet } from '../../shared/types';
import { formatAnimalAge, formatAnimalGender, formatAnimalSpecies } from '../../shared/utils';
import { petService } from '../../shared/services/petService';
import { adoptionService } from '../../shared/services/adoptionService';
import Image from 'next/image';

interface AdoptionFormData {
  petId: number;
  applicantInfo: {
    name: string;
    phone: string;
    email: string;
    address: string;
  };
  experience: string;
  otherPets: string;
  reason: string;
  applicationType: 'adoption' | 'care';
  careStartDate?: string;
  careEndDate?: string;
}

// 로딩 컴포넌트
const LoadingSpinner = () => (
  <div className="min-h-screen bg-gray-50">
    <Header />
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500"></div>
    </div>
    <Footer />
  </div>
);

// 에러 컴포넌트
const ErrorPage = ({ onBackToGallery }: { onBackToGallery: () => void }) => (
  <div className="min-h-screen bg-gray-50">
    <Header />
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="text-6xl mb-4">🐾</div>
      <h2 className="text-2xl font-bold mb-2">동물 정보가 없습니다</h2>
      <p className="text-gray-500 mb-6">올바른 경로로 접근해주세요.</p>
      <button 
        onClick={onBackToGallery} 
        className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
      >
        갤러리로 돌아가기
      </button>
    </div>
    <Footer />
  </div>
);

// 선택된 동물 정보 컴포넌트
const SelectedPetInfo = ({ pet }: { pet: Pet }) => (
  <div className="mb-8 pb-6 border-b border-gray-200">
    <h2 className="text-xl font-semibold text-gray-900 mb-4">입양/돌봄 신청 동물</h2>
    <div className="flex items-center space-x-4">
      {pet.imageUrl && (
        <div className="w-24 h-24 relative rounded-lg overflow-hidden">
          <Image
            src={pet.imageUrl.split('?')[0]}
            alt={pet.name}
            fill
            className="object-cover"
          />
        </div>
      )}
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">{pet.name}</h3>
        <p className="text-sm text-gray-600 mb-2">
          {formatAnimalSpecies(pet.species)} • {formatAnimalAge(pet.age)} • {formatAnimalGender(pet.gender)}
        </p>
        <p className="text-sm text-gray-500">
          보호소: {pet.shelterName || '정보 없음'}
        </p>
      </div>
    </div>
  </div>
);

// 폼 입력 필드 컴포넌트
const FormField = ({ 
  label, 
  name, 
  type = 'text', 
  value, 
  onChange, 
  placeholder, 
  required = false,
  rows = undefined 
}: {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  required?: boolean;
  rows?: number;
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label}
    </label>
    {type === 'textarea' ? (
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        rows={rows}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        placeholder={placeholder}
        required={required}
      />
    ) : (
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        placeholder={placeholder}
        required={required}
      />
    )}
  </div>
);

// 메시지 컴포넌트
const MessageDisplay = ({ message }: { message: string }) => {
  if (!message) return null;
  
  const isSuccess = message.includes('성공');
  return (
    <div className={`p-4 rounded-lg ${
      isSuccess ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
    }`}>
      {message}
    </div>
  );
};

// 액션 버튼 컴포넌트
const ActionButtons = ({ 
  petId, 
  isSubmitting, 
  onSubmit 
}: { 
  petId: number; 
  isSubmitting: boolean; 
  onSubmit: (e: React.FormEvent) => void; 
}) => (
  <div className="pt-6 border-t border-gray-200 space-y-4">
    
    <button
      type="submit"
      disabled={isSubmitting}
      onClick={onSubmit}
      className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-colors ${
        isSubmitting
          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
          : 'bg-orange-500 text-white hover:bg-orange-600'
      }`}
    >
      {isSubmitting ? '제출 중...' : '입양/돌봄 신청하기'}
    </button>
  </div>
);

// 라디오 버튼 컴포넌트
const ApplicationTypeRadio = ({ 
  petStatuses, 
  selectedType, 
  onTypeChange 
}: { 
  petStatuses?: string[]; 
  selectedType: 'adoption' | 'care'; 
  onTypeChange: (type: 'adoption' | 'care') => void; 
}) => {
  // 상태에 따른 라디오 버튼 활성화 여부 결정
  const canAdopt = petStatuses?.some((status) => 
    status === 'AVAILABLE_FOR_ADOPTION' || status === 'AVAILABLE_BOTH'
  );
  const canCare = petStatuses?.some((status) => 
    status === 'AVAILABLE_FOR_CARE' || status === 'AVAILABLE_BOTH'
  );

  // 기본적으로 두 옵션 모두 활성화 (petStatuses가 없거나 빈 배열인 경우)
  const isAdoptEnabled = canAdopt !== false;
  const isCareEnabled = canCare !== false;

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-3">
        신청 유형
      </label>
      <div className="space-y-3">
        <label className={`flex items-center space-x-3 p-3 rounded-lg border-2 transition-colors ${
          selectedType === 'adoption' 
            ? 'border-orange-500 bg-orange-50' 
            : 'border-gray-200 hover:border-gray-300'
        } ${!isAdoptEnabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
          <input
            type="radio"
            name="applicationType"
            value="adoption"
            checked={selectedType === 'adoption'}
            onChange={() => isAdoptEnabled && onTypeChange('adoption')}
            disabled={!isAdoptEnabled}
            className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500"
          />
          <span className="text-sm font-medium text-gray-900">입양 신청</span>
          {!isAdoptEnabled && (
            <span className="text-xs text-gray-500 ml-2">(현재 입양 불가)</span>
          )}
        </label>

        <label className={`flex items-center space-x-3 p-3 rounded-lg border-2 transition-colors ${
          selectedType === 'care' 
            ? 'border-orange-500 bg-orange-50' 
            : 'border-gray-200 hover:border-gray-300'
        } ${!isCareEnabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
          <input
            type="radio"
            name="applicationType"
            value="care"
            checked={selectedType === 'care'}
            onChange={() => isCareEnabled && onTypeChange('care')}
            disabled={!isCareEnabled}
            className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500"
          />
          <span className="text-sm font-medium text-gray-900">돌봄 신청</span>
          {!isCareEnabled && (
            <span className="text-xs text-gray-500 ml-2">(현재 돌봄 불가)</span>
          )}
        </label>
      </div>
    </div>
  );
};

// 돌봄 날짜 입력 컴포넌트
const CareDateFields = ({ 
  startDate, 
  endDate, 
  onStartDateChange, 
  onEndDateChange 
}: { 
  startDate: string; 
  endDate: string; 
  onStartDateChange: (date: string) => void; 
  onEndDateChange: (date: string) => void; 
}) => {
  // 최소 날짜를 오늘로 설정
  const today = new Date().toISOString().split('T')[0];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          돌봄 시작일 *
        </label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
          min={today}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          돌봄 종료일 *
        </label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => onEndDateChange(e.target.value)}
          min={startDate || today}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          required
        />
      </div>
    </div>
  );
};

function ApplyPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const petIdFromUrl = searchParams.get('petId');
  
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const [formData, setFormData] = useState<AdoptionFormData>({
    petId: 0,
    applicantInfo: {
      name: '',
      phone: '',
      email: '',
      address: ''
    },
    experience: '',
    otherPets: '',
    reason: '',
    applicationType: 'adoption',
    careStartDate: '',
    careEndDate: '',
  });

  useEffect(() => {
    const loadPetData = async () => {
      try {
        setIsLoading(true);

        if (!petIdFromUrl) {
          setSubmitMessage('올바른 경로로 접근해주세요. 갤러리에서 동물을 선택한 후 신청해주세요.');
          return;
        }
        
        if (petIdFromUrl) {
          // API 호출을 병렬로 처리하여 로딩 속도 개선
          const petData = await petService.getPet(petIdFromUrl);
          setSelectedPet(petData);
          
          // petStatuses에 따라 기본 선택값 설정
          let defaultApplicationType: 'adoption' | 'care' = 'adoption';
          
          if (petData.petStatuses && petData.petStatuses.length > 0) {
            const canAdopt = petData.petStatuses.some((status) => 
              status === 'AVAILABLE_FOR_ADOPTION' || status === 'AVAILABLE_BOTH'
            );
            const canCare = petData.petStatuses.some((status) => 
              status === 'AVAILABLE_FOR_CARE' || status === 'AVAILABLE_BOTH'
            );
            
            // 입양 및 돌봄 모두 가능하면 입양을 기본값으로 설정
            if (canAdopt && canCare) {
              defaultApplicationType = 'adoption';
            } else if (canAdopt) {
              defaultApplicationType = 'adoption';
            } else if (canCare) {
              defaultApplicationType = 'care';
            }
          }
          
          setFormData(prev => ({ 
            ...prev, 
            petId: petData.id,
            applicationType: defaultApplicationType
          }));
        }
      } catch (error) {
        console.error('Failed to load pet data:', error);
        setSubmitMessage('동물 정보를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    loadPetData();
  }, [petIdFromUrl]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('applicantInfo.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        applicantInfo: {
          ...prev.applicantInfo,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleApplicationTypeChange = (type: 'adoption' | 'care') => {
    setFormData(prev => ({
      ...prev,
      applicationType: type,
      // 돌봄 신청으로 변경 시 기본 날짜 설정 (시작일: 오늘, 종료일: 1주일 후)
      ...(type === 'care' && {
        careStartDate: new Date().toISOString().split('T')[0],
        careEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      }),
      // 입양 신청으로 변경 시 날짜 필드 초기화
      ...(type === 'adoption' && {
        careStartDate: '',
        careEndDate: '',
      }),
    }));
  };

  const handleCareStartDateChange = (date: string) => {
    setFormData(prev => ({
      ...prev,
      careStartDate: date,
      // 시작일이 종료일보다 늦으면 종료일을 시작일로 설정
      ...(date > (prev.careEndDate || '') && { careEndDate: date }),
    }));
  };

  const handleCareEndDateChange = (date: string) => {
    setFormData(prev => ({
      ...prev,
      careEndDate: date,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPet) {
      setSubmitMessage('동물 정보가 없습니다. 다시 시도해주세요.');
      return;
    }

    // 필수 필드 검증
    if (!formData.applicantInfo.name || !formData.applicantInfo.email || !formData.applicantInfo.phone || !formData.applicantInfo.address || !formData.reason) {
      setSubmitMessage('필수 항목을 모두 입력해주세요.');
      return;
    }

    // 돌봄 신청 시 날짜 필드 검증
    if (formData.applicationType === 'care' && (!formData.careStartDate || !formData.careEndDate)) {
      setSubmitMessage('돌봄 시작일과 종료일을 모두 입력해주세요.');
      return;
    }

    // 돌봄 종료일이 시작일보다 이전인지 검증
    if (formData.applicationType === 'care' && formData.careStartDate && formData.careEndDate) {
      if (formData.careEndDate < formData.careStartDate) {
        setSubmitMessage('돌봄 종료일은 시작일보다 늦어야 합니다.');
        return;
      }
    }

    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      if (formData.applicationType === 'adoption') {
        // 입양 신청
        await adoptionService.createAdoption({
          petId: selectedPet.id.toString(),
          title: `${selectedPet.name} 입양 신청`,
          message: formData.reason,
          anotherPets: formData.otherPets,
          experience: formData.experience,
          applicantInfo: formData.applicantInfo,
        });
      } else {
        // 돌봄 신청 - 날짜 필드가 이미 검증되었으므로 안전하게 변환
        const startDate = new Date(formData.careStartDate!);
        const endDate = new Date(formData.careEndDate!);
        
        await adoptionService.createCare({
          petId: selectedPet.id.toString(),
          title: `${selectedPet.name} 돌봄 신청`,
          message: formData.reason,
          desiredStartDate: startDate,
          desiredEndDate: endDate,
          anotherPets: formData.otherPets,
          experience: formData.experience,
          applicantInfo: formData.applicantInfo,
        });
      }

      setSubmitMessage('입양/돌봄 신청이 성공적으로 제출되었습니다!');
      
      setTimeout(() => {
        router.push('/profile?tab=history');
      }, 3000);
      
    } catch (error) {
      console.error('Adoption application failed:', error);
      setSubmitMessage('입양/돌봄 신청에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!petIdFromUrl) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="text-6xl mb-4">🐾</div>
          <h2 className="text-2xl font-bold mb-2">잘못된 접근입니다</h2>
          <p className="text-gray-500 mb-6">갤러리에서 동물을 선택한 후 신청해주세요.</p>
          <button 
            onClick={() => router.push('/gallery')} 
            className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            갤러리로 이동
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  if (!selectedPet && !submitMessage) {
    return <ErrorPage onBackToGallery={() => router.push('/gallery')} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">입양/돌봄 신청</h1>
          <p className="text-gray-600">입양/돌봄 신청서를 작성해주세요.</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          {selectedPet && <SelectedPetInfo pet={selectedPet} />}

          {submitMessage && !selectedPet ? (
            <div className="text-center py-8">
              <MessageDisplay message={submitMessage} />
              <div className="mt-6">
                <button 
                  onClick={() => router.push('/gallery')} 
                  className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                >
                  갤러리로 이동
                </button>
              </div>
            </div>
          ) : selectedPet ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <ApplicationTypeRadio 
                petStatuses={selectedPet?.petStatuses}
                selectedType={formData.applicationType}
                onTypeChange={handleApplicationTypeChange}
              />

              {/* 돌봄 신청 선택 시 날짜 입력란 표시 */}
              {formData.applicationType === 'care' && (
                <CareDateFields
                  startDate={formData.careStartDate || ''}
                  endDate={formData.careEndDate || ''}
                  onStartDateChange={handleCareStartDateChange}
                  onEndDateChange={handleCareEndDateChange}
                />
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField 
                  label="신청자 성함" 
                  name="applicantInfo.name" 
                  value={formData.applicantInfo.name} 
                  onChange={handleInputChange} 
                  required 
                />

                <FormField
                  label="이메일"
                  name="applicantInfo.email"
                  type="email"
                  value={formData.applicantInfo.email}
                  onChange={handleInputChange}
                  placeholder="이메일을 입력해주세요"
                  required
                />
              </div>

              <FormField
                label="연락처 (전화번호)"
                name="applicantInfo.phone"
                type="tel"
                value={formData.applicantInfo.phone}
                onChange={handleInputChange}
                placeholder="연락 가능한 전화번호를 입력해주세요"
                required
              />

              <FormField
                label="주소"
                name="applicantInfo.address"
                value={formData.applicantInfo.address}
                onChange={handleInputChange}
                placeholder="주소를 입력해주세요"
                required
              />

            <FormField
              label="현재 키우고 있는 다른 반려동물"
              name="otherPets"
              value={formData.otherPets}
              onChange={handleInputChange}
              placeholder="현재 키우고 있는 동물의 종류, 수를 입력해주세요"
            />

            <FormField
              label="반려동물 키우는 경험"
              name="experience"
              type="textarea"
              value={formData.experience}
              onChange={handleInputChange}
              placeholder="이전에 반려동물을 키운 경험이 있다면 간단히 설명해주세요."
              rows={3}
            />

            <FormField
              label="입양/돌봄하고 싶은 이유"
              name="reason"
              type="textarea"
              value={formData.reason}
              onChange={handleInputChange}
              placeholder="이 동물을 입양/돌봄하고 싶은 이유를 설명해주세요."
              required
              rows={3}
            />

            <MessageDisplay message={submitMessage} />

            <ActionButtons 
                petId={selectedPet.id} 
                isSubmitting={isSubmitting} 
                onSubmit={handleSubmit}
              />
            </form>
          ) : null}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function ApplyPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ApplyPageContent />
    </Suspense>
  );
} 