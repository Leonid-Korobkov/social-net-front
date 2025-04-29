import type { Metadata } from 'next'
import './globals.css'
import PreLoader from '@/Providers/PreLoader'
import { ThemeProvider } from '@/Providers/ThemeProvider'
import ScrollRestoration from '@/Providers/ScrollRestoration'
import { StoreProvider } from '@/Providers/StoreProvider'
import { Suspense } from 'react'
import ProgressProvider from '@/Providers/ProgressProvider'

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
                <ProgressProvider>{children}</ProgressProvider>
              </ScrollRestoration>
            </Suspense>
          </StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
