import { Metadata } from 'next'
import axios from 'axios'

const HOST_URL = 'https://zling.vercel.app'

export async function generateMetadata({
  params,
}: {
  params: { id: string }
}): Promise<Metadata> {
  try {
    const response = await axios.get(`${HOST_URL}/api/user/${params.id}`)
    const user = response.data

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
        url: `${HOST_URL}/users/${params.id}`,
        images: [
          {
            url: `${HOST_URL}/users/${params.id}/opengraph-image`,
            width: 1200,
            height: 630,
            alt: `Профиль ${user.name} в Zling`,
          },
        ],
        siteName: 'Zling',
        firstName: user.name?.split(' ')[0] || '',
        lastName: user.name?.split(' ')[1] || '',
        username: user.userName,
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [`${HOST_URL}/users/${params.id}/opengraph-image`],
        creator: '@krbln',
      },
      alternates: {
        canonical: `${HOST_URL}/users/${params.id}`,
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
      url: HOST_URL,
      images: [
        {
          url: `${HOST_URL}/images/og-image.png`,
          width: 1200,
          height: 630,
          alt: 'Профиль пользователя в Zling',
        },
      ],
      siteName: 'Zling',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Профиль пользователя | Zling',
      description: 'Профиль пользователя в социальной сети Zling',
      images: [`${HOST_URL}/images/og-image.png`],
      creator: '@krbln',
    },
  }
}
