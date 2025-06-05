import UserProfileClient from './page-client'
import { Metadata } from 'next'
import { APP_URL } from '@/app/constants'
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

    const title = `${user.name} (@${user.userName}) | Zling`
    const description =
      user.bio || `Профиль ${user.name} в социальной сети Zling`

    return {
      title,
      description,
      openGraph: {
        type: 'profile',
        title,
        description,
        url: `${APP_URL}/@${user.userName}`,
        siteName: 'Zling',
        firstName: user.name?.split(' ')[0] || '',
        lastName: user.name?.split(' ')[1] || '',
        username: user.userName,
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        creator: '@krbln',
      },
      alternates: {
        canonical: `${APP_URL}/@${paramsResolved.username}`,
      },
    }
  } catch (error) {
    console.log(error)
    return defaultMetadata()
  }
}

function defaultMetadata(): Metadata {
  return {
    title: 'Профиль пользователя | Zling',
    description: 'Профиль пользователя в социальной сети Zling',
    openGraph: {
      type: 'profile',
      title: 'Профиль пользователя | Zling',
      description: 'Профиль пользователя в социальной сети Zling',
      url: APP_URL,
      siteName: 'Zling',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Профиль пользователя | Zling',
      description: 'Профиль пользователя в социальной сети Zling',
      creator: '@krbln',
    },
  }
}

type PageProps = {
  params: Promise<{ username: string }>
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}

function UserProfile({ params }: PageProps) {
  return <UserProfileClient params={Promise.resolve(params)} />
}

export default UserProfile
