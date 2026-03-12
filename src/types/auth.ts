export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  tokenType: string;
  userName: string;
}

export interface User {
  no: number;
  name: string;
  email: string;
}
