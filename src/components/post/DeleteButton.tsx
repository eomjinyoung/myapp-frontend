'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button-variants'
import { Trash2 } from 'lucide-react'
import { apiFetch } from '@/lib/api'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/queryKeys'

export function DeleteButton({ postNo }: { postNo: number }) {
  const router = useRouter()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: () => apiFetch(`/api/posts/${postNo}`, { method: 'DELETE' }),
    onSuccess: () => {
      toast.success('게시글이 삭제되었습니다.')
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.list() })
      router.push('/posts')
      router.refresh()
    },
    onError: (err: any) => {
      if (err.status === 401) {
        toast.error('로그인이 필요합니다.')
        router.push('/login')
      } else if (err.status === 403) {
        toast.error('삭제 권한이 없습니다.')
      } else if (err.status === 404) {
        toast.error('이미 삭제된 게시글입니다.')
        router.push('/posts')
      } else {
        toast.error(err.message || '게시글 삭제에 실패했습니다.')
      }
    }
  })

  const handleDelete = () => {
    mutation.mutate()
  }

  const isPending = mutation.isPending

  return (
    <AlertDialog>
      <AlertDialogTrigger className={cn(buttonVariants({ variant: 'destructive', size: 'sm' }), 'gap-2')} disabled={isPending}>
        <Trash2 className="h-4 w-4" />
        삭제
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>게시글 삭제</AlertDialogTitle>
          <AlertDialogDescription>
            정말로 이 게시글을 삭제하시겠습니까? 삭제된 게시글은 복구할 수 없습니다.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>취소</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            disabled={isPending}
          >
            {isPending ? '삭제 중...' : '확인'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
