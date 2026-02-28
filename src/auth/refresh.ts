import { API_BASE_URL } from "../config/env";
import { getRefreshToken, setTokens, clearTokens } from "./tokenStorage";
import type { TokenPair } from "./types";

/**
 * 401 에러가 여러 번 발생해도 refresh 요청을 한 번만 보내기 위한 "single flight" Promise
 */
let refreshPromise: Promise<TokenPair> | null = null;

/**
 * Refresh Token을 사용하여 Access/Refresh 토큰 쌍을 재발급받습니다.
 */
export async function refreshTokens(): Promise<TokenPair> {
    // 이미 진행 중인 refresh 요청이 있다면 그 결과를 기다립니다. (Single Flight)
    if (refreshPromise) {
        return refreshPromise;
    }

    const refreshToken = getRefreshToken();
    if (!refreshToken) {
        clearTokens();
        throw new Error("Refresh Token이 없습니다. 다시 로그인해 주세요.");
    }

    refreshPromise = (async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/reissue`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify({ refreshToken }),
            });

            if (!response.ok) {
                throw new Error("토큰 재발급에 실패했습니다.");
            }

            const tokens: TokenPair = await response.json();

            // 새 토큰 저장
            setTokens(tokens);

            return tokens;
        } catch (error) {
            // 실패 시 토큰 정보 삭제
            clearTokens();
            throw error;
        } finally {
            // 작업 완료 후 Promise 초기화
            refreshPromise = null;
        }
    })();

    return refreshPromise;
}
