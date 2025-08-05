# 🚀 팀 개발 가이드 - PetMatching 프로젝트

## 📋 목차
1. [Git Flow 전략](#git-flow-전략)
2. [브랜치 보호 규칙](#브랜치-보호-규칙)
3. [커밋 컨벤션](#커밋-컨벤션)
4. [PR(Pull Request) 가이드](#prpull-request-가이드)
5. [프로젝트 구조](#프로젝트-구조)
6. [개발 환경 설정](#개발-환경-설정)
7. [배포 시스템](#배포-시스템)
8. [주의사항 및 금지사항](#주의사항-및-금지사항)

---

## 🌿 Git Flow 전략

### 브랜치 구조
```
main (배포용)
├── develop (개발 메인)
    ├── feature/user-auth (기능 개발)
    ├── feature/pet-management (기능 개발)
    ├── feature/adoption-system (기능 개발)
    └── hotfix/critical-bug (긴급 수정)
```
* 이제 저흰 main은 잊고 사는거에요!! 
* develop 브랜치에서만 개발을 진행하고, 서로 겹치는 기능 개발이 완료(안정화)되면 PR을 통해 main 브랜치에 머지합니다.

### 브랜치별 역할

| 브랜치 | 용도 | 특징 |
|--------|------|------|
| `main` | 프로덕션 배포 | 항상 배포 가능한 안정적인 코드 |
| `develop` | 개발 통합 | 모든 기능이 통합되는 브랜치 |
| `feature/*` | 기능 개발 | 개별 기능 개발용 |
| `hotfix/*` | 긴급 수정 | 프로덕션 버그 긴급 수정 |

---

## 🛡️ 브랜치 보호 규칙

### develop 브랜치
- ✅ PR 필수
- ✅ 승인 1명 필요
- ✅ CI 테스트 통과 필수
- ✅ 최신 커밋 기준 업데이트 필수 (rebase)
- ❌ Force Push 금지

### main 브랜치  
- ✅ PR 필수
- ✅ **승인 2명 이상** 필요
- ✅ CI 테스트 통과 필수
- ✅ 최신 커밋 기준 업데이트 필수 (rebase)
- ❌ Force Push 금지

---

## 📝 커밋 컨벤션

### 커밋 메시지 형식
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type 종류
| Type | 설명 | 예시 |
|------|------|------|
| `feat` | 새로운 기능 추가 | `feat(user): 사용자 로그인 기능 추가` |
| `fix` | 버그 수정 | `fix(pet): 펫 등록 시 이미지 업로드 오류 수정` |
| `docs` | 문서 수정 | `docs(readme): API 문서 업데이트` |
| `style` | 코드 포맷팅 | `style(user): 코드 스타일 정리` |
| `refactor` | 코드 리팩토링 | `refactor(adoption): 입양 신청 로직 개선` |
| `test` | 테스트 코드 | `test(pet): 펫 서비스 단위 테스트 추가` |
| `chore` | 기타 작업 | `chore: 의존성 업데이트` |

### 커밋 메시지 예시
```bash
feat(user): JWT 기반 인증 시스템 구현

- Spring Security와 JWT를 활용한 인증 구현
- Access Token, Refresh Token 발급 기능
- 사용자 권한별 접근 제어 추가

Resolves: #123
```

---

## 🔄 PR(Pull Request) 가이드

### PR 생성 전 체크리스트
- [ ] 최신 develop 브랜치와 동기화
- [ ] 로컬에서 테스트 완료
- [ ] 코드 컨벤션 준수
- [ ] 커밋 메시지 정리 완료

### PR 제목 형식
```
[<type>] <간단한 설명> (#이슈번호)
```

**예시:**
```
[FEAT] 사용자 로그인/회원가입 API 구현
[FIX]: 펫 이미지 업로드 버그 수정
[DOCS] API 문서 업데이트
```

### PR 템플릿
```markdown
## 📝 변경사항
- 구현한 기능이나 수정한 내용을 간략히 설명

## 🧪 테스트
- [ ] 단위 테스트 작성/수정
- [ ] 통합 테스트 확인
- [ ] 로컬 환경에서 정상 동작 확인

## 📸 스크린샷 (UI 변경 시) -> 필수 아님
- 변경된 화면의 스크린샷 첨부 -> 필수 아님

## 🔗 관련 이슈
- Closes #이슈번호

## 📋 체크리스트
- [ ] 코드 컨벤션 준수
- [ ] 테스트 코드 작성
- [ ] 문서 업데이트 (필요시)
- [ ] 의존성 변경사항 공유 (필요시)
```

### PR 리뷰 가이드

#### 리뷰어 체크포인트
- 🧹 **코드 품질**: 가독성, 성능, 보안
- 🎯 **로직 검증**: 비즈니스 로직의 정확성
- 🧪 **테스트**: 테스트 커버리지 및 품질
- 📚 **문서화**: 주석, README 업데이트
- 🔧 **컨벤션**: 코딩 스타일, 네이밍 규칙

#### 리뷰 코멘트 예시
```
✅ LGTM (Looks Good To Me)
💡 제안: 이 부분은 Optional을 사용하면 더 깔끔할 것 같아요
❓ 질문: 이 메서드에서 예외 처리는 어떻게 하나요?
🚨 문제: NPE 가능성이 있어 보입니다
```

---

## 🏗️ 프로젝트 구조

### 백엔드 (Spring Boot - Domain 기반)
```
backend/src/main/java/com/back/
├── domain/
│   ├── user/           # 사용자 도메인
│   │   ├── entity/
│   │   ├── dto/request/
│   │   ├── dto/response/
│   │   ├── repository/
│   │   ├── service/
│   │   ├── controller/
│   │   └── enums/
│   ├── pet/            # 펫 도메인
│   ├── adoption/       # 입양 도메인
│   ├── counseling/     # 상담 도메인
│   ├── review/         # 리뷰 도메인
│   └── shelter/        # 보호소 도메인
└── global/             # 전역 설정
    ├── config/         # 설정 클래스
    ├── security/       # 보안 관련
    ├── exception/      # 예외 처리
    ├── common/         # 공통 기능
    └── util/           # 유틸리티
```

### 프론트엔드 (Next.js)
```
frontend/
├── src/
│   ├── app/            # App Router
│   ├── components/     # 재사용 컴포넌트
│   ├── hooks/          # 커스텀 훅
│   ├── utils/          # 유틸리티 함수
│   └── types/          # TypeScript 타입
├── public/             # 정적 파일
└── package.json
```

---

## ⚙️ 개발 환경 설정

### 필수 설치 도구
- **Java**: 21 (OpenJDK)
- **Node.js**: 20 LTS
- **IDE**: IntelliJ IDEA (권장)
- **Git**: 최신 버전

### 로컬 개발 환경 구축
```bash
# 1. 저장소 클론
git clone <repository-url>
cd (폴더명)

# 2. 백엔드 설정
cd backend
./gradlew build

# 3. 프론트엔드 설정  
cd ../frontend
npm install
npm run dev

# 4. 개발 브랜치 생성(예시)
git checkout develop
git pull origin develop
git checkout -b feature/your-feature-name
```

### 환경 변수 설정
```bash
# backend/.env (현재 로컬 환경용)
JWT_SECRET=your-secret-key
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_DATABASE=petmatching
MYSQL_USERNAME=your-username
MYSQL_PASSWORD=your-password
```

---

## 🚀 배포 시스템

### **자동 배포 플로우**
```
코드 개발 → PR 생성 → CI 테스트 → Slack 알림 → 리뷰 → 머지 → 자동 배포
```

### **배포 환경**
- **🌐 프론트엔드**: https://nbe-6-8-2-team11.vercel.app (Vercel)
- **⚙️ 백엔드**: https://nbe6-8-2-team11.onrender.com (Render + PostgreSQL)
- **🔄 CI/CD**: GitHub Actions (완전 자동화)

### **팀원 개발 가이드**
팀원들은 **기존 방식 그대로** 개발하면 됩니다!
1. 코드 작성 및 커밋
2. PR 생성
3. **자동 테스트 실행** (CI)
4. **Slack 알림 발송** (리뷰 요청)
5. 리뷰 & 승인 후 머지
6. **자동 배포 완료** 🚀

> 📚 **자세한 배포 가이드**: [`DEPLOYMENT_GUIDE.md`](./DEPLOYMENT_GUIDE.md) 참고

---

## ⚠️ 주의사항 및 금지사항

### 🚨 절대 금지사항
1. **Force Push 금지**
   ```bash
   # ❌ 절대 하지 마세요!
   git push --force
   git push -f
   ```

2. **(중요!!!!) main 브랜치에 직접 커밋 금지 (develop 브랜치 사용)**
  
   ```bash
   # ❌ 금지
   git checkout main
   git commit -m "direct commit"
   ```

3. **대용량 파일 커밋 금지**
   - 이미지, 바이너리 파일은 Git LFS 사용
   - node_modules, .gradle 등 빌드 파일 커밋 금지

### ⚡ rebase 사용 시 주의사항

#### 안전한 rebase 사용법
```bash
# 1. 백업 브랜치 생성 (중요!)
git checkout -b backup/feature-backup

# 2. 원래 브랜치로 돌아가서 rebase
git checkout feature/your-feature
git rebase develop

# 3. 충돌 해결 후
git add .
git rebase --continue

# 4. 문제 발생 시 중단
git rebase --abort
```

#### rebase 대신 merge 사용하는 경우
```bash
# 안전한 방법: merge 사용
git checkout feature/your-feature
git merge develop
```

### 🔧 개발 워크플로우

#### 1. 새 기능 개발 시작
```bash
git checkout develop
git pull origin develop
git checkout -b feature/기능명-이슈번호
```

#### 2. 개발 중 develop 업데이트 반영 (참고만 해주세요 변경 있을 수 있습니다.)
```bash
# 방법 1: merge (안전)
git checkout develop
git pull origin develop
git checkout feature/your-feature
git merge develop

# 방법 2: rebase (주의 필요)
git checkout develop
git pull origin develop  
git checkout feature/your-feature
git rebase develop
```

#### 3. PR 생성 전 마지막 체크
```bash
# 코드 스타일 검사
cd backend && ./gradlew check
cd frontend && npm run lint

# 테스트 실행
cd backend && ./gradlew test
cd frontend && npm test

# 빌드 확인
cd backend && ./gradlew build
cd frontend && npm run build
```

---

## 🆘 문제 해결 가이드

### 자주 발생하는 Git 관련 문제 가이드
```bash
# 1. merge conflict 발생 시
git status                    # 충돌 파일 확인
# 충돌 해결 후
git add .
git commit

# 2. 잘못된 커밋 수정
git commit --amend

# 3. 마지막 커밋 취소
git reset --soft HEAD~1

# 4. 변경사항 임시 저장
git stash
git stash pop
```

### 빌드 오류 해결 (저는 1차때 캐시 자주 꽉 찼었어요)
#### ex) 엥..? 원래 되던게 왜 실행이 안되지?
```bash
# 백엔드 캐시 정리
cd backend
./gradlew clean build

# 프론트엔드 캐시 정리  
cd frontend
rm -rf node_modules package-lock.json
npm install
```

---

## 📞 도움 요청

### 문제 발생 시 연락
- **Git 관련**: @진민호
- **백엔드 관련**: 함께하는 @백엔드팀
- **프론트엔드 관련**: 함께하는 @프론트엔드팀

### 팀 커뮤니케이션
- 💬 **슬랙 채널**: #2차-team11
- 📋 **이슈 관리**: GitHub 칸반보드

---

## ✅ 팀원 체크리스트

### 팀원 첫 스타트 온보딩
- [ ] Git 저장소 클론 완료
- [ ] 개발 환경 설정 완료  
- [ ] 브랜치 보호 규칙 숙지
- [ ] 커밋 컨벤션 숙지
- [ ] PR 템플릿 숙지
- [ ] 프로젝트 구조 파악
- [ ] 첫 번째 feature 브랜치 생성
- [ ] 테스트 PR 생성 및 머지

**🎉 모든 항목을 완료하면 개발 **

---

*마지막 업데이트: 2025년 8월 5일*
*문의사항이나 개선사항이 있으면 편하게 말해주세요! 🚀*