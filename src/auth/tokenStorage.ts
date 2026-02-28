import type { TokenPair } from "./types";

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

/**
 * Access Token 조회
 */
export const getAccessToken = (): string | null => {
    try {
        return localStorage.getItem(ACCESS_TOKEN_KEY);
    } catch (error) {
        console.error("Access Token 조회 실패:", error);
        return null;
    }
};

/**
 * Access Token 저장
 */
export const setAccessToken = (token: string): void => {
    try {
        localStorage.setItem(ACCESS_TOKEN_KEY, token);
    } catch (error) {
        console.error("Access Token 저장 실패:", error);
    }
};

/**
 * Refresh Token 조회
 */
export const getRefreshToken = (): string | null => {
    try {
        return localStorage.getItem(REFRESH_TOKEN_KEY);
    } catch (error) {
        console.error("Refresh Token 조회 실패:", error);
        return null;
    }
};

/**
 * Refresh Token 저장
 */
export const setRefreshToken = (token: string): void => {
    try {
        localStorage.setItem(REFRESH_TOKEN_KEY, token);
    } catch (error) {
        console.error("Refresh Token 저장 실패:", error);
    }
};

/**
 * 모든 토큰 저장 (Access + Refresh)
 */
export const setTokens = ({ accessToken, refreshToken }: TokenPair): void => {
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
};

/**
 * 모든 토큰 삭제
 */
export const clearTokens = (): void => {
    try {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
    } catch (error) {
        console.error("토큰 삭제 실패:", error);
    }
};
