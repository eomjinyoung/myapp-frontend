const ACCESS_TOKEN_KEY = 'accessToken';
const USER_NAME_KEY = 'userName';

export const tokenStorage = {
    getAccessToken: () => localStorage.getItem(ACCESS_TOKEN_KEY),
    setAccessToken: (token: string) => localStorage.setItem(ACCESS_TOKEN_KEY, token),
    getUserName: () => localStorage.getItem(USER_NAME_KEY),
    setUserName: (name: string) => localStorage.setItem(USER_NAME_KEY, name),
    clearTokens: () => {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(USER_NAME_KEY);
    },
};
