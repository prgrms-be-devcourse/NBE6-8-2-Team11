# 배포 자동화 프로젝트 진행 상황

## 프로젝트 개요
- **목표**: 협업 프로젝트의 CI/CD 파이프라인 구축 및 실제 서비스 배포
- **현재 상태**: Railway + Vercel 배포 진행 중 - PostgreSQL 드라이버 오류 해결 중
- **배포 전략**: Railway + Vercel (서버리스) + Docker + AWS (학습용)

## Phase 1 완료 사항
✅ **CI 파이프라인 구축 완료**
✅ **Docker 초기 환경 설정 구축**
- 다른 팀원들의 로직 손상 없이 안전하게 진행
- 기본 Docker 설정 완료

## Phase 2 완료 사항
✅ **전체 코드 리뷰 완료** (수정 없이 읽기만)
✅ **CD 워크플로우 구축 완료**
   - GitHub Actions CD 파이프라인 생성 (.github/workflows/cd.yml)
   - GitHub Container Registry 연동
   - 자동 Docker 이미지 빌드 및 배포
   - 배포 완료 알림 시스템

✅ **GitHub Codespaces 환경 설정 완료**
   - .devcontainer/devcontainer.json 설정
   - 자동 개발 환경 구축 스크립트 (.devcontainer/setup.sh)
   - Codespaces 최적화된 Docker Compose (docker-compose.codespaces.yml)
   - Codespaces용 환경 변수 (.env.codespaces)

✅ **배포 스크립트 및 도구 완성**
   - Codespaces 배포 스크립트 (scripts/deploy-codespaces.sh)
   - 헬스체크 및 모니터링 기능
   - 자동 롤백 기능

✅ **릴리즈 브랜치 전략 구축**
   - release/* 브랜치 자동 배포 (.github/workflows/cd-release.yml)
   - 단계별 안전한 배포 프로세스 (develop → release → main)

## Phase 3 진행 중
🔄 **Railway + Vercel 서버리스 배포** (메인 전략)

### 완료된 작업
✅ **백엔드 Railway 설정**
   - application-railway.yml 생성 (PostgreSQL 지원)
   - CORS 설정 추가 (Vercel 도메인 허용)
   - railway.toml 및 nixpacks.toml 설정
   - PostgreSQL 드라이버 추가 (implementation)

✅ **프론트엔드 Vercel 설정**
   - vercel.json 설정 (보안 헤더, 리라이트 규칙)
   - .env.production 환경 변수 템플릿
   - API 클라이언트 환경 변수 기반 URL 설정

✅ **Railway 인프라 구축**
   - Railway 프로젝트 생성 (independent-vitality)
   - GitHub 저장소 연동 (develop 브랜치)
   - Root Directory: backend 설정
   - PostgreSQL 데이터베이스 추가 (같은 프로젝트 내)
   - 공개 도메인 생성: https://nbe6-8-2-team11-production.up.railway.app

### 현재 해결 중인 이슈
🔄 **PostgreSQL 드라이버 로딩 오류**
   
**문제 상황:**
```
Failed to load driver class org.postgresql.Driver in either of HikariConfig class loader or Thread context classloader
```

**시도한 해결책들:**
1. ✅ PostgreSQL 의존성을 `runtimeOnly` → `implementation`으로 변경
2. ✅ application-railway.yml에서 DATABASE_URL에 `jdbc:` 프리픽스 추가
3. ✅ Redis 설정 비활성화 (충돌 방지)
4. ✅ SQL 초기화 모드를 `never`로 설정
5. ✅ Variables에서 중복 환경 변수 제거

**현재 환경 변수 설정:**
```bash
# 핵심 설정
SPRING_PROFILES_ACTIVE=railway
DATABASE_URL=jdbc:postgresql://postgres:xxxxx@containers-us-west-xxx.railway.app:xxxx/railway
PORT=8080

# JWT 설정
JWT_SECRET=myVeryLongSecretKeyForJWTTokenGenerationThatIsAtLeast256BitsLongAndSecureEnoughForProductionUse123456789
JWT_ACCESS_TOKEN_EXPIRATION=PT15M
JWT_REFRESH_TOKEN_EXPIRATION=PT168H

# OAuth (선택사항)
KAKAO_CLIENT_ID=a55fbac2b1ec1017835ea67b2a584ad5
```

**build.gradle.kts 현재 상태:**
```kotlin
// PostgreSQL 의존성
implementation("org.postgresql:postgresql")  // runtimeOnly에서 변경됨
```

### 다음 시도할 해결책
1. 🔄 Gradle 캐시 클리어를 위한 clean build 강제
2. 🔄 Railway Nixpacks 설정에서 Java 버전 명시
3. 🔄 PostgreSQL 드라이버 버전 명시적 지정
4. 🔄 H2 데이터베이스로 임시 전환 후 PostgreSQL 재연결

## Phase 4 계획 (병행)
📋 **Docker + AWS 배포** (학습용)
   - AWS EC2 프리티어 설정
   - Docker 기반 배포 파이프라인
   - 포트폴리오 및 학습 목적

## 배포 환경 구조

### 현재 구축된 환경
```
개발 환경:
├── 로컬 Docker (기존 팀원 환경 보호)
├── GitHub Codespaces (클라우드 개발)
└── 로컬 H2 DB (간단한 개발)

배포 환경:
├── Railway + Vercel (메인 서비스) - 구축 중 (PostgreSQL 이슈)
├── Docker + AWS (학습용) - 계획됨
└── 릴리즈 테스트 환경 (release/* 브랜치)
```

### Railway 인프라 상세
```
Railway 프로젝트: independent-vitality
├── NBE6-8-2-Team11 (백엔드 서비스)
│   ├── GitHub: prgrms-be-devcourse/NBE6-8-2-Team11
│   ├── Branch: develop
│   ├── Root Directory: backend
│   ├── Build: Nixpacks (Java 21)
│   └── Domain: https://nbe6-8-2-team11-production.up.railway.app
└── PostgreSQL (데이터베이스)
    ├── 자동 생성된 DATABASE_URL
    └── 내부 네트워크 연결
```

## 팀원 로직 보호 현황

### ✅ **100% 안전 보장**
- 모든 백엔드 도메인 로직 (Member, Pet, Adoption, Care, Chat, Notification, Shelter) 무변경
- 모든 프론트엔드 컴포넌트 및 페이지 로직 무변경
- 기존 개발 환경 (Docker, 로컬) 그대로 유지
- API 엔드포인트 구조 동일

### ✅ **추가된 기능 (기존에 영향 없음)**
- Railway/Vercel 배포 설정 (선택사항)
- 환경 변수 기반 URL 설정 (기본값 존재)
- CORS 설정 (기존 로컬 개발 포함)

## 주요 완성 파일 목록

### CI/CD 파이프라인
- `.github/workflows/ci.yml` - 기존 CI (PR 테스트)
- `.github/workflows/cd.yml` - main 브랜치 프로덕션 배포
- `.github/workflows/cd-release.yml` - 릴리즈 브랜치 배포

### Railway + Vercel 설정
- `backend/src/main/resources/application-railway.yml` - Railway 환경 설정
- `backend/src/main/java/com/back/global/security/SecurityConfig.java` - CORS 설정 (Vercel 도메인 포함)
- `railway.toml` - Railway 배포 설정
- `backend/nixpacks.toml` - Nixpacks 빌드 설정
- `frontend/vercel.json` - Vercel 배포 설정
- `frontend/.env.production` - Vercel 환경 변수

### 개발 환경
- `.devcontainer/devcontainer.json` - Codespaces 설정
- `docker-compose.codespaces.yml` - Codespaces용 Docker
- `scripts/deploy-codespaces.sh` - Codespaces 배포 스크립트

### 문서
- `TEAM_ONBOARDING_GUIDE.md` - 팀원용 가이드
- `CD_SETUP_COMPLETE.md` - CD 구축 완료 가이드
- `DEPLOYMENT_PROGRESS.md` - 이 파일

## 현재 이슈 및 해결 전략

### 🔧 **PostgreSQL 드라이버 오류 상세 분석**

**오류 유형:** ClassLoader에서 PostgreSQL 드라이버를 찾지 못함
```
Failed to load driver class org.postgresql.Driver in either of HikariConfig class loader or Thread context classloader
```

**가능한 원인들:**
1. **Nixpacks 빌드 과정에서 PostgreSQL 드라이버 누락**
2. **Java 21 환경에서 드라이버 호환성 문제**
3. **Railway의 ClassLoader 경로 문제**
4. **Gradle 빌드 시 의존성 누락**

**해결 시도 이력:**
- [x] `runtimeOnly` → `implementation` 변경
- [x] Variables 환경 변수 중복 제거
- [x] DATABASE_URL에 jdbc: 프리픽스 추가
- [x] Redis 설정 비활성화
- [x] SQL 초기화 모드 never로 설정
- [ ] 드라이버 버전 명시적 지정 (다음 시도)
- [ ] Nixpacks 설정 최적화 (다음 시도)
- [ ] H2 임시 전환 후 재연결 (최후 수단)

## 주의사항

### ⚠️ **팀원들을 위한 안내**
- 기존 개발 방식 그대로 사용 가능
- Docker 환경은 그대로 유지
- 새로운 배포 환경은 추가 옵션
- 모든 기존 로직 100% 보호됨

### ⚠️ **배포 환경 구분**
- 개발: 기존 방식 (Docker/로컬)
- 테스트: Railway + Vercel (구축 중)
- 학습: Docker + AWS (계획)

## 성과 및 배운 점

### ✅ **기술적 성과**
- 완전한 CI/CD 파이프라인 구축
- 다중 배포 환경 설계
- 서버리스 아키텍처 도입 시도
- Docker 컨테이너화 완료
- Railway 인프라 구축 완료

### ✅ **팀워크 성과**
- 기존 팀원 작업에 무영향
- 점진적 배포 전략 수립
- 선택적 환경 사용 가능

### 📚 **학습한 기술 스택**
- Railway 서버리스 배포
- Nixpacks 빌드 시스템
- PostgreSQL 클라우드 DB
- Spring Boot 프로파일 관리
- 환경 변수 기반 설정

## 다음 마일스톤

### 긴급 목표 (현재)
- [ ] PostgreSQL 드라이버 오류 해결
- [ ] Railway 백엔드 안정적 배포
- [ ] API 엔드포인트 테스트 성공

### Week 1 목표
- [ ] Railway 백엔드 배포 완료
- [ ] Vercel 프론트엔드 배포 완료
- [ ] 통합 테스트 성공
- [ ] 팀원 테스트 완료

### Week 2-3 목표
- [ ] Docker + AWS 환경 구축
- [ ] 이중 배포 환경 운영
- [ ] 포트폴리오 완성

## 트러블슈팅 로그

### PostgreSQL 드라이버 이슈 타임라인
1. **2025-07-30 06:00** - 초기 H2 DB 오류 (Table "MEMBER" not found)
2. **2025-07-30 06:15** - PostgreSQL 추가, DATABASE_URL 자동 생성
3. **2025-07-30 06:30** - 'url' must start with "jdbc" 오류
4. **2025-07-30 06:35** - DATABASE_URL에 jdbc: 프리픽스 추가
5. **2025-07-30 06:40** - PostgreSQL 드라이버 ClassLoader 오류 발생
6. **2025-07-30 06:45** - implementation 변경, Redis 비활성화
7. **2025-07-30 현재** - 여전히 드라이버 로딩 실패

---

**🚀 목표**: PostgreSQL 드라이버 이슈 해결 후 안전하고 확장 가능한 배포 환경 구축으로 팀 프로젝트 성공!

*마지막 업데이트: 2025-07-30 15:00*  
*현재 상태: Railway PostgreSQL 드라이버 오류 해결 중*
*긴급 이슈: Failed to load driver class org.postgresql.Driver*
