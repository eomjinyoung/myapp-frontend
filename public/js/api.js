/**
 * API 통신 및 인증 관리를 담당하는 모듈
 */

// 개발 및 운영 환경에 따른 API 베이스 URL 설정
// 브라우저 환경이므로 location.hostname을 기반으로 판단하거나, 
// 서버에서 주입해준 환경 변수를 사용할 수 있습니다.
const API_BASE_URL = location.hostname === 'localhost' || location.hostname === '127.0.0.1'
    ? 'http://localhost:8080'
    : 'https://api.yourdomain.com';

const STORAGE_KEYS = {
    ACCESS_TOKEN: 'access_token',
    REFRESH_TOKEN: 'refresh_token'
};

const api = {
    /**
     * 로컬 스토리지에서 토큰을 가져옵니다.
     */
    getTokens: () => ({
        access: localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN),
        refresh: localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)
    }),

    /**
     * 토큰을 로컬 스토리지에 저장합니다.
     */
    saveTokens: (access, refresh) => {
        if (access) localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, access);
        if (refresh) localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refresh);
    },

    /**
     * 모든 토큰을 삭제하고 로그인 페이지로 리다이렉트합니다.
     */
    clearAndRedirect: () => {
        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
        location.href = '/login.html';
    },

    /**
     * 토큰 갱신을 시도합니다.
     */
    refreshToken: async () => {
        const { refresh } = api.getTokens();
        if (!refresh) return false;

        try {
            const response = await fetch(`${API_BASE_URL}/api/reissue`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refreshToken: refresh })
            });

            if (response.ok) {
                const data = await response.json();
                // 응답 구조는 API 명세에 따라 수정 필요 (예: data.accessToken)
                api.saveTokens(data.accessToken, data.refreshToken);
                return true;
            }
        } catch (error) {
            console.error('Token refresh failed:', error);
        }
        return false;
    },

    /**
     * 공통 Fetch 요청 함수
     */
    request: async (endpoint, options = {}) => {
        const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

        // 기본 헤더 설정
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        // 토큰이 있으면 Authorization 헤더 추가
        const { access } = api.getTokens();
        if (access) {
            headers['Authorization'] = `Bearer ${access}`;
        }

        const config = {
            ...options,
            headers
        };

        try {
            let response = await fetch(url, config);

            // 401 Unauthorized 에러 발생 시 토큰 갱신 시도
            if (response.status === 401) {
                console.warn('Access token expired. Attempting refresh...');
                const success = await api.refreshToken();

                if (success) {
                    // 갱신 성공 시 새로운 토큰으로 헤더 업데이트 후 재요청
                    const { access: newAccess } = api.getTokens();
                    config.headers['Authorization'] = `Bearer ${newAccess}`;
                    response = await fetch(url, config);
                } else {
                    // 갱신 실패 시 로그아웃 처리
                    api.clearAndRedirect();
                    return null;
                }
            }

            // 403 Forbidden 에러 처리 (권한 없음)
            if (response.status === 403) {
                const errorData = await response.clone().json().catch(() => ({}));
                alert(errorData.message || '해당 작업에 대한 권한이 없습니다.');
                // 권한 오류 시 보통 인덱스로 보내거나 현재 페이지 유지
            }

            return response;
        } catch (error) {
            console.error('API Request Error:', error);
            throw error;
        }
    }
};

// 전역에서 사용할 수 있도록 export (또는 window 객체에 등록)
window.api = api;
