import { use } from 'react'
import CurrentPostClient from './page-client'
import { Metadata } from 'next'
import { APP_URL } from '@/app/constants'
import { Post } from '@/store/types'
import { stripHtml } from '@/utils/stripHtml'
import { fetchOpenGraphPostData } from '@/app/utils/opengraph-api'

type PageProps = {
  params: Promise<{ id: string; username: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string; username: string }>
}): Promise<Metadata> {
  const paramsResolved = await params
  try {
    const post = await fetchOpenGraphPostData(paramsResolved.id)

    if (!post) {
      return defaultMetadata()
    }

    // Парсим HTML-контент и преобразуем его в текст без тегов
    const cleanContent = stripHtml(post.content)

    // Обрезаем контент поста до 250 символов
    const truncatedContent =
      cleanContent.length > 200
        ? `${cleanContent.substring(0, 200)}...`
        : cleanContent

    const title = `Пост от ${post.author?.name || 'пользователя'} | Zling`
    const description = truncatedContent

    return {
      title,
      description,
      openGraph: {
        type: 'article',
        title,
        description,
        url: `${APP_URL}/${post.author.userName}/post/${post.id}`,
        siteName: 'Zling',
        publishedTime: post.createdAt.toString(),
        authors: [`${post.author?.name || 'Пользователь Zling'}`],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        creator: post.author?.userName ? `@${post.author.userName}` : '@krbln',
      },
      alternates: {
        canonical: `${APP_URL}/${post.author.userName}/post/${post.id}`,
      },
    }
  } catch (error) {
    console.log(error)
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
