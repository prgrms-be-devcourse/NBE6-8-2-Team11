#!/bin/bash

# GitHub Codespaces 배포 스크립트
# 이 스크립트는 Codespaces 환경에서 최신 Docker 이미지를 사용하여 서비스를 배포합니다.

set -e  # 에러 발생 시 스크립트 중단

echo "🚀 PetMatching Codespaces 배포 시작..."

# 현재 디렉토리 확인
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ docker-compose.yml 파일을 찾을 수 없습니다. 프로젝트 루트에서 실행해주세요."
    exit 1
fi

# 환경 변수 파일 확인
if [ ! -f ".env" ]; then
    echo "📝 .env 파일이 없습니다. .env.example을 복사합니다..."
    cp .env.example .env
    echo "⚠️  .env 파일의 환경 변수를 확인하고 필요시 수정해주세요."
fi

# Docker 로그인 확인
echo "🔐 Docker 상태 확인..."
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker가 실행되지 않았습니다."
    exit 1
fi

# 기존 컨테이너 중지 및 제거
echo "🛑 기존 서비스 중지 중..."
docker-compose down --remove-orphans || true

# 로컬 이미지 빌드
echo "🏗️  로컬 이미지 빌드 중..."
docker-compose build --no-cache

# 서비스 시작
echo "🔄 서비스 시작 중..."
docker-compose up -d

# 서비스 시작 대기
echo "⏳ 서비스 시작 대기 중..."
sleep 30

# 헬스체크
echo "🔍 서비스 헬스체크 중..."

# MySQL 헬스체크
echo "  📊 MySQL 상태 확인..."
for i in {1..30}; do
    if docker-compose exec -T mysql mysqladmin ping -h localhost --silent 2>/dev/null; then
        echo "  ✅ MySQL 연결 성공"
        break
    else
        echo "  ⏳ MySQL 연결 대기 중... ($i/30)"
        sleep 2
    fi
    if [ $i -eq 30 ]; then
        echo "  ❌ MySQL 연결 실패"
        docker-compose logs mysql
        exit 1
    fi
done

# Redis 헬스체크
echo "  🔴 Redis 상태 확인..."
for i in {1..15}; do
    if docker-compose exec -T redis redis-cli ping | grep -q "PONG" 2>/dev/null; then
        echo "  ✅ Redis 연결 성공"
        break
    else
        echo "  ⏳ Redis 연결 대기 중... ($i/15)"
        sleep 2
    fi
    if [ $i -eq 15 ]; then
        echo "  ❌ Redis 연결 실패"
        docker-compose logs redis
        exit 1
    fi
done

# 백엔드 헬스체크
echo "  🔧 백엔드 서비스 상태 확인..."
for i in {1..60}; do
    backend_health=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/actuator/health 2>/dev/null || echo "000")
    if [ "$backend_health" = "200" ]; then
        echo "  ✅ 백엔드 서비스 정상 (HTTP: $backend_health)"
        break
    else
        echo "  ⏳ 백엔드 서비스 대기 중... ($i/60) HTTP: $backend_health"
        sleep 3
    fi
    if [ $i -eq 60 ]; then
        echo "  ❌ 백엔드 서비스 시작 실패 (HTTP: $backend_health)"
        echo "  📋 백엔드 로그:"
        docker-compose logs backend | tail -20
        exit 1
    fi
done

# 프론트엔드 헬스체크
echo "  🎨 프론트엔드 서비스 상태 확인..."
for i in {1..30}; do
    frontend_health=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 2>/dev/null || echo "000")
    if [ "$frontend_health" = "200" ]; then
        echo "  ✅ 프론트엔드 서비스 정상 (HTTP: $frontend_health)"
        break
    else
        echo "  ⏳ 프론트엔드 서비스 대기 중... ($i/30) HTTP: $frontend_health"
        sleep 3
    fi
    if [ $i -eq 30 ]; then
        echo "  ❌ 프론트엔드 서비스 시작 실패 (HTTP: $frontend_health)"
        echo "  📋 프론트엔드 로그:"
        docker-compose logs frontend | tail -20
        exit 1
    fi
done

# 배포 완료 정보 출력
echo ""
echo "🎉 배포 완료!"
echo ""
echo "📋 서비스 상태:"
docker-compose ps
echo ""
echo "🔗 서비스 URL (Codespaces 포트에서 확인):"
echo "- 🎨 Frontend (Next.js): http://localhost:3000"
echo "- 🔧 Backend (Spring Boot): http://localhost:8080"
echo "- 📖 API 문서 (Swagger): http://localhost:8080/swagger-ui.html"
echo "- 📊 Actuator Health: http://localhost:8080/actuator/health"
echo "- 🔴 Redis Commander: http://localhost:8081"
echo ""
echo "📝 유용한 명령어:"
echo "- 로그 확인: docker-compose logs -f [service-name]"
echo "- 서비스 재시작: docker-compose restart [service-name]"
echo "- 서비스 중지: docker-compose down"
echo "- 상태 확인: docker-compose ps"
echo ""
echo "Happy Coding in Codespaces! 🚀"
