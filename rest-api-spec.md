# REST API 문서

이 문서는 애플리케이션에서 사용 가능한 REST API 엔드포인트에 대해 설명합니다.

## 인증
API는 JWT 토큰을 사용하는 Bearer 인증 방식을 사용합니다. 요청 시 `Authorization: Bearer <token>` 헤더를 포함해야 합니다.

---

## API 엔드포인트

### 인증 (Auth)

#### [POST] /api/auth/login
로그인을 수행하고 액세스 토큰을 발급받습니다.

**요청 본문(Request Body):** `LoginRequestDto`
- `email` (문자열, 이메일 형식, 필수): 사용자 이메일
- `password` (문자열, 필수): 사용자 비밀번호

**응답(Responses):**
- `200`: 로그인 성공 (`LoginResponseDto`)
- `401`: 로그인 실패 (`ErrorResponseDto`)
- `500`: 서버 에러 (`ErrorResponseDto`)

#### [POST] /api/auth/signup
새로운 사용자로 회원가입합니다.

**요청 본문(Request Body):** `UserSignupDto`
- `name` (문자열, 필수): 이름
- `email` (문자열, 이메일 형식, 필수): 이메일
- `password` (문자열, 필수): 비밀번호
- `passwordConfirm` (문자열, 필수): 비밀번호 확인

**응답(Responses):**
- `201`: 회원가입 성공
- `400`: 잘못된 요청 (`ErrorResponseDto`)
- `500`: 서버 에러 (`ErrorResponseDto`)

#### [POST] /api/auth/password
현재 사용자의 비밀번호를 변경합니다.

**요청 본문(Request Body):** `PasswordChangeDto`
- `currentPassword` (문자열, 필수): 현재 비밀번호
- `newPassword` (문자열, 필수): 새 비밀번호
- `newPasswordConfirm` (문자열, 필수): 새 비밀번호 확인

**응답(Responses):**
- `200`: 비밀번호 변경 성공
- `400`: 잘못된 요청 (`ErrorResponseDto`)
- `401`: 인증 실패 (`ErrorResponseDto`)
- `500`: 서버 에러 (`ErrorResponseDto`)

---

### 게시글 (Post)

#### [GET] /api/post
페이징 처리된 게시글 목록을 조회합니다.

**파라미터(Parameters):**
- `page` (정수, 쿼리): 페이지 번호 (기본값: 0)
- `size` (정수, 쿼리): 페이지 크기 (기본값: 10)

**응답(Responses):**
- `200`: 조회 성공 (`PostListResponseDto`)
- `500`: 서버 에러 (`ErrorResponseDto`)

#### [POST] /api/post
새로운 게시물을 작성합니다.

**요청 본문(Request Body):** `PostCreateDto`
- `title` (문자열, 필수): 게시글 제목
- `content` (문자열): 게시글 내용
- `tags` (문자열): 해시태그 (쉼표로 구분)

**응답(Responses):**
- `201`: 작성 성공
- `401`: 인증 실패 (`ErrorResponseDto`)
- `500`: 서버 에러 (`ErrorResponseDto`)

#### [GET] /api/post/{no}
특정 게시글의 상세 정보를 조회합니다.

**파라미터(Parameters):**
- `no` (정수, 경로 변수, 필수): 게시글 번호

**응답(Responses):**
- `200`: 조회 성공 (`PostResponseDto`)
- `404`: 게시글을 찾을 수 없음 (`ErrorResponseDto`)
- `500`: 서버 에러 (`ErrorResponseDto`)

#### [PATCH] /api/post/{no}
기존 게시글을 수정합니다. 부분 업데이트(PATCH)를 지원합니다.

**파라미터(Parameters):**
- `no` (정수, 경로 변수, 필수): 수정할 게시글 번호

**요청 본문(Request Body):** `PostUpdateDto`
- `title` (문자열, 필수): 변경할 제목
- `content` (문자열): 변경할 내용
- `tags` (문자열): 변경할 태그 (쉼표로 구분)

**응답(Responses):**
- `200`: 수정 성공
- `400`: 잘못된 요청 (`ErrorResponseDto`)
- `401`: 인증 실패 (`ErrorResponseDto`)
- `403`: 권한 없음 (`ErrorResponseDto`)
- `404`: 게시글을 찾을 수 없음 (`ErrorResponseDto`)
- `500`: 서버 에러 (`ErrorResponseDto`)

#### [DELETE] /api/post/{no}
특정 게시글을 삭제합니다.

**파라미터(Parameters):**
- `no` (정수, 경로 변수, 필수): 삭제할 게시글 번호

**응답(Responses):**
- `200`: 삭제 성공
- `401`: 인증 실패 (`ErrorResponseDto`)
- `403`: 권한 없음 (`ErrorResponseDto`)
- `404`: 게시글을 찾을 수 없음 (`ErrorResponseDto`)
- `500`: 서버 에러 (`ErrorResponseDto`)

---

### 사용자 (User)

#### [GET] /api/user/me
현재 로그인된 사용자의 상세 정보를 조회합니다.

**응답(Responses):**
- `200`: 조회 성공 (`UserResponseDto`)
- `401`: 인증 실패 (`ErrorResponseDto`)
- `500`: 서버 에러 (`ErrorResponseDto`)

---

## 데이터 모델 (Schemas)

### ErrorResponseDto
- `message` (문자열): 에러 메시지
- `status` (정수): HTTP 상태 코드

### LoginRequestDto
- `email` (문자열, 이메일 형식): 사용자 이메일
- `password` (문자열): 사용자 비밀번호

### LoginResponseDto
- `accessToken` (문자열): 액세스 토큰
- `tokenType` (문자열): 토큰 타입 (예: Bearer)
- `userName` (문자열): 사용자 이름

### UserSignupDto
- `name` (문자열): 이름
- `email` (문자열, 이메일 형식): 이메일
- `password` (문자열): 비밀번호
- `passwordConfirm` (문자열): 비밀번호 확인

### PasswordChangeDto
- `currentPassword` (문자열): 현재 비밀번호
- `newPassword` (문자열): 새 비밀번호
- `newPasswordConfirm` (문자열): 새 비밀번호 확인

### PostCreateDto
- `title` (문자열): 게시글 제목
- `content` (문자열): 게시글 내용
- `tags` (문자열): 해시태그

### PostListDto
- `no` (정수): 게시글 번호
- `title` (문자열): 제목
- `createdAt` (문자열, 일시 형식): 생성 일시
- `views` (정수): 조회수
- `authorName` (문자열): 작성자 이름

### PostListResponseDto
- `posts` (배열<PostListDto>): 게시글 목록
- `currentPage` (정수): 현재 페이지 번호
- `totalPages` (정수): 전체 페이지 수

### PostResponseDto
- `no` (정수): 게시글 번호
- `title` (문자열): 제목
- `content` (문자열): 내용
- `createdAt` (문자열, 일시 형식): 생성 일시
- `updatedAt` (문자열, 일시 형식): 수정 일시
- `views` (정수): 조회수
- `tags` (문자열): 태그 리스트
- `authorName` (문자열): 작성자 이름
- `authorNo` (정수): 작성자 번호

### UserResponseDto
- `no` (정수): 사용자 번호
- `name` (문자열): 이름
- `email` (문자열): 이메일
