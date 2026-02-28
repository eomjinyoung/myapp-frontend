# My REST App Frontend

이 프로젝트는 Vite를 기반으로 한 React + TypeScript SPA 프로젝트입니다.

## 요구사항

- **Node.js**: v24.14 이상 (런타임 안정성 및 최신 기능 활용을 위해 권장)
- **Package Manager**: npm (또는 pnpm/yarn)

## 환경 설정

이 프로젝트는 Vite 환경변수를 사용하여 API Base URL을 관리합니다.

- **개발 환경**: `.env.development` (`VITE_API_BASE_URL=http://localhost:8080`)
- **운영 환경**: `.env.production` (`VITE_API_BASE_URL=https://api.example.com`)

> [!IMPORTANT]
> 운영 환경 배포 시 `.env.production` 파일의 `VITE_API_BASE_URL` 값을 실제 API 서버 주소로 변경해야 합니다.

## 프로젝트 초기화 및 실행

```bash
# 의존성 설치
npm install

# 로컬 개발 서버 실행
npm run dev

# 빌드
npm run build

# 타입 체크
npm run type-check

# 린트 실행
npm run lint

# 프로덕션 빌드 미리보기
npm run preview
```

## 프로젝트 구조

- `src/api/`: API 요청 관련 코드 (Fetch API 활용)
- `src/auth/`: 인증 관련 로직 (JWT, localStorage 등)
- `src/components/`: 공통 UI 컴포넌트
- `src/pages/`: 페이지 레벨 컴포넌트
- `src/routes/`: 라우팅 설정
- `src/types/`: TypeScript 타입 정의
- `src/assets/`: 이미지, 폰트 등 정적 자원
- `src/App.tsx`: 메인 애플리케이션 컴포넌트
- `src/main.tsx`: 엔트리 포인트
