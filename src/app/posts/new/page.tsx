'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { ChevronLeft, Send, Hash } from 'lucide-react'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button-variants'
import { CreatePostRequest } from '@/types/post'
import { post } from '@/lib/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/queryKeys'

export default function NewPostPage() {
  const { user, login } = useAuth()
  const router = useRouter()
  const queryClient = useQueryClient()
  
  const [formData, setFormData] = useState<CreatePostRequest>({
    title: '',
    content: '',
    tags: '',
  })

  useEffect(() => {
    // 세션 복구 대기 및 권한 체크
    const token = localStorage.getItem('accessToken')
    if (!token) {
      toast.error('로그인이 필요한 서비스입니다.')
      router.push('/login?redirect=/posts/new')
    }
  }, [router])

  const mutation = useMutation({
    mutationFn: (data: CreatePostRequest) => post('/api/posts', data),
    onSuccess: () => {
      toast.success('게시글이 등록되었습니다!')
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.all() })
      router.push('/posts')
      router.refresh() // 목록 캐시 갱신
    },
    onError: (error: any) => {
      console.error('Post creation error:', error)
      if (error.status === 401) {
        toast.error('세션이 만료되었습니다. 다시 로그인해 주세요.')
        router.push('/login')
      } else {
        toast.error(error.message || '게시글 등록에 실패했습니다.')
      }
    }
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim()) {
      toast.error('제목을 입력해 주세요.')
      return
    }
    
    if (!formData.content.trim()) {
      toast.error('내용을 입력해 주세요.')
      return
    }

    mutation.mutate(formData)
  }

  return (
    <div className="container mx-auto py-10 px-4 max-w-3xl">
      <div className="mb-6">
        <Link
          href="/posts"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-4"
        >
          <ChevronLeft className="size-4" />
          목록으로 돌아가기
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">새 게시글 작성</h1>
        <p className="text-muted-foreground mt-1">당신의 이야기나 정보를 공유해 보세요.</p>
      </div>

      <Card className="border-2 border-muted/50 shadow-lg">
        <form onSubmit={handleSubmit}>
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl">게시글 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-semibold">제목</Label>
              <Input
                id="title"
                name="title"
                placeholder="게시글의 제목을 입력해 주세요"
                value={formData.title}
                onChange={handleChange}
                className="h-12 text-lg focus-visible:ring-primary/20 transition-all"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="content" className="text-sm font-semibold">내용</Label>
              <Textarea
                id="content"
                name="content"
                placeholder="내용을 상세하게 작성해 주세요"
                value={formData.content}
                onChange={handleChange}
                className="min-h-[300px] resize-none focus-visible:ring-primary/20 transition-all leading-relaxed"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags" className="text-sm font-semibold flex items-center gap-2">
                <Hash className="size-4" />
                태그 (선택)
              </Label>
              <Input
                id="tags"
                name="tags"
                placeholder="태그를 쉼표로 구분하여 입력해 주세요 (예: Next.js, React, Tailwind)"
                value={formData.tags}
                onChange={handleChange}
                className="focus-visible:ring-primary/20 transition-all"
              />
              <p className="text-xs text-muted-foreground ml-1">쉼표(,)를 사용하여 여러 개의 태그를 구분할 수 있습니다.</p>
            </div>
          </CardContent>
          <CardFooter className="flex items-center justify-end gap-3 bg-muted/5 border-t p-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={mutation.isPending}
              className="px-6"
            >
              취소
            </Button>
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="px-8 gap-2 shadow-md hover:shadow-lg transition-all"
            >
              {mutation.isPending ? (
                <>
                  <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  등록 중...
                </>
              ) : (
                <>
                  <Send className="size-4" />
                  게시글 등록
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
