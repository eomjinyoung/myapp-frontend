'use client'

import React, { createContext, useState, useEffect, useCallback } from 'react'
import { User, LoginRequest, LoginResponse } from '@/types/auth'
import { apiFetch, setAccessToken, removeAccessToken, getAccessToken } from '@/lib/api'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (data: LoginRequest) => Promise<void>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const restoreSession = useCallback(async () => {
    const token = getAccessToken()
    if (!token) {
      setIsLoading(false)
      return
    }

    try {
      const userData = await apiFetch<User>('/api/user/me')
      setUser(userData)
    } catch (error) {
      console.error('Session restoration failed:', error)
      removeAccessToken()
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    restoreSession()
  }, [restoreSession])

  const login = async (data: LoginRequest) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include',
      })

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('이메일 또는 비밀번호가 일치하지 않습니다.')
        }
        if (response.status === 403) {
          throw new Error('계정이 잠금 상태입니다. 관리자에게 문의하세요.')
        }
        throw new Error('로그인 중 오류가 발생했습니다.')
      }

      const loginData: LoginResponse = await response.json()
      setAccessToken(loginData.accessToken)

      const userData = await apiFetch<User>('/api/user/me')
      setUser(userData)
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  const logout = async () => {
    try {
      await apiFetch('/api/logout', {
        method: 'POST',
      })
    } catch (error) {
      console.error('Logout request failed:', error)
    } finally {
      removeAccessToken()
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
