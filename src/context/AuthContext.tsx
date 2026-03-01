import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { tokenStorage } from '@/utils/tokenStorage';
import { authApi } from '@/api/authApi';
import type { LoginRequest } from '@/types';

interface AuthContextType {
    accessToken: string | null;
    userName: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (data: LoginRequest) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [userName, setUserName] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = tokenStorage.getAccessToken();
        const name = tokenStorage.getUserName();
        if (token) {
            setAccessToken(token);
        }
        if (name) {
            setUserName(name);
        }
        setIsLoading(false);
    }, []);

    const login = async (data: LoginRequest) => {
        try {
            const response = await authApi.login(data);
            setAccessToken(response.accessToken);
            setUserName(response.userName);
            tokenStorage.setUserName(response.userName);
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await authApi.logout();
        } finally {
            setAccessToken(null);
            setUserName(null);
            tokenStorage.clearTokens();
        }
    };

    return (
        <AuthContext.Provider
            value={{
                accessToken,
                userName,
                isAuthenticated: !!accessToken,
                isLoading,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
