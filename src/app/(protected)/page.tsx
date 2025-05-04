import PostsClient from './page-client'
import { Metadata } from 'next'

import { APP_URL } from '@/app/constants'

export const metadata: Metadata = {
  title: 'Лента | Zling',
  description:
    'Следите за публикациями ваших друзей и популярных пользователей',
  openGraph: {
    title: 'Лента | Zling',
    description:
      'Следите за публикациями ваших друзей и популярных пользователей',
    url: `${APP_URL}`,
    siteName: 'Zling',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Лента | Zling',
    description:
      'Следите за публикациями ваших друзей и популярных пользователей',

    creator: '@krbln',
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
}

function Posts() {
  return <PostsClient />
}

export default Posts
