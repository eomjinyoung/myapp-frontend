# 프로젝트 명세서 - My App Frontend

이 문서는 `myapp-frontend` 프로젝트의 기술 명세 및 주요 기능을 요약합니다.

## 기술 스택
- **프레임워크**: Next.js 16 (App Router)
- **언어**: TypeScript 5
- **런타임**: Node.js 24 LTS
- **패키지 매니저**: pnpm
- **스타일링**: Tailwind CSS v4
- **UI 컴포넌트**: shadcn/ui
- **아이콘**: Lucide React
- **린터**: ESLint
- **포매터**: Prettier

## 프로젝트 구조
- `src/app/`: App 라우터 페이지 및 레이아웃
- `src/components/ui/`: shadcn/ui 공용 컴포넌트
- `src/lib/`: 유틸리티 함수 및 공통 로직
- `public/`: 정적 자산

## 환경 변수
- `NEXT_PUBLIC_API_BASE_URL`: REST API 기본 URL

## 스크립트
- `dev`: 개발 서버 실행
- `build`: 프로덕션 애플리케이션 빌드
- `start`: 프로덕션 서버 시작
- `lint`: ESLint 실행
- `format`: Prettier를 사용하여 코드 포맷팅

## API 통신 모듈
인증 처리 및 직접적인 서버 통신을 위해 커스텀 REST API 통신 모듈이 구현되어 있습니다.

- **타입**: `rest-api-spec.md`를 바탕으로 `src/types/api.ts`에 정의됨.
- **기본 URL**: `NEXT_PUBLIC_API_BASE_URL` 환경 변수 사용.
- **인증**: 
    - Bearer 토큰을 `localStorage`에 저장.
    - 401 에러 발생 시 `/api/reissue`를 통한 자동 토큰 재발급.
    - 인증 실패 시 `/login` 페이지로 자동 리다이렉트.
- **주요 함수**:
    - `apiFetch<T>`: 미들웨어 로직이 포함된 핵심 fetch 래퍼.
    - 편의 메서드: `get`, `post`, `patch`, `del`.

## 인증 상태 관리
애플리케이션 전역에서 사용자 상태 및 액션을 제공하는 인증 컨텍스트를 사용합니다.

- **타입**: `src/types/auth.ts`에 정의됨.
- **컨텍스트**: `AuthContext` (`src/context/AuthContext.tsx`)에서 `user` 및 `isLoading` 상태 관리.
- **훅**: 일관된 인증 데이터 접근을 위한 `useAuth` 훅 제공.
- **프로바이더**: `AuthProvider`가 루트 레이아웃을 감싸 모든 페이지에서 컨텍스트 접근 가능.
- **주요 기능**:
    - **로그인**: API 호출, `localStorage` 토큰 저장 및 사용자 프로필 조회.
    - **로그아웃**: 서버 세션 해제 API 호출 및 로컬 토큰 삭제.
    - **세션 유지**: 앱 마운트 시 저장된 토큰을 사용하여 자동으로 사용자 세션 복구.

## 공통 레이아웃 컴포넌트
애플리케이션의 모든 페이지에서 일관된 레이아웃을 사용합니다.

- **Navbar**: 
    - `shadcn/ui` 및 `Lucide React`를 사용한 반응형 내비게이션 바.
    - 인증 상태에 따라 메뉴 내용이 동적으로 변경됨.
    - 비로그인 상태: "로그인", "회원가입" 버튼 표시.
    - 로그인 상태: 사용자 이름(`user.name`), "게시글 작성", "로그아웃" 버튼 표시.
- **Footer**: 
    - 서비스 정보 및 저작권 표시를 위한 정적 서버 컴포넌트.
- **루트 레이아웃**: 
    - `AuthProvider`, `Navbar`, `main` (콘텐츠), `Footer`를 통합.
    - 전역 알림을 위한 `Toaster` 포함.

## 인증 페이지
- **회원가입 (`/register`)**:
    - 필드: 이름, 이메일, 비밀번호, 비밀번호 확인.
    - 유효성 검사: HTML5 기반 (필수값, 최소 길이, 패턴 등).
    - 커스텀 로직: 비밀번호 일치 여부 확인.
- **로그인 (`/login`)**:
    - 필드: 이메일, 비밀번호.
    - 연동: 세션 관리를 위해 `useAuth().login()` 사용.
    - 리다이렉트: 로그인 후 이동을 위한 `redirect` 쿼리 파라미터 지원.
- **공통 특징**: 
    - 버튼 비활성화 및 로딩 텍스트를 포함한 로딩 상태 처리.
    - API 에러 발생 시 사용자 친화적인 에러 메시지 표시 (400, 401, 403 대응).
