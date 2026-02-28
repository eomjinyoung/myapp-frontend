import { http } from "./http";
import type { components } from "../types/openapi";

export type Post = components["schemas"]["Post"];
export type PostRequest = components["schemas"]["PostRequest"];

/**
 * 게시물 목록 조회
 */
export const getPosts = async (): Promise<Post[]> => {
    return http.get<Post[]>("/posts");
};

/**
 * 게시물 상세 조회
 */
export const getPost = async (id: number): Promise<Post> => {
    return http.get<Post>(`/posts/${id}`);
};

/**
 * 게시물 등록
 */
export const createPost = async (data: PostRequest): Promise<Post> => {
    return http.post<Post>("/posts", data);
};

/**
 * 게시물 수정
 */
export const updatePost = async (id: number, data: PostRequest): Promise<Post> => {
    return http.put<Post>(`/posts/${id}`, data);
};

/**
 * 게시물 삭제
 */
export const deletePost = async (id: number): Promise<void> => {
    return http.delete<void>(`/posts/${id}`);
};
