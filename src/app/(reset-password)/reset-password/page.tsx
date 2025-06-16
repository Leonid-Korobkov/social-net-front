import { Metadata } from 'next'
import { APP_URL } from '@/app/constants'
import ResetPasswordPageClient from './page-client'

export const metadata: Metadata = {
  title: 'Сброс пароля | Zling',
  description: 'Сброс пароля для вашей учетной записи Zling в несколько шагов',
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
    title: 'Сброс пароля | Zling',
    description:
      'Сброс пароля для вашей учетной записи Zling в несколько шагов',
    url: `${APP_URL}/reset-password/reset-password`,
    siteName: 'Zling',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Сброс пароля | Zling',
    description:
      'Сброс пароля для вашей учетной записи Zling в несколько шагов',
    creator: '@krbln',
  },
}

function ResetPasswordPage() {
  return <ResetPasswordPageClient />
}

export default ResetPasswordPage
