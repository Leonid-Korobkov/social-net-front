import { use } from 'react'
import CurrentPostClient from './page-client'

type PageProps = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

import { Metadata } from 'next'
import { APP_URL } from '@/app/constants'
import { apiClient } from '@/services/ApiConfig'
import { Post } from '@/store/types'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const paramsResolved = await params
  try {
    const response = await apiClient<string, Post>(
      `posts/${paramsResolved.id}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN_FOR_REQ}`,
        },
      }
    )
    const post = response

    if (!post) {
      return defaultMetadata()
    }

    // Обрезаем контент до 200 символов для description
    const truncatedContent =
      post.content.length > 200
        ? `${post.content.substring(0, 200)}...`
        : post.content

    const title = `Пост от ${post.author?.name || 'пользователя'} | Zling`
    const description = truncatedContent

    // Формируем URL для OG изображения
    const ogImageUrl = `${APP_URL}/api/og?type=post&id=${post.id}`

    return {
      title,
      description,
      openGraph: {
        type: 'article',
        title,
        description,
        url: `${APP_URL}/posts/${paramsResolved.id}`,
        siteName: 'Zling',
        publishedTime: post.createdAt.toString(),
        authors: [`${post.author?.name || 'Пользователь Zling'}`],
        images: [
          {
            url: ogImageUrl,
            width: 1200,
            height: 630,
            alt: `Пост в Zling`,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        creator: post.author?.userName ? `@${post.author.userName}` : '@krbln',
        images: [ogImageUrl],
      },
      alternates: {
        canonical: `${APP_URL}/posts/${paramsResolved.id}`,
      },
    }
  } catch (error) {
    return defaultMetadata()
  }
}

function defaultMetadata(): Metadata {
  return {
    title: 'Пост | Zling',
    description: 'Пост в социальной сети Zling',
    openGraph: {
      type: 'article',
      title: 'Пост | Zling',
      description: 'Пост в социальной сети Zling',
      url: APP_URL,
      siteName: 'Zling',
      images: [
        {
          url: `${APP_URL}/api/og?title=Пост`,
          width: 1200,
          height: 630,
          alt: 'Пост в Zling',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Пост | Zling',
      description: 'Пост в социальной сети Zling',
      creator: '@krbln',
      images: [`${APP_URL}/api/og?title=Пост`],
    },
  }
}

async function CurrentPost({ params, searchParams }: PageProps) {
  const paramsIn = await params
  const searchParamsIn = await searchParams
  return (
    <CurrentPostClient
      params={paramsIn}
      searchParams={searchParamsIn}
    ></CurrentPostClient>
  )
}

export default CurrentPost
