# API Specification Summary

- **Title**: OpenAPI definition
- **Version**: v0
- **Base URL**: http://localhost:8080

## 1. Authentication
The API uses **JWT (JSON Web Token)** based authentication.
- **Scheme**: Bearer Authentication
- **Format**: JWT
- **Requirement**: Protected endpoints require the `Authorization: Bearer <token>` header.

## 2. Key Endpoints

### Authentication & User
| Method | Path | Summary | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | 로그인 | No |
| `POST` | `/api/auth/reissue` | 토큰 재발급 | No |
| `POST` | `/api/auth/signup` | 회원가입 | No |
| `POST` | `/api/auth/logout` | 로그아웃 | Yes |
| `GET` | `/api/user/me` | 현재 사용자 정보 조회 | Yes |
| `POST` | `/api/user/password` | 비밀번호 변경 | Yes |

### Post (게시글)
| Method | Path | Summary | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/post/list` | 게시글 목록 조회 | No |
| `GET` | `/api/post/{no}` | 게시글 상세 조회 | No |
| `POST` | `/api/post` | 게시글 생성 | Yes |
| `DELETE` | `/api/post/{no}` | 게시글 삭제 | Yes |
| `PATCH` | `/api/post/{no}` | 게시글 수정 | Yes |

### Other
| Method | Path | Summary | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/hello` | hello | No |

## 3. Data Models (Schemas)

### Request Dtos
- **LoginRequestDto**: `email`, `password`
- **UserSignupDto**: `name`, `email`, `password`, `passwordConfirm`, `passwordMatching`
- **TokenReissueRequestDto**: `refreshToken`
- **PasswordChangeDto**: `currentPassword`, `newPassword`, `newPasswordConfirm`, `newPasswordMatching`
- **PostCreateDto**: `title`, `content`, `tags`
- **PostUpdateDto**: `no`, `title`, `content`, `tags`

### Response Dtos
- **LoginResponseDto**: `accessToken`, `tokenType`, `userName`, `refreshToken`
- **UserResponseDto**: `no`, `name`, `email`
- **PostListResponseDto**: `posts` (Array of `PostListDto`), `currentPage`, `totalPages`
- **PostResponseDto**: `no`, `title`, `content`, `createdAt`, `updatedAt`, `views`, `tags`, `authorName`, `authorNo`
- **ErrorResponseDto**: `message`, `status`

## 4. Logical Grouping
- **Auth Flow**: `/api/auth/login` -> `/api/auth/logout` / `/api/auth/reissue`
- **User Management**: `/api/auth/signup`, `/api/user/me`, `/api/user/password`
- **Content Flow**: `/api/post/list` -> `/api/post/{no}` -> `/api/post` (create)
