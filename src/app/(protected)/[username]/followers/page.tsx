import { APP_URL } from '@/app/constants'
import { Metadata } from 'next'
import FollowersClient from './page-client'
import { fetchOpenGraphUserData } from '@/app/utils/opengraph-api'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>
}): Promise<Metadata> {
  const paramsResolved = await params
  try {
    const user = await fetchOpenGraphUserData(paramsResolved.username)

    if (!user) {
      return defaultMetadata()
    }

    const title = `Подписчики ${user.name} (@${user.userName}) | Zling`
    const description = `Список пользователей, которые подписаны на ${user.name} в социальной сети Zling`

    return {
      title,
      description,
      openGraph: {
        type: 'profile',
        title,
        description,
        url: `${APP_URL}/${user.userName}/followers`,
        siteName: 'Zling',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        creator: '@krbln',
      },
      alternates: {
        canonical: `${APP_URL}/${paramsResolved.username}/followers`,
      },
    }
  } catch (error) {
    console.log(error)
    return defaultMetadata()
  }
}

function defaultMetadata(): Metadata {
  return {
    title: 'Подписчики пользователя | Zling',
    description: 'Список подписчиков пользователя в социальной сети Zling',
    openGraph: {
      type: 'profile',
      title: 'Подписчики пользователя | Zling',
      description: 'Список подписчиков пользователя в социальной сети Zling',
      url: APP_URL,
      siteName: 'Zling',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Подписчики пользователя | Zling',
      description: 'Список подписчиков пользователя в социальной сети Zling',
      creator: '@krbln',
    },
  }
}

type PageProps = {
  params: Promise<{ username: string }>
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}

function Followers({ params }: PageProps) {
  return <FollowersClient params={Promise.resolve(params)} />
}

export default Followers
