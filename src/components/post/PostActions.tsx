'use client'

import React from 'react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { buttonVariants } from '@/components/ui/button-variants'
import { Edit3 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { DeleteButton } from './DeleteButton'

interface PostActionsProps {
  postNo: number
  authorNo: number
}

export function PostActions({ postNo, authorNo }: PostActionsProps) {
  const { user } = useAuth()

  // 로그인하지 않았거나 본인 게시글이 아니면 버튼 미표시
  if (!user || user.no !== authorNo) {
    return null
  }

  return (
    <div className="flex items-center gap-3 border-t pt-8">
      <DeleteButton postNo={postNo} />
    </div>
  )
}
