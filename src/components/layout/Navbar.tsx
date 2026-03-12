'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Button, buttonVariants } from '@/components/ui/button'
import { LogOut, PenSquare, List, LogIn, UserPlus } from 'lucide-react'
import { cn } from '@/lib/utils'

export const Navbar = () => {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <span className="bg-primary text-primary-foreground px-2 py-0.5 rounded shadow-sm">My</span>
          <span>App</span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-6">
          <Link
            href="/posts"
            className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            <List className="h-4 w-4" />
            게시글 목록
          </Link>

          <div className="flex items-center gap-2 border-l pl-6">
            {user ? (
              <>
                <div className="mr-2 flex items-center gap-2 text-sm">
                  <span className="font-semibold text-primary">{user.name}</span>
                  <span className="text-muted-foreground">님</span>
                </div>
                <Link
                  href="/posts/new"
                  className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'gap-1.5')}
                >
                  <PenSquare className="h-4 w-4" />
                  게시글 작성
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center gap-1.5"
                >
                  <LogOut className="h-4 w-4" />
                  로그아웃
                </Button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'gap-1.5')}
                >
                  <LogIn className="h-4 w-4" />
                  로그인
                </Link>
                <Link
                  href="/signup"
                  className={cn(buttonVariants({ size: 'sm' }), 'gap-1.5')}
                >
                  <UserPlus className="h-4 w-4" />
                  회원가입
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
