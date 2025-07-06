import { APP_URL } from '@/app/constants'
import { Metadata } from 'next'
import EditProfileClient from './page-client'
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
    const title = `Редактирование профиля ${user.name} (@${user.userName}) | Zling`
    const description = `Измените данные своего профиля в социальной сети Zling.`
    return {
      title,
      description,
      openGraph: {
        type: 'profile',
        title,
        description,
        url: `${APP_URL}/${user.userName}/edit`,
        siteName: 'Zling',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        creator: '@krbln',
      },
      alternates: {
        canonical: `${APP_URL}/${user.userName}/edit`,
      },
    }
  } catch (error) {
    return defaultMetadata()
  }
}

function defaultMetadata(): Metadata {
  return {
    title: 'Редактирование профиля | Zling',
    description: 'Измените данные своего профиля в социальной сети Zling.',
    openGraph: {
      type: 'profile',
      title: 'Редактирование профиля | Zling',
      description: 'Измените данные своего профиля в социальной сети Zling.',
      url: APP_URL,
      siteName: 'Zling',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Редактирование профиля | Zling',
      description: 'Измените данные своего профиля в социальной сети Zling.',
      creator: '@krbln',
    },
  }
}

type PageProps = {
  params: Promise<{ username: string }>
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}

function EditProfile({ params }: PageProps) {
  return <EditProfileClient params={Promise.resolve(params)} />
}

export default EditProfile
