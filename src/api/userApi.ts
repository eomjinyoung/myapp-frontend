import { fetchClient } from './fetchClient';
import { handleResponse } from './apiUtils';
import type { UserResponse, PasswordChangeRequest } from '@/types';

export const userApi = {
    getMe: async (): Promise<UserResponse> => {
        const response = await fetchClient('/api/user/me');
        return handleResponse<UserResponse>(response);
    },

    changePassword: async (data: PasswordChangeRequest): Promise<void> => {
        const response = await fetchClient('/api/user/password', {
            method: 'POST',
            body: JSON.stringify(data),
        });
        await handleResponse<void>(response);
    },
};
