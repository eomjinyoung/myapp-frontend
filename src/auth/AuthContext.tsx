import React, { createContext, useContext, useState, useEffect } from 'react';
import { getMe } from '../api/user';
import type { UserProfile } from '../api/user';
import { getAccessToken, clearTokens } from '../auth/tokenStorage';

interface AuthContextType {
    user: UserProfile | null;
    loading: boolean;
    login: (user: UserProfile) => void;
    logout: () => void;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = async () => {
        const token = getAccessToken();
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const userData = await getMe();
            setUser(userData);
        } catch (error) {
            console.error("Failed to fetch user profile:", error);
            // 토큰은 있지만 프로필 페치에 실패한 경우 (만료 등)
            // refreshTokens()가 http 래퍼에서 처리되겠지만, 여기서 최종 실패하면 로그아웃 처리할 수도 있음
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const login = (userData: UserProfile) => {
        setUser(userData);
    };

    const logout = () => {
        clearTokens();
        setUser(null);
    };

    const refreshUser = async () => {
        await fetchUser();
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
