# 🐾 돌봄즈 (DolBömZ) - 유기동물 입양 플랫폼

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
- **Styling**: Tailwind CSS 3.4.15
- **State Management**: Zustand 5.0.7 + React Context
- **HTTP Client**: Axios 1.11.0
- **Real-time Communication**: SockJS + STOMP
- **Date Handling**: date-fns 4.1.0
- **Package Manager**: npm

### Backend Integration
- **API Base URL**: `http://localhost:8080` (기본값)
- **Authentication**: JWT Token 기반
- **CORS**: Cross-Origin Resource Sharing 지원
- **WebSocket**: 실시간 채팅 및 알림

### Development Tools
- **Linting**: ESLint 9.x
- **Build Tool**: Next.js Turbopack
- **Containerization**: Docker
- **Deployment**: Vercel 지원

---

## 🏗️ 프로젝트 구조

### Frontend 구조
```
frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx           # 메인 페이지
│   │   ├── layout.tsx         # 루트 레이아웃
│   │   ├── globals.css        # 전역 스타일
│   │   ├── login/             # 로그인 페이지
│   │   ├── signup/            # 회원가입 페이지
│   │   ├── gallery/           # 갤러리 페이지
│   │   ├── pets/              # 펫 관리 페이지
│   │   ├── profile/           # 프로필 페이지
│   │   ├── apply/             # 입양 신청 페이지
│   │   ├── admin/             # 관리자 페이지
│   │   ├── allchat/           # 채팅 페이지
│   │   ├── oauth2/            # OAuth2 인증
│   │   ├── help/              # 도움말 페이지
│   │   ├── faq/               # FAQ 페이지
│   │   └── contact/           # 연락처 페이지
│   ├── context/               # React Context
│   │   ├── AuthContext.tsx    # 인증 상태 관리
│   │   └── MemberTypeContext.tsx # 멤버 타입 관리
│   ├── features/              # 기능별 모듈
│   │   ├── home/              # 홈 기능
│   │   ├── gallery/           # 갤러리 기능
│   │   ├── auth/              # 인증 기능
│   │   ├── apply/             # 입양 신청 기능
│   │   └── profile/           # 프로필 기능
│   ├── shared/                # 공통 모듈
│   │   ├── components/        # 공통 컴포넌트
│   │   │   ├── layout/        # 레이아웃 컴포넌트
│   │   │   ├── ui/           # UI 컴포넌트
│   │   │   └── common/       # 공통 컴포넌트
│   │   ├── types/            # TypeScript 타입 정의
│   │   ├── constants/        # 상수 데이터
│   │   ├── utils/            # 유틸리티 함수
│   │   ├── hooks/            # 커스텀 훅
│   │   ├── services/         # API 서비스
│   │   └── lib/              # 라이브러리 설정
│   └── assets/               # 정적 자원
├── public/                   # 정적 파일
├── package.json              # 의존성 관리
├── next.config.ts           # Next.js 설정
├── tailwind.config.js       # Tailwind CSS 설정
├── Dockerfile               # Docker 설정
└── vercel.json              # Vercel 배포 설정
```

### 주요 컴포넌트
- **Header**: 네비게이션, 로그인 상태, 알림 시스템
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

### 🔐 인증 시스템
- **JWT 기반 인증**: Access Token + Refresh Token
- **OAuth2 지원**: 소셜 로그인 연동
- **자동 토큰 갱신**: 만료 시 자동 갱신
- **로그인 상태 유지**: 페이지 새로고침 시에도 유지
- **권한 관리**: USER, ADMIN 역할 구분

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

### 👤 사용자 관리
- **회원가입**: 이메일 기반 회원가입
- **프로필 관리**: 사용자 정보 수정
- **입양 이력**: 입양 신청 내역 조회
- **관리자 기능**: 펫 등록, 사용자 관리

### 💬 실시간 채팅
- **WebSocket 연결**: SockJS + STOMP 프로토콜
- **실시간 메시징**: 입양인과 보호소 간 소통
- **알림 시스템**: 새 메시지 알림
- **연결 상태 관리**: 자동 재연결

### �� 검색 및 필터링
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
- **Docker**: 컨테이너 실행 시 (선택사항)

### 설치 방법

```bash
# 1. 저장소 클론
git clone <repository-url>
cd frontend

# 2. 의존성 설치
npm install

# 3. 환경 변수 설정 (선택사항)
cp .env.example .env.local
# .env.local 파일에서 API URL 설정

# 4. 개발 서버 실행
npm run dev
```

### 사용 가능한 스크립트

```bash
# 개발 서버 실행 (Turbopack 사용)
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start

# 린트 검사
npm run lint
```

### 환경 변수 설정
```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### Docker 실행
```bash
# Docker 이미지 빌드
docker build -t dolbomz-frontend .

# Docker 컨테이너 실행
docker run -p 3000:3000 dolbomz-frontend
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
- **Tailwind CSS**: 유틸리티 퍼스트 CSS
- **Component Structure**: Feature-based 구조

---

## 📊 현재 구현 상태

### ✅ 완료된 기능
- [x] **인증 시스템**: JWT 기반 로그인/회원가입
- [x] **메인 페이지**: 히어로, 통계, 서비스 소개
- [x] **갤러리 페이지**: 동물 목록, 검색, 필터링
- [x] **사용자 관리**: 프로필, 입양 이력
- [x] **펫 관리**: 펫 등록, 수정, 삭제 (관리자)
- [x] **실시간 채팅**: WebSocket 기반 메시징
- [x] **알림 시스템**: 실시간 알림
- [x] **반응형 디자인**: 모바일, 태블릿, 데스크톱
- [x] **타입 안전성**: TypeScript 완전 적용
- [x] **API 통합**: 백엔드 API 연동
- [x] **컴포넌트 시스템**: 재사용 가능한 컴포넌트
- [x] **에러 처리**: Error Boundary 적용
- [x] **로딩 상태**: 스피너 및 로딩 UI
- [x] **Docker 지원**: 컨테이너화
- [x] **OAuth2**: 소셜 로그인 준비

### 🚧 진행 중인 기능
- [ ] **입양 신청 프로세스**: 상세 신청 폼
- [ ] **관리자 대시보드**: 통계 및 관리 기능
- [ ] **파일 업로드**: 이미지 업로드 시스템
- [ ] **SEO 최적화**: 메타 태그 및 검색 최적화

### 📋 예정된 기능
- [ ] **리뷰 시스템**: 입양 후기 및 평가
- [ ] **결제 시스템**: 입양 수수료 결제
- [ ] **지도 통합**: 보호소 위치 표시
- [ ] **PWA 지원**: Progressive Web App
- [ ] **다국어 지원**: 국제화 (i18n)

---

## 🔗 API 문서

### 주요 API 엔드포인트

#### 인증 관련
- `POST /api/auth/login` - 로그인
- `POST /api/auth/signup` - 회원가입
- `POST /api/auth/refresh` - 토큰 갱신
- `GET /api/auth/me` - 현재 사용자 정보

#### 펫 관련
- `GET /api/pets` - 펫 목록 조회
- `GET /api/pets/{id}` - 펫 상세 정보
- `POST /api/pets` - 펫 등록 (관리자)
- `PUT /api/pets/{id}` - 펫 정보 수정
- `DELETE /api/pets/{id}` - 펫 삭제

#### 입양 관련
- `POST /api/adoptions` - 입양 신청
- `GET /api/adoptions/my` - 내 입양 신청 목록
- `PUT /api/adoptions/{id}/status` - 입양 상태 변경

#### 채팅 관련
- `GET /api/chat/rooms` - 채팅방 목록
- `GET /api/chat/rooms/{id}/messages` - 메시지 목록
- `POST /api/chat/rooms/{id}/messages` - 메시지 전송

### 데이터 타입

#### Pet (동물 정보)
```typescript
interface Pet {
  id: number;
  petOwnerId: number;
  name: string;
  species: string;
  age: number;
  gender: 'MALE' | 'FEMALE';
  description: string;
  imageUrl?: string;
  createdAt: string;
  shelterName?: string;
  petStatuses?: string[];
}
```

#### Member (사용자 정보)
```typescript
interface Member {
  id: number;
  member: string;
  email: string;
  password: string;
  name: string;
  role: 'USER' | 'ADMIN';
  phone?: string;
  createdAt: string;
  address?: string;
}
```

#### Adoption (입양 신청)
```typescript
interface Adoption {
  id: number;
  memberId: number;
  petId: number;
  message: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}
```

---

## 🐳 Docker 배포

### 프로덕션 빌드
```bash
# 멀티 스테이지 빌드로 최적화된 이미지 생성
docker build -t dolbomz-frontend:latest .

# 컨테이너 실행
docker run -d \
  --name dolbomz-frontend \
  -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=http://your-api-server:8080 \
  dolbomz-frontend:latest
```

### Docker Compose (개발 환경)
```yaml
version: '3.8'
services:
  frontend:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:8080
    depends_on:
      - backend
```

---

## 📈 성능 최적화

### Next.js 최적화
- **App Router**: 최신 Next.js 라우팅 시스템
- **Turbopack**: 빠른 개발 서버
- **Image Optimization**: Next.js Image 컴포넌트
- **Code Splitting**: 자동 코드 분할
- **Static Generation**: 정적 사이트 생성

### 프론트엔드 최적화
- **Bundle Analysis**: 번들 크기 최적화
- **Lazy Loading**: 컴포넌트 지연 로딩
- **Memoization**: React.memo, useMemo 활용
- **Virtual Scrolling**: 대용량 리스트 최적화

---

## 🔒 보안

### 인증 보안
- **JWT 토큰**: 안전한 토큰 기반 인증
- **토큰 만료**: 자동 만료 및 갱신
- **HTTPS**: 프로덕션 환경에서 HTTPS 강제
- **CORS**: Cross-Origin 요청 제한

### 데이터 보안
- **입력 검증**: 클라이언트/서버 양쪽 검증
- **XSS 방지**: React의 기본 XSS 방지
- **CSRF 방지**: 토큰 기반 CSRF 방지
- **환경 변수**: 민감한 정보 환경 변수 관리

---

## 🤝 기여하기

### 개발 환경 설정
1. 저장소 포크
2. 개발 브랜치 생성
3. 기능 개발
4. 테스트 작성
5. Pull Request 생성

### 코드 리뷰
- 모든 PR은 코드 리뷰 필수
- 테스트 코드 작성 권장
- 문서 업데이트 포함

---

## 📞 지원 및 문의

### 개발팀
- **프론트엔드**: Next.js, TypeScript, Tailwind CSS
- **백엔드**: Spring Boot, Java, MySQL
- **DevOps**: Docker, Vercel

### 연락처
- **이슈 리포트**: GitHub Issues
- **문의사항**: 프로젝트 관리자에게 연락

---

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

---

## 🙏 감사의 말

- **Next.js 팀**: 훌륭한 프레임워크 제공
- **Tailwind CSS**: 효율적인 CSS 프레임워크
- **TypeScript**: 타입 안전성 제공
- **오픈소스 커뮤니티**: 다양한 라이브러리 제공