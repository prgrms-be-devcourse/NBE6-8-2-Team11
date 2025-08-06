# 🚀 배포 시스템 가이드

## 📋 목차
1. [배포 시스템 개요](#배포-시스템-개요)
2. [CI/CD 파이프라인](#cicd-파이프라인)
3. [배포 환경](#배포-환경)
4. [개발자 가이드](#개발자-가이드)
5. [배포 모니터링](#배포-모니터링)
6. [트러블슈팅](#트러블슈팅)

---

## 🏗️ 배포 시스템 개요

### **배포 아키텍처**
```
GitHub 조직 레포 (prgrms-be-devcourse/NBE6-8-2-Team11)
├── 백엔드 → Render 자동 배포
├── 프론트엔드 → 개인 Fork → Vercel 자동 배포
└── CI/CD → GitHub Actions

🌐 배포 URL:
├── 백엔드: https://nbe6-8-2-team11.onrender.com
└── 프론트엔드: https://nbe-6-8-2-team11.vercel.app
```

### **배포 전략**
- **백엔드**: Render 웹 서비스 (PostgreSQL 포함)
- **프론트엔드**: 개인 Fork → Vercel 우회 배포
- **자동화**: GitHub Actions로 완전 자동 CI/CD

---

## 🔄 CI/CD 파이프라인

### **전체 플로우**
```
코드 개발 → PR 생성 → CI 테스트 → Slack 알림 → 리뷰 → 머지 → 자동 배포
```

### **1. PR 생성 시 (ci.yml)**
```yaml
트리거: pull_request (develop, main)
실행 내용:
├── 백엔드 빌드 & 테스트 (Java 17, Gradle)
├── 프론트엔드 빌드 & Lint (Node.js 18, npm)
├── 테스트 통과 시 → Slack 알림 발송
└── 결과: GitHub 체크 상태 업데이트
```

### **2. main/develop 푸시 시 (push-to-fork.yml)**
```yaml
트리거: push (main, develop)
실행 내용:
├── 전체 테스트 실행
├── 백엔드 → Render 자동 배포
├── 코드 → 개인 Fork 자동 푸시
└── 개인 Fork → Vercel 자동 배포
```

### **배포 시간**
- **백엔드 배포**: 약 3-5분 (Render)
- **프론트엔드 배포**: 약 2-3분 (Vercel)
- **전체 배포**: 약 5-8분

---

## 🌐 배포 환경

### **백엔드 - Render**
- **플랫폼**: Render Web Service
- **런타임**: Java 17
- **데이터베이스**: PostgreSQL (Render 관리)
- **빌드**: `./gradlew build -x test --no-daemon`
- **실행**: `java -Dspring.profiles.active=prod -jar build/libs/*.jar`

### **프론트엔드 - Vercel**
- **플랫폼**: Vercel (개인 Fork 연결)
- **런타임**: Node.js 18
- **프레임워크**: Next.js 15
- **빌드**: `npm run build`

### **환경 변수**

#### **Render (백엔드)**
```bash
SPRING_PROFILES_ACTIVE=prod
PORT=10000
JWT_SECRET=***
JWT_ACCESS_TOKEN_EXPIRATION=PT15M
JWT_REFRESH_TOKEN_EXPIRATION=PT168H
FRONTEND_URL=https://nbe-6-8-2-team11.vercel.app
OAUTH2_REDIRECT_URI=https://nbe6-8-2-team11.onrender.com/login/oauth2/code/kakao
KAKAO_CLIENT_ID=***
KAKAO_CLIENT_SECRET=***
DATABASE_URL=(자동 설정)
```

#### **Vercel (프론트엔드)**
```bash
NEXT_PUBLIC_API_BASE_URL=https://nbe6-8-2-team11.onrender.com
NODE_ENV=production
```

---

## 👨‍💻 개발자 가이드

### **일반적인 개발 워크플로우**
팀원들은 **기존 방식 그대로** 개발하면 됩니다!

```bash
# 1. 기능 개발
git checkout develop
git pull origin develop
git checkout -b feature/new-feature

# 2. 개발 & 커밋
git add .
git commit -m "feat: new feature implementation"

# 3. PR 생성
git push origin feature/new-feature
# GitHub에서 PR 생성

# 4. 자동화 동작
# → CI 테스트 실행
# → Slack 알림 발송
# → 리뷰 & 승인 후 머지
# → 자동 배포 시작
```

### **배포 확인 방법**

#### **1. GitHub Actions 모니터링**
```
조직 레포 → Actions 탭
├── CI: PR 테스트 상태 확인
└── Deploy Pipeline: 배포 진행 상태 확인
```

#### **2. 배포 상태 확인**
```bash
# 백엔드 헬스 체크
curl https://nbe6-8-2-team11.onrender.com/health

# 프론트엔드 접속 확인
curl https://nbe-6-8-2-team11.vercel.app
```

#### **3. Slack 알림**
- **PR 생성 + CI 통과**: 리뷰 요청 알림
- **배포 실패 시**: 에러 알림 (추후 추가 예정)

### **긴급 배포 (Hot Fix)**
```bash
# 1. 긴급 수정 브랜치 생성
git checkout main
git pull origin main
git checkout -b hotfix/critical-fix

# 2. 수정 & 커밋
git add .
git commit -m "hotfix: critical bug fix"

# 3. 직접 main에 머지 (승인 2명 필요)
git push origin hotfix/critical-fix
# → main 브랜치로 PR 생성
# → 승인 후 즉시 배포
```

---

## 📊 배포 모니터링

### **GitHub Actions 대시보드**
```
https://github.com/prgrms-be-devcourse/NBE6-8-2-Team11/actions

워크플로우별 상태:
├── CI: PR 테스트 결과
├── Deploy Pipeline: 자동 배포 상태
├── Fork PR Notification: Fork PR 알림
└── Sync Fork: Fork 동기화 (비활성)
```

### **배포 플랫폼 모니터링**

#### **Render 대시보드**
```
https://dashboard.render.com/
├── 웹 서비스 상태 및 로그 확인
├── 데이터베이스 상태 모니터링
├── 배포 히스토리
└── 리소스 사용량 (CPU, 메모리)
```

#### **Vercel 대시보드**
```
https://vercel.com/dashboard
├── 배포 상태 및 로그 확인
├── 빌드 시간 및 성능 메트릭
├── 도메인 및 환경 변수 관리
└── 함수 실행 로그 (API Routes)
```

### **실시간 알림**
- **Slack**: PR 리뷰 요청 알림
- **GitHub**: 배포 실패 시 이메일 알림
- **Render**: 서비스 다운 시 이메일 알림

---

## 🛠️ 트러블슈팅

### **자주 발생하는 문제들**

#### **1. CI 테스트 실패**
```bash
문제: Backend - Build 실패
해결: 
├── Java 버전 확인 (Java 17 필요)
├── 의존성 충돌 확인
└── 로컬에서 ./gradlew build 테스트

문제: Frontend - Lint & Build 실패
해결:
├── Node.js 버전 확인 (18 필요)
├── package-lock.json 동기화
└── 로컬에서 npm run build 테스트
```

#### **2. 배포 실패**
```bash
문제: Render 배포 실패
해결:
├── Render 대시보드에서 로그 확인
├── 환경 변수 설정 확인
├── 메모리/CPU 리소스 확인
└── DATABASE_URL 연결 상태 확인

문제: Vercel 배포 실패
해결:
├── Vercel 대시보드에서 빌드 로그 확인
├── NEXT_PUBLIC_API_URL 설정 확인
├── Node.js 버전 호환성 확인
└── 개인 Fork 동기화 상태 확인
```

#### **3. Fork 동기화 문제**
```bash
문제: 개인 Fork가 업데이트되지 않음
해결:
├── GitHub Actions 워크플로우 상태 확인
├── FORK_PUSH_TOKEN 유효성 확인
├── 수동 동기화: git push fork develop --force
└── Personal Access Token 재생성
```

### **긴급 상황 대응**

#### **전체 서비스 다운**
1. **Render 서비스 확인**
   ```bash
   # 헬스 체크
   curl https://nbe6-8-2-team11.onrender.com/health
   
   # 실패 시 Render 대시보드에서 재시작
   ```

2. **Vercel 서비스 확인**
   ```bash
   # 프론트엔드 확인
   curl https://nbe-6-8-2-team11.vercel.app
   
   # 실패 시 Vercel 대시보드에서 재배포
   ```

#### **롤백 절차**
```bash
# 1. 이전 안정 버전으로 롤백
git checkout main
git revert HEAD~1  # 마지막 커밋 되돌리기
git push origin main

# 2. 또는 특정 커밋으로 롤백
git reset --hard <이전-안정-커밋-해시>
git push origin main --force-with-lease

# 3. 수동 배포 트리거
# GitHub Actions에서 re-run 또는
# Render/Vercel 대시보드에서 수동 재배포
```

---

## 🔧 고급 설정

### **GitHub Secrets 관리**
조직 레포 → Settings → Secrets and variables → Actions

```bash
필수 Secrets:
├── FORK_PUSH_TOKEN: 개인 Fork 푸시용 토큰
├── RENDER_API_KEY: Render 배포용 API 키
├── RENDER_SERVICE_ID: Render 서비스 ID
├── SLACK_WEBHOOK_URL: Slack 알림용 Webhook
├── NEXT_PUBLIC_API_URL: 프론트엔드 API URL
├── BACKEND_URL: 백엔드 서비스 URL
└── FRONTEND_URL: 프론트엔드 서비스 URL
```

### **워크플로우 파일 위치**
```
.github/workflows/
├── ci.yml              # PR 테스트 & Slack 알림
├── push-to-fork.yml    # 자동 배포 파이프라인
├── pr-notification.yml # DISABLED
├── pr-slack-notify.yml # DISABLED
└── sync-fork.yml       # Fork 동기화 (비활성)
```

### **수동 배포 방법**
```