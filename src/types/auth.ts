/**
 * LoginRequestDto
 */
export interface LoginRequest {
  email: string
  password: string
}

/**
 * LoginResponseDto
 */
export interface LoginResponse {
  accessToken: string
  tokenType: string
  userName: string
}

/**
 * UserResponseDto
 */
export interface User {
  no: number
  name: string
  email: string
}

/**
 * UserSignupDto
 */
export interface RegisterRequest {
  name: string
  email: string
  password: string
  passwordConfirm: string
}
