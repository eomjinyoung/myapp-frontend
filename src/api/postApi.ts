import { fetchClient } from './fetchClient';
import { handleResponse } from './apiUtils';
import type { PostListResponse, PostResponse, PostCreateRequest, PostUpdateRequest } from '@/types';

export const postApi = {
    getPosts: async (page: number = 1): Promise<PostListResponse> => {
        const response = await fetchClient('/api/posts', {
            params: { page: page.toString() },
        });
        return handleResponse<PostListResponse>(response);
    },

    getPost: async (no: number): Promise<PostResponse> => {
        const response = await fetchClient(`/api/posts/${no}`);
        return handleResponse<PostResponse>(response);
    },

    createPost: async (data: PostCreateRequest): Promise<void> => {
        const response = await fetchClient('/api/posts', {
            method: 'POST',
            body: JSON.stringify(data),
        });
        await handleResponse<void>(response);
    },

    updatePost: async (no: number, data: PostUpdateRequest): Promise<void> => {
        const response = await fetchClient(`/api/posts/${no}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
        await handleResponse<void>(response);
    },

    deletePost: async (no: number): Promise<void> => {
        const response = await fetchClient(`/api/posts/${no}`, {
            method: 'DELETE',
        });
        await handleResponse<void>(response);
    },
};
