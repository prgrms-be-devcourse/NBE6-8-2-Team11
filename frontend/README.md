# 🐾 돌봄즈 (PetMatching) - 유기동물 입양 플랫폼

## 🎯 프로젝트 소개

**돌봄즈**는 유기동물과 입양희망자를 연결하는 따뜻한 플랫폼입니다. 
사랑스러운 반려동물들이 새로운 가족을 찾을 수 있도록 도와주는 서비스입니다.

### 🌟 핵심 가치
- **연결**: 유기동물과 입양희망자의 최적 매칭
- **투명성**: 동물과 보호소 정보의 투명한 공개
- **책임감**: 입양 후 관리와 책임 있는 반려동물 문화 조성
- **커뮤니티**: 입양인들의 경험 공유와 상담 지원

---

## 🛠️ 기술 스택

### Frontend
- **Framework**: Next.js 15.4.3 (App Router)
- **Language**: TypeScript 5.0+
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **Package Manager**: npm

### Backend (예정)
- **Framework**: Spring Boot 3.x
- **Language**: Java 21
- **Database**: MySQL 8.0
- **Security**: Spring Security + JWT
- **Build Tool**: Gradle

### Database Schema
- **Pet**: 동물 정보 관리
- **Shelter**: 보호소 정보 관리
- **Member**: 사용자 정보 관리
- **Adoption**: 입양 신청 관리
- **Care**: 임시 보호 신청 관리
- **Chat**: 채팅 시스템
- **Notification**: 알림 시스템

---

## 🏗️ 프로젝트 구조

### Frontend 구조
```
frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx           # 메인 페이지
│   │   ├── gallery/           # 갤러리 페이지
│   │   ├── layout.tsx         # 레이아웃
│   │   └── globals.css        # 전역 스타일
│   ├── shared/                # 공통 모듈
│   │   ├── components/        # 공통 컴포넌트
│   │   │   ├── layout/        # 레이아웃 컴포넌트
│   │   │   ├── ui/           # UI 컴포넌트
│   │   │   └── common/       # 공통 컴포넌트
│   │   ├── types/            # TypeScript 타입 정의
│   │   ├── constants/        # 상수 데이터
│   │   ├── utils/            # 유틸리티 함수
│   │   ├── hooks/            # 커스텀 훅
│   │   └── services/         # API 서비스
│   ├── features/             # 기능별 모듈
│   │   ├── home/             # 홈 기능
│   │   │   └── components/   # 홈 관련 컴포넌트
│   │   ├── gallery/          # 갤러리 기능
│   │   │   └── components/   # 갤러리 관련 컴포넌트
│   │   ├── auth/             # 인증 기능
│   │   ├── apply/            # 입양 신청 기능
│   │   └── profile/          # 프로필 기능
│   └── assets/               # 정적 자원
├── public/                   # 정적 파일
├── package.json              # 의존성 관리
└── next.config.ts           # Next.js 설정
```

### 주요 컴포넌트
- **Header**: 네비게이션 및 로그인 버튼
- **Footer**: 서비스 정보 및 연락처
- **HeroSection**: 메인 페이지 히어로 섹션
- **StatsSection**: 통계 정보 표시
- **ServicesSection**: 서비스 소개
- **GalleryPreview**: 갤러리 미리보기
- **CTASection**: 행동 유도 섹션
- **AnimalGrid**: 동물 카드 그리드
- **AnimalCard**: 개별 동물 카드
- **AnimalFilter**: 동물 필터링
- **AnimalSearch**: 동물 검색

---

## ✨ 주요 기능

### 🏠 메인 페이지
- **히어로 섹션**: 서비스 소개 및 CTA 버튼
- **통계 정보**: 입양 성과 및 서비스 현황
- **서비스 소개**: 주요 기능 안내
- **갤러리 미리보기**: 입양 가능한 동물 미리보기
- **행동 유도**: 입양 신청 유도

### 🐾 갤러리 페이지
- **동물 목록**: 입양 가능한 동물들의 카드 형태 표시
- **검색 기능**: 이름, 설명으로 실시간 검색
- **필터링**: 종류, 성별, 나이별 필터링
- **상세 정보**: 각 동물의 상세 정보 표시
- **입양 신청**: 관심 있는 동물에 대한 입양 신청

### 🔍 검색 및 필터링
- **실시간 검색**: 타이핑과 동시에 결과 업데이트
- **다중 필터**: 종류, 성별, 나이 동시 필터링
- **결과 카운트**: 필터링된 결과 수 표시
- **필터 초기화**: 모든 필터 한 번에 초기화

### 📱 반응형 디자인
- **모바일 최적화**: 모바일에서도 편리한 사용
- **태블릿 지원**: 태블릿 화면 최적화
- **데스크톱**: 대화면에서의 최적화된 레이아웃

---

## 🚀 설치 및 실행

### 필수 요구사항
- **Node.js**: 20.x LTS
- **npm**: 10.x 이상

### 설치 방법

```bash
# 1. 저장소 클론
git clone <repository-url>
cd frontend

# 2. 의존성 설치
npm install

# 3. 개발 서버 실행
npm run dev
```

### 사용 가능한 스크립트

```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start

# 린트 검사
npm run lint

# 타입 체크
npm run type-check
```

### 환경 변수 설정
```bash
# .env.local (선택사항)
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

---

## 🛠️ 개발 가이드

### Git Flow 전략
```
main (배포용)
├── develop (개발 메인)
    ├── feature/* (기능 개발)
    └── hotfix/* (긴급 수정)
```

### 브랜치 명명 규칙
- `feature/기능명`: 새로운 기능 개발
- `fix/버그명`: 버그 수정
- `hotfix/긴급수정`: 긴급 수정사항

### 커밋 컨벤션
```
<type>(<scope>): <subject>

feat(gallery): 동물 검색 기능 추가
fix(ui): 헤더 반응형 레이아웃 수정
docs(readme): 설치 가이드 업데이트
```

### 코드 스타일
- **TypeScript**: 엄격한 타입 체크
- **ESLint**: 코드 품질 관리
- **Prettier**: 코드 포맷팅
- **Tailwind CSS**: 유틸리티 퍼스트 CSS

---

## 📊 현재 구현 상태

### ✅ 완료된 기능
- [x] **메인 페이지**: 히어로, 통계, 서비스 소개
- [x] **갤러리 페이지**: 동물 목록, 검색, 필터링
- [x] **반응형 디자인**: 모바일, 태블릿, 데스크톱
- [x] **타입 안전성**: TypeScript 완전 적용
- [x] **Mock 데이터**: 6마리 동물, 3개 보호소
- [x] **컴포넌트 시스템**: 재사용 가능한 컴포넌트
- [x] **에러 처리**: Error Boundary 적용
- [x] **로딩 상태**: 스피너 및 로딩 UI

### 🚧 진행 중인 기능
- [ ] **상세 페이지**: 동물 상세 정보 페이지
- [ ] **입양 신청**: 입양 신청 폼 및 프로세스
- [ ] **사용자 인증**: 로그인/회원가입
- [ ] **프로필 페이지**: 사용자 프로필 관리

### 📋 예정된 기능
- [ ] **채팅 시스템**: 입양인과 보호소 간 소통
- [ ] **알림 시스템**: 입양 상태 알림
- [ ] **리뷰 시스템**: 입양 후기 및 평가
- [ ] **관리자 페이지**: 보호소 관리 기능

---

## 🔗 API 문서

### 현재 Mock 데이터 구조

#### Pet (동물 정보)
```typescript
interface Pet {
  id: number;
  name: string;
  species: string; // dog, cat, rabbit, bird, other
  age: number;
  gender: 'male' | 'female';
  description: string;
  imageUrl?: string;
  shelterId: number;
  memberIdCreatedBy: number;
  createdAt: Date;
}
```

#### Shelter (보호소 정보)
```typescript
interface Shelter {
  id: number;
  name: string;
  address: string;
  city: string;
  state?: string;
  zipCode?: string;
  phone?: string;
  createdAt: Date;
}
```

#### Member (사용자 정보)
```typescript
interface Member {
  id: number;
  member: string; // username
  email: string;
  password: string;
  name: string;
  role: 'user' | 'admin' | 'shelter_manager';
  phone?: string;
  createdAt: Date;
}
```