# Mock 데이터 삭제 및 Backend API 교체 계획

## 📋 Mock 데이터 삭제 및 API 교체 순서


## 수정사항
```
1. animalService -> petService 로 변경
2. notification.ts -> [0731] 추가

```

### **1단계: API 클라이언트 및 타입 준비**
```
1. src/shared/services/ 에 API 엔드포인트 함수들 생성
   - petService.ts (이미 존재) - [0730] 완료
   - shelterService.ts (신규) - [0730] 컨트롤러 없음 - 생략
   - memberService.ts (신규) - [0730] 완료
   - adoptionService.ts (신규) - [0730] 완료
   - careService.ts (신규) - [0730] adoptionService.ts 에 병합 (1줄) 완료
   - chatService.ts (신규) - [0730] 혜민님이 담당해주시기로 함 (추후 추가)

2. src/shared/types/ 에 Backend 응답 타입 정의
   - Backend API 응답 구조에 맞는 인터페이스 생성
```

### **2단계: 중앙 Mock 데이터 삭제** [0731] 완료
```
1. src/shared/constants/index.ts 
   - MOCK_SHELTERS 삭제
   - MOCK_MEMBERS 삭제  
   - MOCK_PETS 삭제
   - MOCK_ADOPTIONS 삭제
   - MOCK_CARES 삭제
   - (NAV_ITEMS, SERVICE_CARDS, STATS_DATA 등은 유지)
```

### **3단계: 페이지별 Mock 데이터 교체**

#### **3-1. 갤러리 페이지** [0731] 완료
```
1. src/app/gallery/page.tsx
   - MOCK_PETS import 삭제
   - animalService.getAnimals() 호출로 교체

2. src/app/gallery/[id]/page.tsx  
   - MOCK_PETS, MOCK_SHELTERS import 삭제
   - animalService.getAnimalById() 호출로 교체
   - shelterService.getShelterById() 호출로 교체

3. src/features/gallery/components/GalleryPreview.tsx
   - MOCK_PETS import 삭제
   - props로 받은 데이터 사용하도록 변경
```

#### **3-2. 입양 신청 페이지** [0731] 완료 
```
1. src/app/apply/page.tsx
   - MOCK_PETS, MOCK_SHELTERS import 삭제
   - animalService.getAnimalById() 호출로 교체
   - shelterService.getShelters() 호출로 교체
   - adoptionService.createAdoption() 호출로 교체
```

#### **3-3. 프로필 페이지** [0731] 동하님 작업중...
```
1. src/app/profile/page.tsx
   - mockUser 하드코딩 데이터 삭제
   - memberService.getCurrentUser() 호출로 교체

2. src/features/profile/components/AdoptionHistory.tsx
   - mockRecords 하드코딩 데이터 삭제
   - adoptionService.getUserAdoptions() 호출로 교체
```

#### **3-4. 로그인,회원가입 페이지** [0731] 완료
```
```

#### **3-5. 채팅 페이지**
```
1. src/app/allchat/page.tsx
   - messages, chatRooms 하드코딩 데이터 삭제
   - chatService.getChatRooms() 호출로 교체
   - chatService.getMessages() 호출로 교체
   - chatService.sendMessage() 호출로 교체
```

### **4단계: 에러 처리 및 로딩 상태 개선**
```
1. 각 페이지에 에러 바운더리 추가
2. 로딩 스피너 개선
3. API 호출 실패 시 사용자 친화적 메시지 표시
4. 재시도 기능 추가
```

### **5단계: 인증 및 권한 처리**
```
1. src/shared/components/layout/Header.tsx
   - localStorage 기반 인증 → API 기반 인증으로 교체
   - memberService.getCurrentUser() 호출

2. 보호된 라우트 설정
   - 로그인 필요 페이지들에 인증 체크 추가
```

### **6단계: 최종 정리**
```
1. 사용하지 않는 import 정리
2. 타입 정의 최종 확인
3. API 응답 구조와 프론트엔드 타입 일치 확인
4. 테스트 및 검증
```

## 🎯 권장 실행 순서

**1순위**: API 클라이언트 준비 → 갤러리 페이지  
**2순위**: 프로필 페이지 → 입양 신청 페이지  
**3순위**: 채팅 페이지 → 인증 시스템  
**4순위**: 에러 처리 → 최종 정리

이 순서로 진행하면 의존성이 적은 페이지부터 시작해서 점진적으로 교체할 수 있습니다!

## 📁 현재 Mock 데이터가 있는 파일 목록

### 1. **중앙 Mock 데이터 파일**
- **`src/shared/constants/index.ts`** - 메인 Mock 데이터 저장소
  - `MOCK_SHELTERS` - 보호소 데이터 (3개)
  - `MOCK_MEMBERS` - 사용자 데이터 (3명)
  - `MOCK_PETS` - 동물 데이터 (6마리)
  - `MOCK_ADOPTIONS` - 입양 신청 데이터 (2건)
  - `MOCK_CARES` - 임시 보호 신청 데이터 (1건)

### 2. **컴포넌트별 Mock 데이터**

#### **프로필 관련**
- **`src/app/profile/page.tsx`** - 사용자 프로필 Mock 데이터
- **`src/features/profile/components/AdoptionHistory.tsx`** - 입양 이력 Mock 데이터

#### **채팅 관련**
- **`src/app/allchat/page.tsx`** - 채팅방 및 메시지 Mock 데이터

### 3. **Mock 데이터를 사용하는 파일들**
- **`src/app/gallery/page.tsx`** - `MOCK_PETS` 사용
- **`src/app/gallery/[id]/page.tsx`** - `MOCK_PETS`, `MOCK_SHELTERS` 사용
- **`src/app/apply/page.tsx`** - `MOCK_PETS`, `MOCK_SHELTERS` 사용
- **`src/features/gallery/components/GalleryPreview.tsx`** - `MOCK_PETS` 사용

## 📊 Mock 데이터 요약
- **보호소**: 3개
- **사용자**: 3명 (관리자, 보호소 관리자, 일반 사용자)
- **동물**: 6마리 (강아지 2마리, 고양이 2마리, 토끼 1마리, 새 1마리)
- **입양 신청**: 2건
- **임시 보호 신청**: 1건
- **채팅방**: 2개
- **메시지**: 3개

이 모든 Mock 데이터는 실제 API 연동 전까지 개발 및 테스트에 사용됩니다! 