#!/bin/bash

# GitHub Codespaces 초기 설정 스크립트
echo "🚀 PetMatching 프로젝트 개발 환경 설정 중..."

# 권한 설정
sudo chown -R vscode:vscode /workspace
cd /workspace

# 환경 변수 파일 복사 (예시용)
if [ ! -f .env ]; then
    cp .env.example .env
    echo "📝 .env 파일이 생성되었습니다. 필요한 환경 변수를 설정해주세요."
fi

# 백엔드 의존성 설치 및 빌드
echo "🔧 백엔드 의존성 설치 중..."
cd backend
chmod +x gradlew
./gradlew build -x test
cd ..

# 프론트엔드 의존성 설치
echo "🎨 프론트엔드 의존성 설치 중..."
cd frontend
npm install
cd ..

# Docker Compose 설정
echo "🐳 Docker 서비스 시작 중..."
docker-compose -f docker-compose.dev.yml up -d mysql redis redis-commander

# 서비스 상태 확인
echo "⏳ 서비스 시작 대기 중..."
sleep 10

echo "✅ 개발 환경 설정 완료!"
echo ""
echo "📋 다음 단계:"
echo "1. 터미널에서 'cd backend && ./gradlew bootRun' 으로 백엔드 시작"
echo "2. 새 터미널에서 'cd frontend && npm run dev' 로 프론트엔드 시작"
echo "3. 포트 탭에서 각 서비스 URL 확인"
echo ""
echo "🔗 서비스 포트:"
echo "- Frontend: http://localhost:3000"
echo "- Backend: http://localhost:8080"
echo "- Redis Commander: http://localhost:8081"
echo ""
echo "Happy Coding! 🎉"
