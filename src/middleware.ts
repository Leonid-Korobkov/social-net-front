import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {

  const token = request.cookies.get('token')?.value
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth')

  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL('/auth', request.url))
  }

  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  // Нужно выбрать все страницы которые находятся в protected папке
  matcher: [
    // Защищенные страницы
    '/search',
    '/users/:path*',
    '/posts/:path*',
    '/',
    '/auth',
  ],
}
