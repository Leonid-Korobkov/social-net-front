import type { Metadata } from 'next'
import './globals.css'
import PreLoader from '@/providers/PreLoader'
import { StoreProvider } from '@/providers/StoreProvider'
import { ThemeProvider } from '@/providers/ThemeProvider'

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
    <html lang="ru" suppressHydrationWarning className='overflow-hidden'>
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
