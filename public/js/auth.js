const Auth = {
    getAccessToken() {
        return localStorage.getItem('accessToken');
    },
    getRefreshToken() {
        return localStorage.getItem('refreshToken');
    },
    getUserName() {
        return localStorage.getItem('userName');
    },
    setTokens(data) {
        if (data.accessToken) localStorage.setItem('accessToken', data.accessToken);
        if (data.refreshToken) localStorage.setItem('refreshToken', data.refreshToken);
        if (data.userName) localStorage.setItem('userName', data.userName);
    },
    clearTokens() {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userName');
    },
    async logout() {
        try {
            if (typeof API !== 'undefined') {
                await API.call('/api/logout', { method: 'POST' });
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            this.clearTokens();
        }
    },
    isLoggedIn() {
        return !!this.getAccessToken();
    }
};

window.Auth = Auth;
