"use client";

import React, { createContext, useState, useEffect, useCallback } from "react";
import { User, LoginRequest, LoginResponse } from "@/types/auth";
import { refreshAccessToken } from "@/lib/auth";
import { post, get } from "@/lib/api";

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = useCallback(async (token: string) => {
    try {
      const userData = await get<User>("/api/user/me", token);
      setUser(userData);
    } catch (error) {
      console.error("Failed to fetch user:", error);
      logout();
    }
  }, []);

  const login = async (credentials: LoginRequest) => {
    try {
      const data = await post<LoginResponse>("/api/login", credentials);
      setAccessToken(data.accessToken);
      await fetchUser(data.accessToken);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = useCallback(() => {
    setAccessToken(null);
    setUser(null);
    // Note: Refresh token cookie disposal is usually handled by the server (HttpOnly)
  }, []);

  const restoreSession = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = await refreshAccessToken();
      if (token) {
        setAccessToken(token);
        await fetchUser(token);
      }
    } catch (error) {
      console.error("Session restoration failed:", error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchUser]);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
