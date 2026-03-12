import React from 'react'
import Link from 'next/link'
import { PostListResponse } from '@/types/post'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CalendarDays, User, Eye, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

async function getPosts(page: number): Promise<PostListResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
  const res = await fetch(`${baseUrl}/api/posts?page=${page}`, {
    cache: 'no-store', // SSR: 최신 데이터를 위해 캐시 사용 안 함
  })

  if (!res.ok) {
    throw new Error('게시글 목록을 불러오는 데 실패했습니다.')
  }

  return res.json()
}

export default async function PostsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const resolvedSearchParams = await searchParams
  const currentPage = Number(resolvedSearchParams.page) || 1
  const data = await getPosts(currentPage)

  return (
    <div className="container mx-auto py-10 px-4 max-w-5xl">
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">게시글 목록</h1>
            <p className="text-muted-foreground mt-1">다양한 이야기와 정보를 확인해 보세요.</p>
          </div>
        </div>

        {/* 게시글 목록 Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
          {data.posts.map((post) => (
            <Link key={post.no} href={`/posts/${post.no}`}>
              <Card className="group border shadow-sm transition-all hover:shadow-md hover:border-primary/20 overflow-hidden">
                <div className="flex flex-col lg:flex-row">
                  <CardHeader className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="font-normal">
                        No. {post.no}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors leading-snug">
                      {post.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="lg:w-72 flex flex-col justify-center lg:border-l bg-muted/5 p-6 space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="h-4 w-4" />
                      <span className="font-medium text-foreground">{post.authorName}</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {new Date(post.createdAt).toLocaleDateString('ko-KR')}
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-3.5 w-3.5" />
                        조회 {post.views}
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Card>
            </Link>
          ))}

          {data.posts.length === 0 && (
            <div className="py-20 text-center border rounded-xl border-dashed">
              <p className="text-muted-foreground">등록된 게시글이 없습니다.</p>
            </div>
          )}
        </div>

        {/* 페이지네이션 */}
        {data.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <Link
              href={`/posts?page=${Math.max(1, data.currentPage - 1)}`}
              className={cn(
                buttonVariants({ variant: 'outline', size: 'icon' }),
                data.currentPage === 1 && 'pointer-events-none opacity-50'
              )}
            >
              <ChevronLeft className="h-4 w-4" />
            </Link>
            
            <div className="flex items-center gap-1 mx-2">
              {Array.from({ length: data.totalPages }, (_, i) => i + 1).map((page) => (
                <Link
                  key={page}
                  href={`/posts?page=${page}`}
                  className={cn(
                    buttonVariants({ 
                      variant: page === data.currentPage ? 'default' : 'ghost',
                      size: 'sm'
                    }),
                    'w-9 h-9'
                  )}
                >
                  {page}
                </Link>
              ))}
            </div>

            <Link
              href={`/posts?page=${Math.min(data.totalPages, data.currentPage + 1)}`}
              className={cn(
                buttonVariants({ variant: 'outline', size: 'icon' }),
                data.currentPage === data.totalPages && 'pointer-events-none opacity-50'
              )}
            >
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
