import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { FileQuestion, List, Home } from 'lucide-react'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button-variants'

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-160px)] flex-col items-center justify-center p-6 text-center">
      <div className="mb-6 animate-bounce">
        <FileQuestion className="h-20 w-20 text-muted-foreground/40" />
      </div>
      
      <h1 className="mb-2 text-4xl font-extrabold tracking-tight">404</h1>
      <h2 className="mb-4 text-2xl font-semibold">페이지를 찾을 수 없습니다</h2>
      <p className="mb-10 max-w-md text-muted-foreground">
        요청하신 페이지가 존재하지 않거나, 주소가 삭제되었을 수 있습니다.
        입력하신 주소가 올바른지 다시 한번 확인해 주세요.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/posts"
          className={cn(buttonVariants({ variant: 'default' }), 'gap-2 px-8')}
        >
          <List className="h-4 w-4" />
          게시글 목록으로
        </Link>
        <Link
          href="/"
          className={cn(buttonVariants({ variant: 'outline' }), 'gap-2 px-8')}
        >
          <Home className="h-4 w-4" />
          홈으로 이동
        </Link>
      </div>
    </div>
  )
}
