import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth')

  // Исключаем маршруты OG-изображений из проверки авторизации
  const isOgRoute = request.nextUrl.pathname.startsWith('/api/og')

  // Исключаем маршрут robots.txt из проверки авторизации
  const isRobotsRoute = request.nextUrl.pathname === '/robots.txt'

  // Также исключаем маршруты для favicon и других системных файлов
  const isSystemFileRoute =
    request.nextUrl.pathname === '/favicon.ico' ||
    request.nextUrl.pathname === '/sitemap.xml' ||
    request.nextUrl.pathname.startsWith('/opengraph-image')

  // Если это маршрут OG или системный файл, пропускаем его без проверки авторизации
  if (isOgRoute || isRobotsRoute || isSystemFileRoute) {
    return NextResponse.next()
  }

  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL('/auth', request.url))
  }

  if (token && isAuthPage) {
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Защищенные страницы
    '/search',
    '/users/:path*',
    '/posts/:path*',
    '/',
    '/auth',
    // Дополняем список маршрутов, чтобы включить API-маршруты OG-изображений
    '/api/og',
    '/robots.txt',
    '/favicon.ico',
    '/sitemap.xml',
    '/opengraph-image',
  ],
}
