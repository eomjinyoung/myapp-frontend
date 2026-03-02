import { fetchClient } from './fetchClient';
import { tokenStorage } from '@/utils/tokenStorage';
import { handleResponse } from './apiUtils';
import type { LoginRequest, LoginResponse, SignupRequest, TokenReissueResponse } from '@/types';

export const authApi = {
    login: async (data: LoginRequest): Promise<LoginResponse> => {
        const response = await fetchClient('/api/login', {
            method: 'POST',
            body: JSON.stringify(data),
        });

        const result = await handleResponse<LoginResponse>(response);
        tokenStorage.setAccessToken(result.accessToken);
        return result;
    },

    logout: async (): Promise<void> => {
        await fetchClient('/api/logout', { method: 'POST' });
        tokenStorage.clearTokens();
    },

    register: async (data: SignupRequest): Promise<void> => {
        const response = await fetchClient('/api/signup', {
            method: 'POST',
            body: JSON.stringify(data),
        });
        await handleResponse<void>(response);
    },

    refreshAccessToken: async (): Promise<TokenReissueResponse> => {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/reissue`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        });
        return handleResponse<TokenReissueResponse>(response);
    },
};
