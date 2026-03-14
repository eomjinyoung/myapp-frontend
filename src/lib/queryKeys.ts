// 도메인별 쿼리 키를 상수로 관리합니다.
// 배열 형태로 관리하여 쿼리 무효화 및 캐싱 시 오타 방지와 구조적인 접근을 지원합니다.

export const queryKeys = {
  // 인증 및 사용자 관련
  auth: {
    me: () => ['auth', 'me'] as const,
  },
  
  // 게시글 관련
  posts: {
    all: () => ['posts'] as const,
    list: (filters?: any) => ['posts', 'list', filters] as const,
    detail: (no: string | number) => ['posts', 'detail', String(no)] as const,
  },
} as const
