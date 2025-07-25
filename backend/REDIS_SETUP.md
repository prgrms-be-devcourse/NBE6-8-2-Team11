# Redis 설정 가이드

## 1. Docker를 사용한 Redis 실행

### Redis 컨테이너 시작
```bash
# Redis만 실행
docker-compose up redis -d

# Redis와 Redis Commander(GUI) 함께 실행
docker-compose up -d
```

### Redis 컨테이너 중지
```bash
docker-compose down
```

## 2. Redis 접속 정보

- **호스트**: localhost
- **포트**: 6379
- **비밀번호**: 없음 (기본 설정)
- **데이터베이스**: 0

## 3. Redis Commander (GUI)

Redis Commander는 웹 기반 Redis 관리 도구입니다.

- **URL**: http://localhost:8081
- **접속**: 브라우저에서 위 URL로 접속

## 4. Redis CLI 접속

```bash
# Docker 컨테이너 내부에서 Redis CLI 실행
docker exec -it chat-redis redis-cli

# 또는 로컬에 Redis CLI가 설치되어 있다면
redis-cli -h localhost -p 6379
```

## 5. 주요 Redis 명령어

```bash
# 연결 테스트
PING

# 키 목록 조회
KEYS *

# 특정 키의 값 조회
GET key_name

# 키 삭제
DEL key_name

# 데이터베이스 선택
SELECT 0

# 모든 키 삭제 (주의!)
FLUSHDB
```

## 6. 애플리케이션 설정

`application-dev.yml`에 Redis 설정이 포함되어 있습니다:

```yaml
spring:
  data:
    redis:
      host: localhost
      port: 6379
      database: 0
      timeout: 2000ms
      lettuce:
        pool:
          max-active: 8
          max-idle: 8
          min-idle: 0
          max-wait: -1ms
```

## 7. 문제 해결

### Redis 연결 실패
1. Docker 컨테이너가 실행 중인지 확인:
   ```bash
   docker ps
   ```

2. Redis 포트가 사용 가능한지 확인:
   ```bash
   netstat -an | grep 6379
   ```

3. 컨테이너 로그 확인:
   ```bash
   docker logs chat-redis
   ```

### Redis Commander 접속 실패
1. 컨테이너가 실행 중인지 확인:
   ```bash
   docker ps | grep redis-commander
   ```

2. 포트 8081이 사용 가능한지 확인:
   ```bash
   netstat -an | grep 8081
   ``` 