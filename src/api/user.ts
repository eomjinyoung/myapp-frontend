import { http } from "./http";
import type { components } from "../types/openapi";

export type UserProfile = components["schemas"]["UserResponseDto"];

/**
 * 현재 로그인된 사용자 정보 조회
 */
export const getMe = async (): Promise<UserProfile> => {
    return http.get<UserProfile>("/api/user/me");
};
