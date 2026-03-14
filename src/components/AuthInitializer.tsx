'use client'

import React, { useEffect } from 'react'
import { useAuthStore } from '@/store/useAuthStore'

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const restoreSession = useAuthStore((state) => state.restoreSession)

  // 컴포넌트 마운트 시 (클라이언트 환경에서만) 세션을 복원합니다.
  useEffect(() => {
    restoreSession()
  }, [restoreSession])

  return <>{children}</>
}
