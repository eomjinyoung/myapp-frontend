const API_URL = import.meta.env.VITE_API_URL || '';

interface RequestOptions extends RequestInit {
    auth?: boolean;
}

export class ApiError extends Error {
    constructor(public status: number, public message: string) {
        super(message);
    }
}

async function refreshToken(): Promise<string | null> {
    const refresh = localStorage.getItem('refreshToken');
    if (!refresh) return null;

    try {
        const response = await fetch(`${API_URL}/api/reissue`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken: refresh }),
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('refreshToken', data.refreshToken);
            return data.accessToken;
        }
    } catch (error) {
        console.error('Failed to refresh token', error);
    }
    return null;
}

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const { auth = true, ...fetchOptions } = options;
    let token = localStorage.getItem('accessToken');

    const headers = new Headers(fetchOptions.headers);
    if (!headers.has('Content-Type') && !(fetchOptions.body instanceof FormData)) {
        headers.set('Content-Type', 'application/json');
    }

    if (auth && token) {
        headers.set('Authorization', `Bearer ${token}`);
    }

    let response = await fetch(`${API_URL}${path}`, {
        ...fetchOptions,
        headers,
    });

    if (response.status === 401 && auth) {
        const newToken = await refreshToken();
        if (newToken) {
            headers.set('Authorization', `Bearer ${newToken}`);
            response = await fetch(`${API_URL}${path}`, {
                ...fetchOptions,
                headers,
            });
        } else {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            window.location.href = '/login';
            throw new ApiError(401, 'Unauthorized');
        }
    }

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new ApiError(response.status, data?.message || 'Something went wrong');
    }

    return data as T;
}

export const api = {
    get: <T>(path: string, options?: RequestOptions) => request<T>(path, { ...options, method: 'GET' }),
    post: <T>(path: string, body?: any, options?: RequestOptions) => request<T>(path, { ...options, method: 'POST', body: JSON.stringify(body) }),
    patch: <T>(path: string, body?: any, options?: RequestOptions) => request<T>(path, { ...options, method: 'PATCH', body: JSON.stringify(body) }),
    delete: <T>(path: string, options?: RequestOptions) => request<T>(path, { ...options, method: 'DELETE' }),
};
