'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { ChevronLeft, Save, Hash, AlertCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button-variants'
import { Post, UpdatePostRequest } from '@/types/post'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { get, patch } from '@/lib/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/queryKeys'

export default function EditPostPage() {
  const { user } = useAuth()
  const router = useRouter()
  const params = useParams()
  const postNo = params.no as string
  const queryClient = useQueryClient()
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<UpdatePostRequest>({
    title: '',
    content: '',
    tags: '',
  })
  const [postAuthorNo, setPostAuthorNo] = useState<number | null>(null)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await get<Post>(`/api/posts/${postNo}`, {
          cache: 'no-store'
        })
        setFormData({
          title: data.title,
          content: data.content,
          tags: data.tags || '',
        })
        setPostAuthorNo(data.authorNo)
      } catch (err: any) {
        console.error('Fetch post error:', err)
        if (err.status === 404) {
          toast.error('존재하지 않는 게시글입니다.')
          router.push('/posts')
        } else {
          setError(err.message || '게시글 정보를 불러오는 데 실패했습니다.')
        }
      } finally {
        setLoading(false)
      }
    }

    const token = localStorage.getItem('accessToken')
    if (!token) {
      toast.error('로그인이 필요한 서비스입니다.')
      router.push('/login?redirect=/posts/' + postNo + '/edit')
      return
    }

    fetchPost()
  }, [postNo, router])

  const mutation = useMutation({
    mutationFn: (data: UpdatePostRequest) => patch(`/api/posts/${postNo}`, data),
    onSuccess: () => {
      toast.success('게시글이 수정되었습니다!')
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.detail(postNo) })
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.list() })
      router.push(`/posts/${postNo}`)
      router.refresh()
    },
    onError: (error: any) => {
      console.error('Post update error:', error)
      if (error.status === 401) {
        toast.error('세션이 만료되었습니다. 다시 로그인해 주세요.')
        router.push('/login')
      } else if (error.status === 403) {
        toast.error('수정 권한이 없습니다.')
      } else {
        toast.error(error.message || '게시글 수정에 실패했습니다.')
      }
    }
  })

  // 권한 체크: 로딩 완료 후 본인 및 로그인 사용자 확인
  const isAuthor = user && postAuthorNo && user.no === postAuthorNo

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

  if (loading) {
    return (
      <div className="container mx-auto py-20 px-4 flex flex-col items-center justify-center gap-4">
        <Loader2 className="size-10 text-primary animate-spin" />
        <p className="text-muted-foreground animate-pulse">게시글 정보를 불러오는 중입니다...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-20 px-4 max-w-md text-center">
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="size-4" />
          <AlertTitle>오류 발생</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={() => window.location.reload()} variant="outline">다시 시도</Button>
      </div>
    )
  }

  // 로딩이 끝났는데 사용자 정보와 작성자 정보가 일치하지 않는 경우 (엄격한 체크)
  if (user && postAuthorNo && !isAuthor) {
    return (
      <div className="container mx-auto py-20 px-4 max-w-md">
        <Alert variant="destructive" className="mb-6 border-2">
          <AlertCircle className="size-4" />
          <AlertTitle>권한 없음</AlertTitle>
          <AlertDescription>본인이 작성한 게시글만 수정할 수 있습니다.</AlertDescription>
        </Alert>
        <Button onClick={() => router.push(`/posts/${postNo}`)} className="w-full">상세 페이지로 돌아가기</Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10 px-4 max-w-3xl">
      <div className="mb-6">
        <Link
          href={`/posts/${postNo}`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-4"
        >
          <ChevronLeft className="size-4" />
          상세 페이지로 돌아가기
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">게시글 수정</h1>
        <p className="text-muted-foreground mt-1">기존 내용을 수정하고 보완해 보세요.</p>
      </div>

      <Card className="border-2 border-primary/20 shadow-xl overflow-hidden active:border-primary/40 transition-colors">
        <form onSubmit={handleSubmit}>
          <div className="h-1 bg-primary/40" />
          <CardHeader className="bg-muted/10">
            <CardTitle className="text-xl flex items-center gap-2">
              <Save className="size-5 text-primary" />
              게시글 수정하기
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-semibold">제목</Label>
              <Input
                id="title"
                name="title"
                placeholder="수정할 제목을 입력해 주세요"
                value={formData.title}
                onChange={handleChange}
                className="h-12 text-lg border-muted-foreground/20 focus-visible:ring-primary/20 transition-all font-semibold"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="content" className="text-sm font-semibold">내용</Label>
              <Textarea
                id="content"
                name="content"
                placeholder="수정할 내용을 입력해 주세요"
                value={formData.content}
                onChange={handleChange}
                className="min-h-[350px] resize-none border-muted-foreground/20 focus-visible:ring-primary/20 transition-all leading-relaxed"
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
                placeholder="태그를 쉼표로 구분하여 입력해 주세요"
                value={formData.tags}
                onChange={handleChange}
                className="border-muted-foreground/20 focus-visible:ring-primary/20 transition-all"
              />
              <p className="text-xs text-muted-foreground ml-1">쉼표(,)를 사용하여 태그를 구분해 주세요.</p>
            </div>
          </CardContent>
          <CardFooter className="flex items-center justify-end gap-3 bg-muted/20 border-t p-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={mutation.isPending}
              className="px-6 border-muted-foreground/30 hover:bg-muted/50"
            >
              취소
            </Button>
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="px-10 gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all bg-primary hover:bg-primary/90"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  수정 중...
                </>
              ) : (
                <>
                  <Save className="size-4" />
                  저장하기
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
