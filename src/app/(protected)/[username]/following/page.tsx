import FollowingClient from './page-client'
import { Metadata } from 'next'
import { APP_URL } from '@/app/constants'
import { apiClient } from '@/services/ApiConfig'
import { User as UserNext } from '@/store/types'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const paramsResolved = await params
  try {
    const response = await apiClient<string, UserNext>(`users/${paramsResolved.id}`, {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN_FOR_REQ}`,
      },
    })
    const user = response

    if (!user) {
      return defaultMetadata()
    }

    const title = `Подписки ${user.name} (@${user.userName}) | Zling`
    const description = `Список пользователей, на которых подписан ${user.name} в социальной сети Zling`

    return {
      title,
      description,
      openGraph: {
        type: 'profile',
        title,
        description,
        url: `${APP_URL}/${user.userName}/following`,
        siteName: 'Zling',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        creator: '@krbln',
      },
      alternates: {
        canonical: `${APP_URL}/${paramsResolved.id}/following`,
      },
    }
  } catch (error) {
    return defaultMetadata()
  }
}

function defaultMetadata(): Metadata {
  return {
    title: 'Подписки пользователя | Zling',
    description: 'Список подписок пользователя в социальной сети Zling',
    openGraph: {
      type: 'profile',
      title: 'Подписки пользователя | Zling',
      description: 'Список подписок пользователя в социальной сети Zling',
      url: APP_URL,
      siteName: 'Zling',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Подписки пользователя | Zling',
      description: 'Список подписок пользователя в социальной сети Zling',
      creator: '@krbln',
    },
  }
}

type PageProps = {
  params: Promise<{ id: string }>
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}

function Following({ params }: PageProps) {
  return <FollowingClient params={Promise.resolve(params)} />
}

export default Following
