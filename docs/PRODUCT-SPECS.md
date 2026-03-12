# 프로젝트 명세서: myapp-frontend

## 기술 스택
- 프레임워크: Next.js 16 (App Router)
- 언어: TypeScript 5
- 런타임: Node.js 24 LTS
- 패키지 매니저: pnpm
- 스타일링: Tailwind CSS v4
- UI 라이브러리: shadcn/ui (Lucide React 포함)

## 환경 변수
- `NEXT_PUBLIC_API_BASE_URL`: API 서버 기본 URL
  - 로컬: `http://localhost:8080`
  - 운영: `https://api.myapp.com`

## 디렉토리 구조
- `src/app`: App Router 페이지 및 레이아웃
- `src/components`: 재사용 가능한 컴포넌트
  - `src/components/ui`: shadcn/ui 컴포넌트
- `src/lib`: 유틸리티 함수
- `public`: 정적 자산 (이미지 등)
- `docs`: 프로젝트 문서
