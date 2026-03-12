import { ApiError, ApiResponse } from "@/types/api";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

interface FetchOptions extends RequestInit {
  token?: string;
}

export async function apiFetch<T>(
  url: string,
  options: FetchOptions = {}
): Promise<T> {
  const { token, ...restOptions } = options;

  const headers = new Headers(restOptions.headers);
  headers.set("Content-Type", "application/json");

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${BASE_URL}${url}`, {
    ...restOptions,
    headers,
  });

  if (response.status === 401 && url !== "/api/login" && url !== "/api/signup" && url !== "/api/reissue") {
    try {
      // 1. Refresh Access Token directly from backend
      const refreshResponse = await fetch(`${BASE_URL}/api/reissue`, {
        method: "POST",
      });

      if (refreshResponse.ok) {
        const { accessToken } = await refreshResponse.json();

        // 2. Retry original request with new token
        const retryHeaders = new Headers(headers);
        retryHeaders.set("Authorization", `Bearer ${accessToken}`);

        const retryResponse = await fetch(`${BASE_URL}${url}`, {
          ...restOptions,
          headers: retryHeaders,
        });

        if (retryResponse.ok) {
          const result: ApiResponse<T> = await retryResponse.json();
          return result.data;
        }
      }
    } catch (error) {
      console.error("Token refresh failed:", error);
    }

    // 3. Redirect to login if refresh or retry fails
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    throw {
      message: "Unauthorized",
      status: 401,
      code: "UNAUTHORIZED",
    } as ApiError;
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error: ApiError = {
      message: errorData.message || response.statusText,
      status: response.status,
      code: errorData.code,
    };
    throw error;
  }

  const result: ApiResponse<T> = await response.json();
  return result.data;
}

export const get = <T>(url: string, token?: string) =>
  apiFetch<T>(url, { method: "GET", token });

export const post = <T>(url: string, body: any, token?: string) =>
  apiFetch<T>(url, {
    method: "POST",
    body: JSON.stringify(body),
    token,
  });

export const put = <T>(url: string, body: any, token?: string) =>
  apiFetch<T>(url, {
    method: "PUT",
    body: JSON.stringify(body),
    token,
  });

export const del = <T>(url: string, token?: string) =>
  apiFetch<T>(url, { method: "DELETE", token });
