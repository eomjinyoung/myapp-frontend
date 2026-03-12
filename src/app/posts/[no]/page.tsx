import React from 'react'
import { Post } from '@/types/post'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CalendarDays, User, Eye, Tag, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button-variants'
import { cn } from '@/lib/utils'
import { PostActions } from '@/components/post/PostActions'

async function getPost(no: number): Promise<Post> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
  const res = await fetch(`${baseUrl}/api/posts/${no}`, {
    cache: 'no-store',
  })

  if (res.status === 404) {
    notFound()
  }

  if (!res.ok) {
    throw new Error('게시글을 불러오는 데 실패했습니다.')
  }

  return res.json()
}

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ no: string }>
}) {
  const resolvedParams = await params
  const postNo = Number(resolvedParams.no)
  const post = await getPost(postNo)

  const tags = post.tags ? post.tags.split(',').map(t => t.trim()) : []

  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <div className="flex flex-col gap-6">
        <Link
          href="/posts"
          className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'w-fit gap-2 -ml-2 text-muted-foreground')}
        >
          <ArrowLeft className="h-4 w-4" />
          목록으로 돌아가기
        </Link>

        <article>
          <Card className="border-none shadow-none bg-transparent">
            <CardHeader className="px-0 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="font-normal border-primary/20 text-primary bg-primary/5">
                    No. {post.no}
                  </Badge>
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl leading-tight">
                  {post.title}
                </h1>
              </div>

              <div className="flex flex-wrap items-center gap-y-4 gap-6 py-4 border-y text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground leading-none mb-1">작성자</p>
                    <p className="font-semibold text-foreground leading-none">{post.authorName}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="bg-muted p-2 rounded-full">
                    <CalendarDays className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground leading-none mb-1">작성일</p>
                    <p className="font-medium text-foreground leading-none">
                      {new Date(post.createdAt).toLocaleDateString('ko-KR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-auto">
                  <div className="bg-muted p-2 rounded-full">
                    <Eye className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground leading-none mb-1">조회수</p>
                    <p className="font-medium text-foreground leading-none">{post.views}</p>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="px-0 py-10">
              <div className="prose prose-slate max-w-none dark:prose-invert min-h-[300px] leading-relaxed whitespace-pre-wrap text-lg">
                {post.content}
              </div>

              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-12 pb-8">
                  {tags.map((tag, index) => (
                    <div key={index} className="flex items-center gap-1 bg-muted px-3 py-1 rounded-full text-xs font-medium text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors cursor-default">
                      <Tag className="h-3 w-3" />
                      {tag}
                    </div>
                  ))}
                </div>
              )}

              {/* 본인 확인 후 수정/삭제 버튼 표시 */}
              <PostActions postNo={post.no} authorNo={post.authorNo} />
            </CardContent>
          </Card>
        </article>
      </div>
    </div>
  )
}
