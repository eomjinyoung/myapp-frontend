import { ENV } from "@/config/env";
import { tokenStorage } from "@/utils/tokenStorage";
import { handleResponse } from "./apiUtils";

type FetchOptions = RequestInit & {
    params?: Record<string, string>;
};

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const onRefreshed = (token: string) => {
    refreshSubscribers.forEach((callback) => callback(token));
    refreshSubscribers = [];
};

const addRefreshSubscriber = (callback: (token: string) => void) => {
    refreshSubscribers.push(callback);
};

export const fetchClient = async (
    endpoint: string,
    { params, ...options }: FetchOptions = {}
): Promise<Response> => {
    const baseUrl = ENV.API_BASE_URL;
    let url = endpoint.startsWith('http') ? endpoint : `${baseUrl}${endpoint}`;

    if (params) {
        const searchParams = new URLSearchParams(params);
        url += `?${searchParams.toString()}`;
    }

    const accessToken = tokenStorage.getAccessToken();
    const headers = new Headers(options.headers);

    if (!headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
    }

    if (accessToken) {
        headers.set('Authorization', `Bearer ${accessToken}`);
    }

    const response = await fetch(url, { ...options, headers });

    if (response.status === 401) {
        const refreshToken = tokenStorage.getRefreshToken();

        if (!refreshToken) {
            handleTokenExpired();
            return response;
        }

        if (!isRefreshing) {
            isRefreshing = true;
            try {
                const reissueResponse = await fetch(`${baseUrl}/api/reissue`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ refreshToken }),
                });

                if (reissueResponse.ok) {
                    const data = await handleResponse<any>(reissueResponse);
                    const newAccessToken = data.accessToken;
                    const newRefreshToken = data.refreshToken;

                    tokenStorage.setAccessToken(newAccessToken);
                    if (newRefreshToken) {
                        tokenStorage.setRefreshToken(newRefreshToken);
                    }

                    onRefreshed(newAccessToken);
                    isRefreshing = false;

                    // Retry the original request
                    headers.set('Authorization', `Bearer ${newAccessToken}`);
                    return fetch(url, { ...options, headers });
                } else {
                    handleTokenExpired();
                    return response;
                }
            } catch (error) {
                handleTokenExpired();
                return response;
            }
        }

        // Wait for the token to be refreshed
        return new Promise((resolve) => {
            addRefreshSubscriber((token) => {
                headers.set('Authorization', `Bearer ${token}`);
                resolve(fetch(url, { ...options, headers }));
            });
        });
    }

    return response;
};

const handleTokenExpired = () => {
    tokenStorage.clearTokens();
    window.location.href = '/login';
};
