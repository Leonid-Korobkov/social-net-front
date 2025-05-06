import MotionConfigProvider from '@/Providers/MotionConfigProvider'
import PreLoader from '@/Providers/PreLoader'
import ProgressProvider from '@/Providers/ProgressProvider'
import ScrollRestoration from '@/Providers/ScrollRestoration'
import { StoreProvider } from '@/Providers/StoreProvider'
import { ThemeProvider } from '@/Providers/ThemeProvider'
import type { Metadata, Viewport } from 'next'
import { Suspense } from 'react'
import './globals.css'
import ModalsProvider from '@/Providers/ModalsProvider'
import ProtectedRoute from '@/components/layout/ProtectedRoute'

export const metadata: Metadata = {
  metadataBase: new URL('https://zling.vercel.app'),
  title: 'Zling - социальная сеть',
  description: 'Zling - социальная сеть для людей, которые любят общаться',
  applicationName: 'Zling',
  authors: [{ name: 'krbln' }],
  generator: 'Next.js',
  keywords: ['социальная сеть', 'общение', 'zling', 'threads', 'постинг'],
  referrer: 'origin-when-cross-origin',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    type: 'website',
    siteName: 'Zling',
    title: 'Zling - социальная сеть',
    description: 'Zling - социальная сеть для людей, которые любят общаться',
    url: 'https://zling.vercel.app',
    locale: 'ru_RU',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zling - социальная сеть',
    description: 'Zling - социальная сеть для людей, которые любят общаться',
    creator: '@krbln',
  },
  category: 'social',
}

export const viewport: Viewport = {
  width: 'device-width',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f5f5f5' },
    { media: '(prefers-color-scheme: dark)', color: '#121212' },
  ],
  initialScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-title" content="Zling" />
      </head>
      <body className={`antialiased`}>
        <ThemeProvider>
          <StoreProvider>
            <ProtectedRoute>
              <PreLoader />
              <Suspense>
                <ScrollRestoration>
                  <MotionConfigProvider>
                    <ProgressProvider>
                      {children}
                      <ModalsProvider />
                    </ProgressProvider>
                  </MotionConfigProvider>
                </ScrollRestoration>
              </Suspense>
            </ProtectedRoute>
          </StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
