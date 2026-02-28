import { API_BASE_URL } from "../config/env";
import { getAccessToken, getRefreshToken, clearTokens } from "../auth/tokenStorage";
import { refreshTokens } from "../auth/refresh";
import { ApiError } from "./errors";

interface RequestOptions extends RequestInit {
    params?: Record<string, string>;
    _isRetry?: boolean;
}

/**
 * Fetch API 기반 공통 request 래퍼
 */
export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const { params, headers: customHeaders, body, _isRetry, ...restOptions } = options;

    // 1. URL 구성 (Query Parameters 처리)
    const url = new URL(path, API_BASE_URL);
    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            url.searchParams.append(key, value);
        });
    }

    // 2. 기본 헤더 설정
    const headers = new Headers(customHeaders);
    headers.set("Accept", "application/json");

    // Body가 있으면 Content-Type 설정 (단, FormData 등 브라우저가 자동 설정해야 하는 경우는 제외 가능성 고려)
    if (body && !(body instanceof FormData) && !headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
    }

    // 3. 인가 헤더 (Access Token) 자동 주입
    const token = getAccessToken();
    if (token) {
        headers.set("Authorization", `Bearer ${token}`);
    }

    // 4. 요청 실행
    const response = await fetch(url.toString(), {
        ...restOptions,
        headers,
        body: body && typeof body === "object" && !(body instanceof FormData)
            ? JSON.stringify(body)
            : body,
    });

    // 5. 응답 처리
    let payload: any;
    const contentType = response.headers.get("Content-Type");

    if (contentType && contentType.includes("application/json")) {
        payload = await response.json();
    } else {
        payload = await response.text();
    }

    // 6. 에러 처리 및 401 재발급 로직
    if (!response.ok) {
        // 401 Unauthorized 발생 시 토큰 재시도 로직
        if (response.status === 401 && !_isRetry) {
            const refreshToken = getRefreshToken();

            if (refreshToken) {
                try {
                    // 토큰 재발급 시도 (Single Flight 처리됨)
                    await refreshTokens();

                    // 성공 시 원래 요청 1회 재시도 (_isRetry: true)
                    return request<T>(path, { ...options, _isRetry: true });
                } catch (refreshError) {
                    // 재발급 실패 시 토큰 비우고 에러 던짐
                    clearTokens();
                    throw new ApiError(401, "세션이 만료되었습니다. 다시 로그인해 주세요.", payload);
                }
            }
        }

        const errorMessage = payload?.message || payload || `요청 실패 (Status: ${response.status})`;
        throw new ApiError(response.status, errorMessage, payload);
    }

    return payload as T;
}

/**
 * 편리한 메서드 래퍼들
 */
export const http = {
    get: <T>(path: string, options?: RequestOptions) =>
        request<T>(path, { ...options, method: "GET" }),

    post: <T>(path: string, body?: any, options?: RequestOptions) =>
        request<T>(path, { ...options, method: "POST", body }),

    put: <T>(path: string, body?: any, options?: RequestOptions) =>
        request<T>(path, { ...options, method: "PUT", body }),

    delete: <T>(path: string, options?: RequestOptions) =>
        request<T>(path, { ...options, method: "DELETE" }),

    patch: <T>(path: string, body?: any, options?: RequestOptions) =>
        request<T>(path, { ...options, method: "PATCH", body }),
};
