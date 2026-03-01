export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    accessToken: string;
    tokenType: string;
    userName: string;
    refreshToken: string;
}

export interface SignupRequest {
    name: string;
    email: string;
    password: string;
    passwordConfirm: string;
    passwordMatching?: boolean;
}

export interface TokenReissueRequest {
    refreshToken: string;
}

export interface TokenReissueResponse {
    accessToken: string;
    refreshToken?: string;
}
