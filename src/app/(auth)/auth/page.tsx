import { Metadata } from 'next'

import { APP_URL } from '@/app/constants'
import AuthClient from './page-client'

export const metadata: Metadata = {
  title: 'Авторизация | Zling',
  description:
    'Войдите в аккаунт или зарегистрируйтесь в социальной сети Zling',
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
    title: 'Авторизация | Zling',
    description:
      'Войдите в аккаунт или зарегистрируйтесь в социальной сети Zling',
    url: `${APP_URL}/auth`,
    siteName: 'Zling',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Авторизация | Zling',
    description:
      'Войдите в аккаунт или зарегистрируйтесь в социальной сети Zling',
    creator: '@krbln',
  },
}

function Auth() {
  return <AuthClient />
}

export default Auth
