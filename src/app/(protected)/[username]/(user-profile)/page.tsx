import UserProfileClient from './page-client'
import { Metadata } from 'next'
import { APP_URL } from '@/app/constants'
import { apiClient } from '@/services/ApiConfig'
import { User } from '@/store/types'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>
}): Promise<Metadata> {
  const paramsResolved = await params
  try {
    const response = await apiClient<string, User>(
      `users/${paramsResolved.username}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN_FOR_REQ}`,
        },
      }
    )
    const user = response

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
      images: [
        {
          url: `${APP_URL}/api/og?title=Профиль пользователя`,
          width: 1200,
          height: 630,
          alt: 'Профиль пользователя в Zling',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Профиль пользователя | Zling',
      description: 'Профиль пользователя в социальной сети Zling',
      creator: '@krbln',
      images: [`${APP_URL}/api/og?title=Профиль пользователя`],
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
