'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '../../shared/components/layout/Header';
import Footer from '../../shared/components/layout/Footer';
import { Pet, PetStatusType } from '../../shared/types';
import { formatAnimalAge, formatAnimalGender, formatAnimalSpecies } from '../../shared/utils';
import { petService } from '../../shared/services/petService';
import { adoptionService } from '../../shared/services/adoptionService';
import Image from 'next/image';

interface AdoptionFormData {
  petId: number;
  title: string;

  contactPhone: string;
  contactEmail: string;
  address: string;
  experience: string;
  familyMembers: string;
  anotherPets: string;
  message: string;
  type: 'AVAILABLE_FOR_ADOPTION' | 'AVAILABLE_FOR_CARE';
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
      type="button"
      onClick={() => window.location.href = `/chat?petId=${petId}`}
      className="w-full py-3 px-6 rounded-lg font-semibold text-lg border-2 border-orange-500 text-orange-500 hover:bg-orange-50 transition-colors"
    >
      상담하기
    </button>
    
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
  petStatuses?: PetStatusType[]; 
  selectedType: 'adoption' | 'care'; 
  onTypeChange: (type: 'adoption' | 'care') => void; 
}) => {
  // 상태에 따른 라디오 버튼 활성화 여부 결정
  const canAdopt = petStatuses?.some((status: PetStatusType) => 
    status === 'AVAILABLE_FOR_ADOPTION' || status === 'AVAILABLE_BOTH'
  );
  const canCare = petStatuses?.some((status: PetStatusType) => 
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
    title: '',
    contactPhone: '',
    contactEmail: '',
    address: '',
    experience: '',
    familyMembers: '',
    anotherPets: '',
    message: '',
    type: 'AVAILABLE_FOR_ADOPTION',
    careStartDate: '',
    careEndDate: '',
  });

  useEffect(() => {
    const loadPetData = async () => {
      try {
        setIsLoading(true);
        
        if (petIdFromUrl) {
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
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAdoptionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPet) {
      setSubmitMessage('동물 정보가 없습니다. 다시 시도해주세요.');
      return;
    }

    // 필수 필드 검증
    if (!formData.contactName || !formData.contactEmail || !formData.contactPhone || !formData.address || !formData.reason) {
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
      if (formData.type === 'AVAILABLE_FOR_ADOPTION') {
        // 입양 신청 API 호출
        await adoptionService.createAdoption({
          petId: selectedPet.id.toString(),
          title: formData.title,
          message: formData.message,
          anotherPets: formData.anotherPets,
          experience: formData.experience
        });
        setSubmitMessage('입양 신청이 성공적으로 제출되었습니다!');
      } else if (formData.type === 'AVAILABLE_FOR_CARE') {
        // 돌봄 신청 API 호출
        await adoptionService.createCare({
          petId: selectedPet.id.toString(),
          message: formData.message,
          title: formData.title,
          desiredStartDate: new Date(formData.careStartDate!),
          desiredEndDate: new Date(formData.careEndDate!),
          anotherPets: formData.anotherPets,
          experience: formData.experience
        });
        setSubmitMessage('돌봄 신청이 성공적으로 제출되었습니다!');
      }
      
      setTimeout(() => {
        router.push('/profile');
      }, 3000);
      
    } catch (error) {
      console.error('Application failed:', error);
      setSubmitMessage('신청에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToGallery = () => {
    router.push('/gallery');
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!selectedPet) {
    return <ErrorPage onBackToGallery={handleBackToGallery} />;
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
          {/* 선택된 동물 정보 */}
          <div className="mb-8 pb-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">입양/돌봄 신청 동물</h2>
            <div className="flex items-center space-x-4">
              {selectedPet.imageUrl && (
                <div className="w-24 h-24 relative rounded-lg overflow-hidden">
                  <Image
                    src={selectedPet.imageUrl.split('?')[0]}
                    alt={selectedPet.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{selectedPet.name}</h3>
                <p className="text-sm text-gray-600 mb-2">
                  {formatAnimalSpecies(selectedPet.species)} • {formatAnimalAge(selectedPet.age)} • {formatAnimalGender(selectedPet.gender)}
                </p>
                {selectedPet.shelterName ? (
                  <p className="text-sm text-gray-500">보호소: {selectedPet.shelterName}</p>
                ) : (
                  <p className="text-sm text-gray-500">보호소 정보 없음</p>
                )}
              </div>
            </div>
          </div>

          {/* 입양 신청서 폼 */}
          <form onSubmit={handleAdoptionSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 입양/돌봄 선택 */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  신청 유형
                </label>
                <div className="flex space-x-6">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="type"
                      value="AVAILABLE_FOR_ADOPTION"
                      checked={formData.type === 'AVAILABLE_FOR_ADOPTION'}
                      onChange={(e) => setFormData({...formData, type: e.target.value as 'AVAILABLE_FOR_ADOPTION' | 'AVAILABLE_FOR_CARE'})}
                      className="mr-2"
                    />
                    <span>입양</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="type"
                      value="AVAILABLE_FOR_CARE"
                      checked={formData.type === 'AVAILABLE_FOR_CARE'}
                      onChange={(e) => setFormData({...formData, type: e.target.value as 'AVAILABLE_FOR_ADOPTION' | 'AVAILABLE_FOR_CARE'})}
                      className="mr-2"
                    />
                    <span>돌봄</span>
                  </label>
                </div>
              </div>

              {/* 돌봄 기간 선택 (돌봄 선택 시에만 표시) */}
              {formData.type === 'AVAILABLE_FOR_CARE' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      돌봄 시작일
                    </label>
                    <input
                      type="date"
                      name="careStartDate"
                      value={formData.careStartDate}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required={formData.type === 'AVAILABLE_FOR_CARE'}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      돌봄 종료일
                    </label>
                    <input
                      type="date"
                      name="careEndDate"
                      value={formData.careEndDate}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required={formData.type === 'AVAILABLE_FOR_CARE'}
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  연락처 (전화번호)
                </label>
                <input
                  type="tel"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="010-1234-5678"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  이메일
                </label>
                <input
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="example@email.com"
                  required
                />
              </div>
            </div>

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

             <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  현재 키우고 있는 다른 반려동물
                </label>
                <input
                  type="text"
                  name="anotherPets"
                  value={formData.anotherPets}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="없음 또는 현재 키우고 있는 동물"
                />
              </div>
            </div>

            <div> 
              <label className="block text-sm font-medium text-gray-700 mb-2">
                반려동물 키우는 경험
              </label>
              <textarea
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                placeholder="이름을 입력해주세요"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                입양하고 싶은 이유
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="이메일을 입력해주세요"
                required
              />
            </div>

            <FormField
              label="연락처 (전화번호)"
              name="contactPhone"
              type="tel"
              value={formData.contactPhone}
              onChange={handleInputChange}
              placeholder="연락 가능한 전화번호를 입력해주세요"
              required
            />

            <div className="pt-6 border-t border-gray-200 space-y-4">
              
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-colors ${
                  isSubmitting
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-orange-500 text-white hover:bg-orange-600'
                }`}
              >
                {isSubmitting ? '제출 중...' : '입양 신청하기'}
              </button>
            </div>
          </form>
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
