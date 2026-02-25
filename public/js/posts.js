/**
 * 게시글 CRUD 로직을 담당하는 모듈
 */

const posts = {
    /**
     * 게시글 목록 조회
     */
    fetchList: async (page = 0, size = 10) => {
        try {
            const response = await api.request(`/api/posts?page=${page + 1}&size=${size}`);
            if (response && response.ok) {
                return await response.json();
            }
            return null;
        } catch (err) {
            console.error('Fetch posts list error:', err);
            return null;
        }
    },

    /**
     * 게시글 상세 조회
     */
    fetchDetail: async (no) => {
        try {
            const response = await api.request(`/api/posts/${no}`);
            if (response && response.ok) {
                return await response.json();
            }
            return null;
        } catch (err) {
            console.error('Fetch post detail error:', err);
            return null;
        }
    },

    /**
     * 게시글 저장 (등록 또는 수정)
     */
    save: async (data, no = null) => {
        const url = no ? `/api/posts/${no}` : '/api/posts';
        const method = no ? 'PATCH' : 'POST';

        try {
            const response = await api.request(url, {
                method: method,
                body: JSON.stringify(data)
            });

            if (response && (response.ok || response.status === 201)) {
                return true;
            } else {
                const errorData = await response.json().catch(() => ({}));
                alert(errorData.message || '게시글 저장에 실패했습니다.');
                return false;
            }
        } catch (err) {
            console.error('Save post error:', err);
            alert('서버와 통신 중 오류가 발생했습니다.');
            return false;
        }
    },

    /**
     * 게시글 삭제
     */
    delete: async (no) => {
        if (!confirm('정말 삭제하시겠습니까?')) return false;

        try {
            const response = await api.request(`/api/posts/${no}`, {
                method: 'DELETE'
            });

            if (response && response.ok) {
                alert('삭제되었습니다.');
                return true;
            } else {
                const errorData = await response.json().catch(() => ({}));
                alert(errorData.message || '삭제에 실패했습니다.');
                return false;
            }
        } catch (err) {
            console.error('Delete post error:', err);
            alert('서버와 통신 중 오류가 발생했습니다.');
            return false;
        }
    },

    /**
     * 날짜 포맷팅 유틸리티
     */
    formatDate: (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
};

// 전역 등록
window.posts = posts;
