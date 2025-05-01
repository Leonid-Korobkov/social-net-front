import MotionConfigProvider from '@/Providers/MotionConfigProvider'
import PreLoader from '@/Providers/PreLoader'
import ProgressProvider from '@/Providers/ProgressProvider'
import ScrollRestoration from '@/Providers/ScrollRestoration'
import { StoreProvider } from '@/Providers/StoreProvider'
import { ThemeProvider } from '@/Providers/ThemeProvider'
import type { Metadata } from 'next'
import { Suspense } from 'react'
import './globals.css'
import ModalsProvider from '@/Providers/ModalsProvider'

export const metadata: Metadata = {
  title: 'Zling',
  description: 'Zling - социальная сеть для людей, которые любят общаться',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru" suppressHydrationWarning className="overflow-hidden">
      <head>
        <meta name="apple-mobile-web-app-title" content="krbln" />
      </head>
      <body className={`antialiased`}>
        <ThemeProvider>
          <StoreProvider>
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
          </StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
