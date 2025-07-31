# 배포 자동화 프로젝트 진행 상황

## 프로젝트 개요
- **목표**: 협업 프로젝트의 CI/CD 파이프라인 구축 및 실제 서비스 배포
- **현재 상태**: Render + Vercel 우회 배포 전략 수립 완료
- **배포 전략**: Render (백엔드) + Vercel 우회 (프론트엔드) + Docker + AWS (학습용)

## Phase 1 완료 사항
✅ **CI 파이프라인 구축 완료**
✅ **Docker 초기 환경 설정 구축**
- 다른 팀원들의 로직 손상 없이 안전하게 진행
- 기본 Docker 설정 완료

## Phase 2 완료 사항
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

## Phase 3!! 현재의 계획 및 진행 상황
🔄 **Render + Vercel 우회 배포** (메인 전략)

### 완료된 작업
✅ **코드베이스 정리**
   - 모든 Railway 전용 설정 완전 제거
   - 팀원 로직 100% 보존
   - Redis 및 채팅 기능 정상 복구

✅ **Vercel 우회 전략 수립**
   - 조직 레포 → 개인 Fork → Vercel 배포 플로우 설계
   - GitHub Actions 기반 자동 동기화 시스템 설계
   - PR Preview 기능 포함한 완전한 CI/CD 설계

### 다음 단계
🔄 **Render 백엔드 배포**
   1. render.com 가입 및 GitHub 연결
   2. 조직 저장소 권한 설정
   3. PostgreSQL 데이터베이스 생성
   4. 환경 변수 설정
   5. 자동 배포 구성

🔄 **Vercel 우회 프론트엔드 배포**
   1. 개인 계정으로 조직 레포 Fork
   2. GitHub Actions 자동 동기화 설정
   3. Vercel 개인 계정 연결
   4. PR Preview 자동화 구축

## Phase 4 계획 (병행)
📋 **Docker + AWS 배포** (학습용)
   - AWS EC2 프리티어 설정
   - Docker 기반 배포 파이프라인
   - 포트폴리오 및 학습 목적

## 배포 환경 구조

### 계획된 환경
```
개발 환경:
├── 로컬 Docker (기존 팀원 환경 보호)
├── 로컬 Redis + H2/MySQL (채팅 포함)
└── GitHub Codespaces (클라우드 개발)

배포 환경:
├── Render + Vercel 우회 (메인 서비스) 
├── Docker + AWS (학습용) - 계획 예정 됨
└── 릴리즈 테스트 환경 (release/* 브랜치)
```

### Render + Vercel 우회 인프라 설계
```
Render 서비스:
├── 백엔드 웹 서비스
│   ├── GitHub: prgrms-be-devcourse/NBE6-8-2-Team11
│   ├── Branch: develop
│   ├── Root Directory: backend
│   ├── Build: Gradle + Java 21
│   └── Domain: https://nbe6-team11.onrender.com
├── PostgreSQL 데이터베이스
│   ├── 자동 생성된 DATABASE_URL
│   └── 내부 네트워크 연결
└── 환경 변수 관리

Vercel 우회 시스템:
├── 조직 레포 (prgrms-be-devcourse/NBE6-8-2-Team11)
│   ├── GitHub Actions 워크플로우
│   ├── 자동 Fork 동기화
│   └── PR Preview 자동화
├── 개인 Fork 레포 (account/NBE6-8-2-Team11)
│   ├── Vercel 배포 연결
│   ├── 자동 빌드/배포
│   └── Domain: https://nbe6-team11.vercel.app
└── GitHub Actions 프록시
    ├── 조직 레포 → 개인 Fork 동기화
    ├── PR 생성 시 Preview 배포
    └── Main 브랜치 자동 배포
```

## Vercel 우회 배포 상세 가이드

### 🚀 **1단계: 개인 Fork 생성**

1. **조직 레포를 개인 계정으로 Fork**
   ```bash
   1. https://github.com/prgrms-be-devcourse/NBE6-8-2-Team11 접속
   2. 우상단 "Fork" 버튼 클릭
   3. 개인 계정으로 Fork 생성
   4. Repository name: NBE6-8-2-Team11 (동일하게 유지)
   ```

2. **GitHub Personal Access Token 생성**
   ```bash
   1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
   2. "Generate new token (classic)" 클릭
   3. 권한: repo 전체 체크
   4. 토큰 생성 후 안전한 곳에 저장
   ```

### 🚀 **2단계: 조직 레포에 GitHub Actions 설정**

1. **build.sh 파일 생성** (프로젝트 루트)
   ```bash
   #!/bin/sh
   cd ../
   mkdir output
   cp -R ./NBE6-8-2-Team11/frontend/* ./output/
   cp -R ./output ./NBE6-8-2-Team11/frontend/
   ```

2. **Secrets 설정**
   ```bash
   # 조직 레포 → Settings → Secrets and variables → Actions
   AUTO_ACTIONS: [개인 GitHub 토큰]
   EMAIL: [개인 GitHub 이메일]
   ```

3. **메인 배포 워크플로우** (`.github/workflows/vercel-deploy.yml`)
   ```yaml
   name: Deploy to Vercel via Personal Fork
   
   on:
     push:
       branches: [develop, main]
   
   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         - name: Install dependencies
           run: |
             cd frontend
             npm install
         - name: Build project
           run: |
             cd frontend
             npm run build
         - name: Copy build to output
           run: sh ./build.sh
         - name: Push to personal fork
           uses: cpina/github-action-push-to-another-repository@main
           env:
             API_TOKEN_GITHUB: ${{ secrets.AUTO_ACTIONS }}
           with:
             source-directory: 'output'
             destination-github-username: [개인-GitHub-계정명]
             destination-repository-name: NBE6-8-2-Team11
             user-email: ${{ secrets.EMAIL }}
             commit-message: ${{ github.event.commits[0].message }}
             target-branch: main
   ```

4. **PR Preview 워크플로우** (`.github/workflows/vercel-preview.yml`)
   ```yaml
   name: Vercel Preview Deployment
   
   on:
     pull_request:
       branches: [develop, main]
   
   jobs:
     preview:
       runs-on: ubuntu-latest
       env:
         VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
         VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
       steps:
         - uses: actions/checkout@v4
         - name: Install Vercel CLI
           run: npm install --global vercel@latest
         - name: Pull Vercel Environment Information
           run: vercel pull --yes --environment=preview --token=${{ secrets.VERCEL_TOKEN }}
         - name: Build Project Artifacts
           run: |
             cd frontend
             vercel build --token=${{ secrets.VERCEL_TOKEN }}
         - name: Deploy to Vercel
           id: deploy
           run: |
             cd frontend
             vercel deploy --prebuilt --token=${{ secrets.VERCEL_TOKEN }} > ../vercel-output.txt
             echo "preview_url=$(cat ../vercel-output.txt)" >> $GITHUB_OUTPUT
         - name: Comment PR with Preview URL
           uses: thollander/actions-comment-pull-request@v2
           with:
             message: |
               🚀 **Preview Deployment**
               
               ✅ Frontend: ${{ steps.deploy.outputs.preview_url }}
               
               테스트 후 피드백 부탁드립니다!
   ```

### 🚀 **3단계: Vercel 설정**

1. **개인 Fork를 Vercel에 연결**
   ```bash
   1. vercel.com 로그인
   2. New Project 클릭
   3. 개인 계정에서 Fork한 레포 선택
   4. Framework: Next.js (자동 감지)
   5. Root Directory: frontend (중요!)
   ```

2. **Vercel Access Token 생성**
   ```bash
   1. Vercel → Account Settings → Tokens
   2. "Create Token" 클릭
   3. 토큰 생성 후 저장
   ```

3. **Vercel CLI로 프로젝트 정보 확인**
   ```bash
   # 로컬에서 실행
   npm install -g vercel@latest
   vercel login
   cd frontend
   vercel
   
   # .vercel/project.json 파일에서 확인
   # projectId와 orgId 복사
   ```

4. **추가 Secrets 설정** (조직 레포에)
   ```bash
   VERCEL_TOKEN: [Vercel Access Token]
   VERCEL_ORG_ID: [.vercel/project.json의 orgId]
   VERCEL_PROJECT_ID: [.vercel/project.json의 projectId]
   ```

### 🚀 **4단계: 환경 변수 설정**

1. **Vercel 환경 변수**
   ```bash
   # Vercel 프로젝트 → Settings → Environment Variables
   NEXT_PUBLIC_API_URL: https://nbe6-team11.onrender.com
   NODE_ENV: production
   ```

2. **Build & Output Settings**
   ```bash
   # Vercel 프로젝트 → Settings → General
   Framework Preset: Next.js
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   ```

## Render 백엔드 배포 가이드

### 🚀 **Render 백엔드 배포 절차**

1. **Render 계정 생성 및 연결**
   ```bash
   1. render.com 접속 → GitHub 계정으로 가입
   2. "New Web Service" 클릭
   3. GitHub 저장소 연결 (조직 권한 필요)
   4. Repository: prgrms-be-devcourse/NBE6-8-2-Team11
   5. Branch: develop
   6. Root Directory: backend
   ```

2. **빌드 설정**
   ```bash
   Build Command: ./gradlew build -x test --no-daemon
   Start Command: java -Dspring.profiles.active=prod -jar build/libs/*.jar
   Environment: Java 21
   ```

3. **환경 변수 설정**
   ```bash
   SPRING_PROFILES_ACTIVE=prod
   PORT=10000
   JWT_SECRET=myVeryLongSecretKeyForJWTTokenGenerationThatIsAtLeast256BitsLongAndSecureEnoughForProductionUse123456789
   JWT_ACCESS_TOKEN_EXPIRATION=PT15M
   JWT_REFRESH_TOKEN_EXPIRATION=PT168H
   KAKAO_CLIENT_ID=a55fbac2b1ec1017835ea67b2a584ad5
   KAKAO_CLIENT_SECRET=your-secret
   FRONTEND_URL=https://nbe6-team11.vercel.app
   DATABASE_URL=(PostgreSQL 생성 후 자동 설정)
   ```

4. **PostgreSQL 데이터베이스 추가**
   ```bash
   1. Render 대시보드에서 "New PostgreSQL" 클릭
   2. 같은 프로젝트에 생성 (region 동일하게)
   3. 자동으로 DATABASE_URL 환경 변수 생성됨
   ```

## 팀원 로직 보호 현황

### ✅ **100% 안전 보장**
- 모든 백엔드 도메인 로직 (Member, Pet, Adoption, Care, Chat, Notification, Shelter) 무변경
- 모든 프론트엔드 컴포넌트 및 페이지 로직 무변경
- 기존 개발 환경 (Docker, 로컬) 그대로 유지
- Redis 채팅 기능 완전 복구
- API 엔드포인트 구조 동일

### ✅ **추가된 배포 인프라 (기존에 영향 없음)**
- GitHub Actions 자동 동기화 (선택사항)
- Vercel 우회 배포 시스템 (추가 옵션)
- Render 백엔드 배포 환경 (추가 옵션)

## 주요 완성 파일 목록

### CI/CD 파이프라인
- `.github/workflows/ci.yml` - 기존 CI (PR 테스트)
- `.github/workflows/cd.yml` - main 브랜치 프로덕션 배포
- `.github/workflows/cd-release.yml` - 릴리즈 브랜치 배포
- `.github/workflows/vercel-deploy.yml` - Vercel 우회 배포 (신규)
- `.github/workflows/vercel-preview.yml` - PR Preview 배포 (신규)

### Vercel 우회 시스템
- `build.sh` - 프론트엔드 빌드 복사 스크립트 (신규)
- `frontend/vercel.json` - Vercel 배포 설정
- `frontend/.env.production` - Vercel 환경 변수 (Render URL)

### 개발 환경
- `.devcontainer/devcontainer.json` - Codespaces 설정
- `docker-compose.codespaces.yml` - Codespaces용 Docker
- `scripts/deploy-codespaces.sh` - Codespaces 배포 스크립트

### 문서
- `TEAM_ONBOARDING_GUIDE.md` - 팀원용 가이드
- `CD_SETUP_COMPLETE.md` - CD 구축 완료 가이드
- `DEPLOYMENT_PROGRESS.md` - 이 파일

## 우회 배포의 장점

### ✅ **비용 절약**
- Vercel Organization 유료 플랜 없이 무료 배포
- GitHub Actions 프록시로 조직 레포 → 개인 Fork 자동 동기화
- 모든 Vercel 기능 (빌드, 배포, 도메인) 무료 사용

### ✅ **완전한 CI/CD**
- PR 생성 시 자동 Preview 배포
- Main 브랜치 푸시 시 자동 프로덕션 배포
- 빌드 실패/성공 알림 시스템
- Git 커밋 메시지 자동 동기화

### ✅ **팀 협업 친화적**
- 조직 레포에서 정상적인 개발 플로우
- 개인 Fork는 배포 전용으로만 사용
- 팀원들은 배포 시스템을 신경 쓸 필요 없음

## 성과 및 배운 점

### ✅ **기술적 성과**
- 완전한 CI/CD 파이프라인 구축
- Vercel 조직 유료화 우회 시스템 구축
- GitHub Actions 프록시 패턴 마스터
- 서버리스 아키텍처 설계

### ✅ **팀워크 성과**
- 기존 팀원 작업에 무영향 달성
- 비용 효율적인 배포 환경 구축
- 완전 자동화된 배포 파이프라인

### 📚 **학습한 기술 스택**
- GitHub Actions 고급 워크플로우
- Shell Script 작성 및 활용
- Vercel CLI 및 API 활용
- Render 서버리스 배포
- 프록시 패턴 구현

## 다음 마일스톤

### 다음 마일스톤

### 개발 완료 후 목표
- [ ] 개발 완료 후 개인 계정으로 조직 레포 Fork
- [ ] GitHub Actions 워크플로우 생성
- [ ] Vercel 개인 레포 연결
- [ ] Render 백엔드 배포 완료

### 배포 Week 1 목표
- [ ] Vercel 우회 배포 시스템 완성
- [ ] PR Preview 자동화 구축
- [ ] Render + Vercel 통합 테스트
- [ ] 팀원 테스트 및 피드백

### 배포 Week 2-3 목표
- [ ] 도메인 연결 (선택사항)
- [ ] Docker + AWS 환경 구축
- [ ] 이중 배포 환경 운영
- [ ] 포트폴리오 완성

## 주의사항

### ⚠️ **팀원들을 위한 안내**
- 기존 개발 방식 그대로 사용 가능
- Docker 환경은 그대로 유지
- Redis 채팅 기능 완전 복구됨
- 새로운 배포 환경은 추가 옵션
- GitHub Actions는 자동으로 작동
- 개인 Fork는 배포 전용 (직접 수정 금지)

### ⚠️ **배포 환경 구분**
- 개발: 기존 방식 (Docker/로컬 + Redis)
- 프로덕션: Render + Vercel 우회
- Preview: PR 생성 시 자동 배포
- 학습: Docker + AWS (계획)

### ⚠️ **Vercel 우회 시 주의사항**
- 개인 Fork 레포는 배포 전용으로만 사용
- 조직 레포에서 개발 → GitHub Actions가 자동 동기화
- Personal Access Token 보안 주의
- build.sh 스크립트 경로 확인 필수

---

**🚀 목표**: Render + Vercel 우회 조합으로 무료이면서 완전 자동화된 배포 환경 구축으로 팀 프로젝트 성공!

*마지막 업데이트: 2025-07-31 12:30*  
*현재 상태: Vercel 우회 배포 전략 및 문서화 완료*  
*다음 단계: 개발 완료 후 배포 시스템 구축*
