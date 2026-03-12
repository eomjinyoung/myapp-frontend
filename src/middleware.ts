import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const authStatus = request.cookies.get('authStatus')?.value
  const { pathname } = request.nextUrl

  // 보호가 필요한 경로 정의
  const protectedPaths = [
    /^\/posts\/new$/,
    /^\/posts\/\d+\/edit$/,
  ]

  const isProtected = protectedPaths.some((pattern) => pattern.test(pathname))

  if (isProtected && authStatus !== 'true') {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

// Middleware가 적용될 경로 설정
export const config = {
  matcher: [
    '/posts/new',
    '/posts/:no/edit',
  ],
}
