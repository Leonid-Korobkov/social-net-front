import { APP_URL } from '@/app/constants'
import { Metadata } from 'next'
import SettingsProfileClient from './page-client'
import { fetchOpenGraphUserData } from '@/app/utils/opengraph-api'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>
}): Promise<Metadata> {
  try {
    const paramsResolved = await params
    const user = await fetchOpenGraphUserData(paramsResolved.username)
    if (!user) {
      return defaultMetadata()
    }
    const title = `Настройки профиля ${user.name} (@${user.userName}) | Zling`
    const description = `Измените настройки приватности и уведомлений в социальной сети Zling.`
    return {
      title,
      description,
      openGraph: {
        type: 'profile',
        title,
        description,
        url: `${APP_URL}/${user.userName}/settings`,
        siteName: 'Zling',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        creator: '@krbln',
      },
      alternates: {
        canonical: `${APP_URL}/${user.userName}/settings`,
      },
    }
  } catch (error) {
    return defaultMetadata()
  }
}

function defaultMetadata(): Metadata {
  return {
    title: 'Настройки профиля | Zling',
    description:
      'Измените настройки приватности и уведомлений в социальной сети Zling.',
    openGraph: {
      type: 'profile',
      title: 'Настройки профиля | Zling',
      description:
        'Измените настройки приватности и уведомлений в социальной сети Zling.',
      url: APP_URL,
      siteName: 'Zling',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Настройки профиля | Zling',
      description:
        'Измените настройки приватности и уведомлений в социальной сети Zling.',
      creator: '@krbln',
    },
  }
}

type PageProps = {
  params: Promise<{ username: string }>
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}

function SettingsProfile({ params }: PageProps) {
  return <SettingsProfileClient params={Promise.resolve(params)} />
}

export default SettingsProfile
