import React from 'react'
import Link from 'next/link'
import { PostListResponse } from '@/types/post'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Eye, ChevronLeft, ChevronRight, User, CalendarDays } from 'lucide-react'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button-variants'

async function getPosts(page: number): Promise<PostListResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'
  const fetchUrl = `${baseUrl}/api/posts?page=${page}`
  console.log(`[SSR] Fetching posts from: ${fetchUrl}`)

  try {
    const res = await fetch(fetchUrl, {
      cache: 'no-store',
    })

    if (!res.ok) {
      console.error(`[SSR] Fetch failed! Status: ${res.status}, URL: ${fetchUrl}`)
      throw new Error(`게시글 목록을 불러오는 데 실패했습니다. (Status: ${res.status})`)
    }

    return res.json()
  } catch (error: any) {
    console.error(`[SSR] Fetch error:`, error)
    throw error
  }
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
            <p className="text-muted-foreground mt-1 text-sm">총 {data.posts.length}개의 게시글이 있습니다.</p>
          </div>
        </div>

        {/* 게시글 목록 Table */}
        <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[80px] text-center">No.</TableHead>
                <TableHead>제목</TableHead>
                <TableHead className="w-[120px]">작성자</TableHead>
                <TableHead className="w-[120px] text-center">작성일</TableHead>
                <TableHead className="w-[100px] text-center">조회수</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.posts.map((post) => (
                <TableRow key={post.no} className="cursor-pointer hover:bg-muted/30 transition-colors group">
                  <TableCell className="text-center font-medium">
                    <Badge variant="outline" className="font-normal text-xs">
                      {post.no}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Link href={`/posts/${post.no}`} className="block font-semibold group-hover:text-primary transition-colors py-1">
                      {post.title}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="size-6 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="size-3 text-primary" />
                      </div>
                      <span className="truncate max-w-[80px]">{post.authorName}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-col items-center gap-0.5 text-xs text-muted-foreground">
                      <span>{new Date(post.createdAt).toLocaleDateString('ko-KR')}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <Eye className="size-3" />
                      {post.views}
                    </div>
                  </TableCell>
                </TableRow>
              ))}

              {data.posts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="h-48 text-center text-muted-foreground">
                    등록된 게시글이 없습니다.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* 페이지네이션 */}
        {data.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-4">
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
              {Array.from({ length: Math.min(5, data.totalPages) }, (_, i) => {
                // 단순화된 페이지네이션 로직 (필요 시 보완 가능)
                const pageNum = i + 1;
                return (
                  <Link
                    key={pageNum}
                    href={`/posts?page=${pageNum}`}
                    className={cn(
                      buttonVariants({ 
                        variant: pageNum === data.currentPage ? 'default' : 'ghost',
                        size: 'sm'
                      }),
                      'w-9 h-9'
                    )}
                  >
                    {pageNum}
                  </Link>
                );
              })}
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
