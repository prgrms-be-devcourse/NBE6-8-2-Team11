# 🚀 팀원용 개발 환경 가이드

## 📢 중요 공지

**기존 개발 방식은 그대로 사용 가능합니다!** 
새로운 Docker/CD 기능은 **선택사항**이며, 기존 로컬 개발에 영향을 주지 않습니다.

---

## 🔄 개발 환경 선택

### 방법 1: 기존 로컬 개발 (변화 없음) ⭐ 추천
```bash
# 백엔드 (H2 데이터베이스 사용)
cd backend
./gradlew bootRun

# 프론트엔드 (새 터미널에서)
cd frontend
npm install
npm run dev
```

**✅ 장점**: 빠른 시작, 설정 불필요  
**✅ 데이터베이스**: H2 (파일 기반, 간단)  
**✅ 캐시**: 로컬 메모리 사용

---

### 방법 2: Docker 환경 (새로운 옵션)
```bash
# 1. 환경 변수 설정 (최초 1회)
cp .env.example .env

# 2. Docker 서비스 시작
docker-compose up -d

# 3. 서비스 확인
docker-compose ps
```

**✅ 장점**: 실제 운영환경과 유사, MySQL + Redis 사용  
**⚠️ 요구사항**: Docker Desktop 설치 필요

---

### 방법 3: GitHub Codespaces (클라우드 개발)
```bash
# GitHub에서 "Code" → "Create codespace" 클릭
# 자동으로 모든 환경 설정됨
```

**✅ 장점**: 어디서나 동일한 환경, 설정 불필요  
**⚠️ 제한**: GitHub 계정 필요, 무료 사용량 제한

---

## 🤔 어떤 방법을 선택해야 할까요?

### 초보자 또는 빠른 개발이 필요한 경우
→ **방법 1 (기존 로컬 개발)** 추천

### 실제 운영환경과 유사하게 테스트하고 싶은 경우
→ **방법 2 (Docker 환경)** 추천

### 외부에서 개발하거나 환경 설정이 어려운 경우
→ **방법 3 (Codespaces)** 추천

---

## 🚨 주의사항

### 기존 개발자들은 아무것도 변경할 필요 없습니다!
- ✅ 기존 H2 데이터베이스 그대로 사용
- ✅ 기존 포트 번호 동일 (3000, 8080)
- ✅ 기존 명령어 그대로 사용
- ✅ 새로운 의존성 설치 불필요

### Docker 사용 시에만 주의
- Docker Desktop이 실행 중이어야 함
- 포트 3306 (MySQL), 6379 (Redis) 사용
- 더 많은 메모리 사용 (약 1GB 추가)

---

## 🔧 문제 해결

### 1. 기존 방식에서 오류 발생 시
```bash
# 데이터베이스 파일 초기화
rm -f db_dev.mv.db db_dev.trace.db

# Gradle 캐시 정리
cd backend
./gradlew clean build

# 프론트엔드 의존성 재설치
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### 2. Docker 방식에서 오류 발생 시
```bash
# 모든 컨테이너 정지 및 재시작
docker-compose down
docker-compose up -d

# 로그 확인
docker-compose logs -f
```

### 3. 포트 충돌 발생 시
```bash
# 사용 중인 포트 확인
netstat -tulpn | grep :8080
netstat -tulpn | grep :3000

# 프로세스 종료 (필요시)
sudo kill -9 [PID]
```

---

## 📊 환경별 비교표

| 항목 | 로컬 개발 | Docker 환경 | Codespaces |
|------|----------|------------|------------|
| **설정 시간** | 즉시 | 5-10분 | 2-3분 |
| **필요 도구** | Java, Node.js | + Docker | 브라우저만 |
| **메모리 사용** | 낮음 | 보통 | 클라우드 |
| **데이터베이스** | H2 (파일) | MySQL | MySQL |
| **캐시** | 없음 | Redis | Redis |
| **네트워크** | 불필요 | 불필요 | 필요 |
| **팀 동기화** | 수동 | 자동 | 자동 |

---

## ✅ 선택 가이드

**급하게 개발 시작해야 한다면**: 기존 방식 (방법 1) 사용

**여유가 있고 새로운 기능을 체험하고 싶다면**: Docker (방법 2) 또는 Codespaces (방법 3) 시도

**어떤 방식을 선택하든 동일한 코드로 개발 가능하며, 나중에 언제든 변경할 수 있습니다!**

---

*업데이트: 2025-07-29*
