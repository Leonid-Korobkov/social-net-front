import { Metadata } from 'next'
import { APP_URL } from '@/app/constants'
import SearchClient from './page-client'

export const metadata: Metadata = {
  title: 'Поиск | Zling',
  description: 'Найдите пользователей и посты в социальной сети Zling',
  openGraph: {
    type: 'website',
    title: 'Поиск | Zling',
    description: 'Найдите пользователей и посты в социальной сети Zling',
    url: `${APP_URL}/search`,
    siteName: 'Zling',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Поиск | Zling',
    description: 'Найдите пользователей и посты в социальной сети Zling',
    creator: '@krbln',
  },
  alternates: {
    canonical: `${APP_URL}/search`,
  },
}

export default function Search({
  searchParams,
}: {
  searchParams: { q?: string; tab?: string }
}) {
  return <SearchClient />
}
