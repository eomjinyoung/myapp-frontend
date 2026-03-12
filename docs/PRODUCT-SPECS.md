# 프로젝트 명세서: myapp-frontend

## 기술 스택
- 프레임워크: Next.js 16 (App Router)
- 언어: TypeScript 5
- 런타임: Node.js 24 LTS
- 패키지 매니저: pnpm
- 스타일링: Tailwind CSS v4
- UI 라이브러리: shadcn/ui (Lucide React 포함)

## 주요 기능 모듈
- **REST API 통신**: `src/lib/api.ts`
  - `apiFetch` 기반의 공통 요청 핸들러
  - 401 에러 발생 시 자동 토큰 재발급 및 재시도 로직
  - API 공통 응답 및 에러 타입 정의 (`src/types/api.ts`)

- **인증 상태 관리**: `src/context/AuthContext.tsx`
  - Access Token: 메모리 저장 (React Context)
  - Refresh Token: HttpOnly Cookie 기반 (REST API 서버 직접 통신)
  - `useAuth` 훅을 통한 전역 인증 상태 및 로그인/로그아웃 기능 제공

- **공통 레이아웃**: `src/components/layout`
  - `Navbar`: 인증 상태에 따른 동적 메뉴 (로그인/비로그인 분기 처리)
  - `Footer`: 정적 푸터 컴포넌트

- **인증 페이지**: `src/app/(auth)`
  - `login/page.tsx`: 이메일/비밀번호 기반 로그인 구현 (HTML5 Validation 적용)
  - `register/page.tsx`: 신규 사용자 회원가입 구현 (이름, 이메일, 비밀번호, 비밀번호 확인)

## 환경 변수
- `NEXT_PUBLIC_API_BASE_URL`: API 서버 기본 URL
  - 로컬: `http://localhost:8080`
  - 운영: `https://api.myapp.com`

## 디렉토리 구조
- `src/app`: App Router 페이지 및 레이아웃
- `src/components`: 재사용 가능한 컴포넌트
  - `src/components/ui`: shadcn/ui 컴포넌트
- `src/lib`: 유틸리티 함수 및 API 모듈
- `src/types`: 공통 타입 정의
- `public`: 정적 자산 (이미지 등)
- `docs`: 프로젝트 문서
- `rest-api-spec.md`: REST API 상세 명세서
