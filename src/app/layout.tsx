import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from 'next-themes'
import PreLoader from '@/providers/PreLoader'
import { StoreProvider } from '@/providers/StoreProvider'

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
    <html lang="ru" suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-title" content="krbln" />
      </head>
      <body className={`antialiased`}>
        <ThemeProvider>
          <StoreProvider>
            <PreLoader />
            {children}
          </StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
