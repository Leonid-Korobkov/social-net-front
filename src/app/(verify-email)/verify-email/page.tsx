import { Metadata } from 'next'

import { APP_URL } from '@/app/constants'
import VerifyEmailPageClient from './page-client'

export const metadata: Metadata = {
  title: 'Подтверждение email | Zling',
  description:
    'Подтвердите свой email адрес для завершения регистрации в социальной сети Zling',
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    type: 'website',
    title: 'Подтверждение email | Zling',
    description:
      'Подтвердите свой email адрес для завершения регистрации в социальной сети Zling',
    url: `${APP_URL}/verify-email`,
    siteName: 'Zling',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Подтверждение email | Zling',
    description:
      'Подтвердите свой email адрес для завершения регистрации в социальной сети Zling',
    creator: '@krbln',
  },
}

function VerifyEmailPage() {
  return <VerifyEmailPageClient />
}

export default VerifyEmailPage
