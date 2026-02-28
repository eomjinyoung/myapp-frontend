import { http } from "./http";
import type { components } from "../types/openapi";

export type PostListItem = components["schemas"]["PostListDto"];
export type PostDetail = components["schemas"]["PostResponseDto"];
export type PostCreateRequest = components["schemas"]["PostCreateDto"];
export type PostUpdateRequest = components["schemas"]["PostUpdateDto"];
export type PostListResponse = components["schemas"]["PostListResponseDto"];

/**
 * 게시물 목록 조회 (페이징 포함)
 */
export const getPosts = async (page: number = 1): Promise<PostListResponse> => {
    return http.get<PostListResponse>("/api/post", { params: { page: String(page) } });
};

/**
 * 게시물 상세 조회
 */
export const getPost = async (no: number): Promise<PostDetail> => {
    return http.get<PostDetail>(`/api/post/${no}`);
};

/**
 * 게시물 등록
 */
export const createPost = async (data: PostCreateRequest): Promise<void> => {
    return http.post<void>("/api/post", data);
};

/**
 * 게시물 수정 (PATCH)
 */
export const updatePost = async (no: number, data: PostUpdateRequest): Promise<void> => {
    return http.patch<void>(`/api/post/${no}`, data);
};

/**
 * 게시물 삭제
 */
export const deletePost = async (no: number): Promise<void> => {
    return http.delete<void>(`/api/post/${no}`);
};
