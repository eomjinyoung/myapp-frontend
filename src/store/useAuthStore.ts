import { create } from 'zustand'
import { User, LoginRequest, LoginResponse } from '@/types/auth'
import { apiFetch, setAccessToken, removeAccessToken, getAccessToken } from '@/lib/api'

interface AuthState {
  user: User | null
  isLoading: boolean
  login: (data: LoginRequest) => Promise<void>
  logout: () => Promise<void>
  restoreSession: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true, // 초기 서버 렌더링 시 깜빡임 방지를 위해 true 시작 (하이드레이션 후 복구)

  restoreSession: async () => {
    // 이미 클라이언트가 마운트 되었고, 토큰이 없다면 세션이 없는 것
    const token = getAccessToken()
    if (!token) {
      set({ isLoading: false, user: null })
      return
    }

    try {
      const userData = await apiFetch<User>('/api/user/me')
      set({ user: userData })
      // 세션 복구 성공 시에도 쿠키 상태 보정 (미들웨어용)
      document.cookie = 'authStatus=true; path=/; samesite=lax'
    } catch (error) {
      console.error('Session restoration failed:', error)
      removeAccessToken()
      set({ user: null })
      // 토큰 Му효 시 쿠키 제거
      document.cookie = 'authStatus=; path=/; max-age=0'
    } finally {
      set({ isLoading: false })
    }
  },

  login: async (data: LoginRequest) => {
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
          throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.')
        }
        if (response.status === 403) {
          throw new Error('계정이 잠금 상태입니다. 관리자에게 문의하세요.')
        }
        throw new Error('로그인 중 오류가 발생했습니다.')
      }

      const loginData: LoginResponse = await response.json()
      setAccessToken(loginData.accessToken)
      
      // Middleware 인증 확인용 쿠키 설정 (로그인 성공 시)
      document.cookie = 'authStatus=true; path=/; samesite=lax'

      const userData = await apiFetch<User>('/api/user/me')
      set({ user: userData })
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  },

  logout: async () => {
    try {
      await apiFetch('/api/logout', {
        method: 'POST',
      })
    } catch (error) {
      console.error('Logout request failed:', error)
    } finally {
      removeAccessToken()
      set({ user: null })
      // 로그아웃 시 인증 상태 쿠키 삭제
      document.cookie = 'authStatus=; path=/; max-age=0'
    }
  },
}))
