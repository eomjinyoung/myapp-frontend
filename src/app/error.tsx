'use client'

import React, { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle, RotateCcw, Home } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button-variants'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // 에러 로깅 (운영 환경용)
    console.error('Application Error:', error)
  }, [error])

  return (
    <div className="flex min-h-[calc(100vh-160px)] flex-col items-center justify-center p-6 text-center">
      <div className="mb-6 rounded-full bg-destructive/10 p-4">
        <AlertCircle className="h-12 w-12 text-destructive" />
      </div>
      
      <h1 className="mb-2 text-3xl font-bold tracking-tight">문제가 발생했습니다</h1>
      <p className="mb-8 max-w-md text-muted-foreground">
        {error.message || '요청을 처리하는 중에 예상치 못한 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.'}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <Button
          onClick={() => reset()}
          variant="default"
          className="gap-2 px-6"
        >
          <RotateCcw className="h-4 w-4" />
          다시 시도
        </Button>
        <Link
          href="/"
          className={cn(buttonVariants({ variant: 'outline' }), 'gap-2 px-6')}
        >
          <Home className="h-4 w-4" />
          홈으로 이동
        </Link>
      </div>

      {error.digest && (
        <p className="mt-8 text-xs text-muted-foreground">
          Error ID: <span className="font-mono">{error.digest}</span>
        </p>
      )}
    </div>
  )
}
