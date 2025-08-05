# ⚠️ Docker 개발 환경 가이드

> **참고**: 현재 배포 시스템은 Docker를 사용하지 않습니다.  
> 배포 관련 정보는 [`DEPLOYMENT_GUIDE.md`](./DEPLOYMENT_GUIDE.md)를 참고해주세요.

## Docker 로컬 개발 환경 (선택사항)

Docker를 사용한 로컬 개발 환경 설정이 필요한 경우에만 사용하세요.

### 기본 설정
```bash
# Docker Compose 실행
docker-compose up -d

# 로그 확인
docker-compose logs -f
```

### 주의사항
- Docker 환경은 로컬 개발용입니다
- 실제 배포는 Render + Vercel을 사용합니다
- 배포 관련 문의는 팀 슬랙 채널에서 해주세요