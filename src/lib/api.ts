import { ApiError, LoginResponseDto } from '@/types/api'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

const IS_SERVER = typeof window === 'undefined'

/**
 * 토큰 관리 함수 (브라우저 전용)
 * 서버 컴포넌트에서는 호출하지 마십시오.
 */
export const getAccessToken = () => {
  if (IS_SERVER) return null
  return localStorage.getItem('accessToken')
}

export const setAccessToken = (token: string) => {
  if (IS_SERVER) return
  localStorage.setItem('accessToken', token)
}

export const removeAccessToken = () => {
  if (IS_SERVER) return
  localStorage.removeItem('accessToken')
}

/**
 * 토큰 재발급 함수
 */
export const reissueToken = async (): Promise<string | null> => {
  try {
    const response = await fetch(`${BASE_URL}/api/reissue`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Refresh Token Cookie 자동 전송
    })

    if (response.ok) {
      const data: LoginResponseDto = await response.json()
      setAccessToken(data.accessToken)
      return data.accessToken
    }

    return null
  } catch (error) {
    console.error('Token reissue failed:', error)
    return null
  }
}

/**
 * 기본 fetch 래퍼 함수
 */
export const apiFetch = async <T>(url: string, options: RequestInit = {}): Promise<T> => {
  const token = getAccessToken()

  const headers = new Headers(options.headers)
  headers.set('Content-Type', 'application/json')
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const fetchOptions: RequestInit = {
    ...options,
    headers,
    credentials: 'include',
  }

  let response = await fetch(`${BASE_URL}${url}`, fetchOptions)

  // 401 Unauthorized (토큰 만료 등)
  if (response.status === 401) {
    const newToken = await reissueToken()

    if (newToken) {
      // 재발급 성공 시 새 토큰으로 원래 요청 재시도
      headers.set('Authorization', `Bearer ${newToken}`)
      response = await fetch(`${BASE_URL}${url}`, {
        ...fetchOptions,
        headers,
      })
    } else {
      // 재발급 실패 시 토큰 삭제 후 로그인 페이지로 리다이렉트
      removeAccessToken()
      if (!IS_SERVER) {
        window.location.href = '/login'
      }
      const errorData: ApiError = await response.json().catch(() => ({
        message: 'Authentication failed',
        status: 401,
      }))
      throw errorData
    }
  }

  if (!response.ok) {
    const errorData: ApiError = await response.json().catch(() => ({
      message: response.statusText,
      status: response.status,
    }))
    throw errorData
  }

  // 204 No Content 등의 경우 처리
  if (response.status === 204) {
    return {} as T
  }

  return await response.json()
}

/**
 * 편의 함수
 */
export const get = <T>(url: string, options?: RequestInit) =>
  apiFetch<T>(url, { ...options, method: 'GET' })

export const post = <T>(url: string, body: unknown, options?: RequestInit) =>
  apiFetch<T>(url, {
    ...options,
    method: 'POST',
    body: JSON.stringify(body),
  })

export const patch = <T>(url: string, body: unknown, options?: RequestInit) =>
  apiFetch<T>(url, {
    ...options,
    method: 'PATCH',
    body: JSON.stringify(body),
  })

export const del = <T>(url: string, options?: RequestInit) =>
  apiFetch<T>(url, { ...options, method: 'DELETE' })
