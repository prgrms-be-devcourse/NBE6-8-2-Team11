'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type MemberType = 'adopter' | 'shelter';

interface TempFormData {
  name?: string;
  phone?: string;
  address?: string;
  bio?: string;
}

interface MemberTypeContextType {
  memberType: MemberType | null;
  setMemberType: (type: MemberType) => void;
  getMemberType: (fallback?: MemberType) => MemberType;
  tempFormData: TempFormData;
  setTempFormData: (data: TempFormData) => void;
  clearTempFormData: () => void;
}

const MemberTypeContext = createContext<MemberTypeContextType | undefined>(undefined);

interface MemberTypeProviderProps {
  children: ReactNode;
}

export function MemberTypeProvider({ children }: MemberTypeProviderProps) {
  const [memberType, setMemberTypeState] = useState<MemberType | null>(null);
  const [tempFormData, setTempFormDataState] = useState<TempFormData>({});

  // 컴포넌트 마운트 시 localStorage에서 값 복원
  useEffect(() => {
    const savedMemberType = localStorage.getItem('memberType') as MemberType | null;
    if (savedMemberType && (savedMemberType === 'adopter' || savedMemberType === 'shelter')) {
      setMemberTypeState(savedMemberType);
    }

    // 임시 폼 데이터도 복원
    const savedTempFormData = localStorage.getItem('tempFormData');
    if (savedTempFormData) {
      try {
        setTempFormDataState(JSON.parse(savedTempFormData));
      } catch (e) {
        console.error('Failed to parse temp form data:', e);
      }
    }
  }, []);

  const setMemberType = (type: MemberType) => {
    setMemberTypeState(type);
    localStorage.setItem('memberType', type);
    console.log('MemberType updated:', type);
  };

  const setTempFormData = (data: TempFormData) => {
    setTempFormDataState(data);
    localStorage.setItem('tempFormData', JSON.stringify(data));
  };

  const clearTempFormData = () => {
    setTempFormDataState({});
    localStorage.removeItem('tempFormData');
  };

  // Context 우선, fallback 백업, 기본값 순서로 반환하는 헬퍼 함수
  const getMemberType = (fallback?: MemberType): MemberType => {
    return memberType || fallback || 'adopter';
  };

  return (
    <MemberTypeContext.Provider value={{
      memberType,
      setMemberType,
      getMemberType,
      tempFormData,
      setTempFormData,
      clearTempFormData
    }}>
      {children}
    </MemberTypeContext.Provider>
  );
}

export function useMemberType() {
  const context = useContext(MemberTypeContext);
  if (context === undefined) {
    throw new Error('useMemberType must be used within a MemberTypeProvider');
  }
  return context;
}