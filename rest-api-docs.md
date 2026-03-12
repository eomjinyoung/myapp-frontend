# REST API Documentation

This document describes the REST API endpoints available in the application.

## Authentication
The API uses Bearer Authentication with JWT tokens. Include the `Authorization: Bearer <token>` header in your requests.

---

## API Endpoints

### Auth

#### [POST] /api/auth/login
로그인을 수행하고 액세스 토큰을 발급받습니다.

**Request Body:** `LoginRequestDto`
- `email` (string, email, required): 사용자 이메일
- `password` (string, required): 사용자 비밀번호

**Responses:**
- `200`: 로그인 성공 (`LoginResponseDto`)
- `401`: 로그인 실패 (`ErrorResponseDto`)
- `500`: 서버 에러 (`ErrorResponseDto`)

#### [POST] /api/auth/signup
새로운 사용자로 회원가입합니다.

**Request Body:** `UserSignupDto`
- `name` (string, required): 이름
- `email` (string, email, required): 이메일
- `password` (string, required): 비밀번호
- `passwordConfirm` (string, required): 비밀번호 확인

**Responses:**
- `201`: 회원가입 성공
- `400`: 잘못된 요청 (`ErrorResponseDto`)
- `500`: 서버 에러 (`ErrorResponseDto`)

#### [POST] /api/auth/password
현재 비밀번호를 변경합니다.

**Request Body:** `PasswordChangeDto`
- `currentPassword` (string, required): 현재 비밀번호
- `newPassword` (string, required): 새 비밀번호
- `newPasswordConfirm` (string, required): 새 비밀번호 확인

**Responses:**
- `200`: 비밀번호 변경 성공
- `400`: 잘못된 요청 (`ErrorResponseDto`)
- `401`: 인증 실패 (`ErrorResponseDto`)
- `500`: 서버 에러 (`ErrorResponseDto`)

---

### Post (게시글)

#### [GET] /api/post
페이징 처리된 게시글 목록을 조회합니다.

**Parameters:**
- `page` (integer, query): 페이지 번호 (기본값: 0)
- `size` (integer, query): 페이지 크기 (기본값: 10)

**Responses:**
- `200`: 조회 성공 (`PostListResponseDto`)
- `500`: 서버 에러 (`ErrorResponseDto`)

#### [POST] /api/post
새로운 게시물을 작성합니다.

**Request Body:** `PostCreateDto`
- `title` (string, required): 게시글 제목
- `content` (string): 게시글 내용
- `tags` (string): 해시태그 (쉼표로 구분)

**Responses:**
- `201`: 작성 성공
- `401`: 인증 실패 (`ErrorResponseDto`)
- `500`: 서버 에러 (`ErrorResponseDto`)

#### [GET] /api/post/{no}
특정 게시글의 상세 정보를 조회합니다.

**Parameters:**
- `no` (integer, path, required): 게시글 번호

**Responses:**
- `200`: 조회 성공 (`PostResponseDto`)
- `404`: 게시글을 찾을 수 없음 (`ErrorResponseDto`)
- `500`: 서버 에러 (`ErrorResponseDto`)

#### [PATCH] /api/post/{no}
기존 게시글을 수정합니다. 부분 업데이트를 지원합니다.

**Parameters:**
- `no` (integer, path, required): 수정할 게시글 번호

**Request Body:** `PostUpdateDto`
- `title` (string, required): 변경할 제목
- `content` (string): 변경할 내용
- `tags` (string): 변경할 태그 (쉼표로 구분)

**Responses:**
- `200`: 수정 성공
- `400`: 잘못된 요청 (`ErrorResponseDto`)
- `401`: 인증 실패 (`ErrorResponseDto`)
- `403`: 권한 없음 (`ErrorResponseDto`)
- `404`: 게시글을 찾을 수 없음 (`ErrorResponseDto`)
- `500`: 서버 에러 (`ErrorResponseDto`)

#### [DELETE] /api/post/{no}
특정 게시글을 삭제합니다.

**Parameters:**
- `no` (integer, path, required): 삭제할 게시글 번호

**Responses:**
- `200`: 삭제 성공
- `401`: 인증 실패 (`ErrorResponseDto`)
- `403`: 권한 없음 (`ErrorResponseDto`)
- `404`: 게시글을 찾을 수 없음 (`ErrorResponseDto`)
- `500`: 서버 에러 (`ErrorResponseDto`)

---

### User

#### [GET] /api/user/me
현재 로그인된 사용자의 상세 정보를 조회합니다.

**Responses:**
- `200`: 조회 성공 (`UserResponseDto`)
- `401`: 인증 실패 (`ErrorResponseDto`)
- `500`: 서버 에러 (`ErrorResponseDto`)

---

## Data Models (Schemas)

### ErrorResponseDto
- `message` (string): 에러 메시지
- `status` (integer): HTTP 상태 코드

### LoginRequestDto
- `email` (string, email): 사용자 이메일
- `password` (string): 사용자 비밀번호

### LoginResponseDto
- `accessToken` (string): 액세스 토큰
- `tokenType` (string): 토큰 타입 (e.g., Bearer)
- `userName` (string): 사용자 이름

### UserSignupDto
- `name` (string): 이름
- `email` (string, email): 이메일
- `password` (string): 비밀번호
- `passwordConfirm` (string): 비밀번호 확인

### PasswordChangeDto
- `currentPassword` (string): 현재 비밀번호
- `newPassword` (string): 새 비밀번호
- `newPasswordConfirm` (string): 새 비밀번호 확인

### PostCreateDto
- `title` (string): 게시글 제목
- `content` (string): 게시글 내용
- `tags` (string): 해시태그

### PostListDto
- `no` (integer): 게시글 번호
- `title` (string): 제목
- `createdAt` (string, date-time): 생성 일시
- `views` (integer): 조회수
- `authorName` (string): 작성자 이름

### PostListResponseDto
- `posts` (Array<PostListDto>): 게시글 목록
- `currentPage` (integer): 현재 페이지 번호
- `totalPages` (integer): 전체 페이지 수

### PostResponseDto
- `no` (integer): 게시글 번호
- `title` (string): 제목
- `content` (string): 내용
- `createdAt` (string, date-time): 생성 일시
- `updatedAt` (string, date-time): 수정 일시
- `views` (integer): 조회수
- `tags` (string): 태그 리스트
- `authorName` (string): 작성자 이름
- `authorNo` (integer): 작성자 번호

### UserResponseDto
- `no` (integer): 사용자 번호
- `name` (string): 이름
- `email` (string): 이메일
