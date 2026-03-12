/**
 * ErrorResponseDto
 * 에러 응답 구조
 */
export interface ApiError {
  message: string
  status: number
}

/**
 * LoginResponseDto
 * 로그인 및 토큰 재발급 성공 시 응답 구조
 */
export interface LoginResponseDto {
  accessToken: string
  tokenType: string
  userName: string
}

/**
 * Common Response Interface (optional, but helpful for generic responses)
 */
export interface ApiResponse<T> {
  data: T
}
