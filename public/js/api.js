const API_BASE_URL = window.ENV ? window.ENV.BACKEND_API_URL : '';

const API = {
    async call(url, options = {}) {
        let fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;

        // Add Authorization header
        const token = Auth.getAccessToken();
        const headers = {
            'Content-Type': 'application/json',
            ...(options.headers || {})
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const fetchOptions = {
            ...options,
            headers
        };

        let response = await fetch(fullUrl, fetchOptions);

        // Handle Token Expiry (401)
        if (response.status === 401 && Auth.getRefreshToken()) {
            console.warn('Access token expired, attempting reissue...');
            const success = await this.reissue();
            if (success) {
                // Retry the original request
                const newToken = Auth.getAccessToken();
                headers['Authorization'] = `Bearer ${newToken}`;
                response = await fetch(fullUrl, { ...fetchOptions, headers });
            } else {
                // Reissue failed, logout user
                console.error('Session expired, logging out');
                Auth.clearTokens();
                // Avoid redirect loop if already on login page
                if (!window.location.pathname.includes('login.html')) {
                    window.location.href = '/login.html';
                }
                return response;
            }
        }

        return response;
    },

    async reissue() {
        try {
            const refreshToken = Auth.getRefreshToken();
            const response = await fetch(`${API_BASE_URL}/api/reissue`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refreshToken })
            });

            if (response.ok) {
                const data = await response.json();
                Auth.setTokens(data);
                return true;
            }
        } catch (error) {
            console.error('Reissue error:', error);
        }
        return false;
    }
};

window.API = API;
