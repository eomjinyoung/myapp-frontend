import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserResponseDto } from '../types/api';
import { api } from '../api/client';

interface AuthContextType {
    user: UserResponseDto | null;
    loading: boolean;
    login: (accessToken: string, refreshToken: string, userName: string) => void;
    logout: () => void;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserResponseDto | null>(null);
    const [loading, setLoading] = useState(true);

    const refreshUser = async () => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            setUser(null);
            setLoading(false);
            return;
        }

        try {
            const userData = await api.get<UserResponseDto>('/api/user/me');
            setUser(userData);
        } catch (error) {
            console.error('Failed to fetch user', error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshUser();
    }, []);

    const login = (accessToken: string, refreshToken: string, userName: string) => {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('userName', userName);
        refreshUser();
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userName');
        setUser(null);
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
