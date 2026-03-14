'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { get, getAccessToken } from '@/lib/api'
import { User as UserType } from '@/types/auth'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { User, Mail, ShieldCheck, AlertCircle } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/queryKeys'


  export default function MyPage() {
    const router = useRouter()

  // 토큰 미존재 시 리다이렉트 처리 유지
  useEffect(() => {
    const token = getAccessToken()
    if (!token) {
      router.replace('/login?redirect=/my')
    }
  }, [router])

  const { data: user, isLoading, error } = useQuery<UserType, any>({
    queryKey: queryKeys.auth.me(),
    queryFn: async () => {
      const userData = await get<UserType>('/api/user/me')
      return userData
    },
    // 토큰이 있을 때만 패칭
    enabled: typeof window !== 'undefined' ? !!getAccessToken() : false
  })

  // 에러 발생 시 로그인 세션 만료 등의 처리
  useEffect(() => {
    if (error && error.status === 401) {
      router.replace('/login')
    }
  }, [error, router])

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-160px)] items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground animate-pulse font-medium">정보를 안전하게 불러오는 중...</p>
        </div>
      </div>
    )
  }

  if (error) {
    const errorMessage = error.message || '사용자 정보를 불러오는 데 실패했습니다.'
    return (
      <div className="container mx-auto py-12 px-4 max-w-2xl">
        <Card className="border-destructive/50 shadow-lg">
          <CardContent className="pt-10 pb-10 text-center space-y-4">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-destructive">오류가 발생했습니다</h3>
              <p className="text-muted-foreground">{errorMessage}</p>
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              다시 시도
            </button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="container mx-auto py-12 px-4 max-w-2xl animate-in fade-in duration-500">
      <Card className="shadow-lg border-t-4 border-t-primary overflow-hidden transition-all duration-300 hover:shadow-xl">
        <CardHeader className="bg-muted/30 pb-8">
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <User className="h-8 w-8 text-primary" />
            </div>
            <div>
              <CardTitle className="text-3xl font-bold tracking-tight">마이 페이지</CardTitle>
              <CardDescription className="text-base text-muted-foreground">내 계정 정보 및 활동을 관리합니다.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-8 pt-8 px-8">
          <div className="grid gap-6">
            <div className="flex flex-col space-y-1.5 p-5 rounded-xl bg-background border shadow-sm transition-all hover:bg-muted/20 hover:border-primary/30">
              <div className="flex items-center gap-2 text-primary mb-1">
                <ShieldCheck className="h-4 w-4" />
                <Label className="text-xs font-bold uppercase tracking-widest opacity-70">이름</Label>
              </div>
              <p className="text-xl font-semibold pl-6">{user.name}</p>
            </div>

            <div className="flex flex-col space-y-1.5 p-5 rounded-xl bg-background border shadow-sm transition-all hover:bg-muted/20 hover:border-primary/30">
              <div className="flex items-center gap-2 text-primary mb-1">
                <Mail className="h-4 w-4" />
                <Label className="text-xs font-bold uppercase tracking-widest opacity-70">이메일</Label>
              </div>
              <p className="text-xl font-semibold pl-6">{user.email}</p>
            </div>
          </div>

          <div className="pt-6 border-t border-dashed">
            <div className="bg-primary/5 rounded-lg p-4 text-center">
              <p className="text-sm text-muted-foreground italic leading-relaxed">
                "오늘도 멋진 하루 되세요, <span className="font-bold text-foreground">{user.name}</span>님! <br/>
                My App과 함께해주셔서 감사합니다."
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
