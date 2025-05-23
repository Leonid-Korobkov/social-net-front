'use client'
import Link from 'next/link'
import MetaInfo from '../MetaInfo'
import { IconType } from 'react-icons'
import { Skeleton } from '@heroui/react'
import { pluralizeRu } from '@/utils/pluralizeRu'

interface ICountInfo {
  Icon: IconType
  count?: number
  title: string
  isLoading?: boolean
  userId?: string
  type?: 'followers' | 'following'
}

function CountInfo({
  Icon,
  count,
  title,
  isLoading,
  userId,
  type,
}: ICountInfo) {
  const content = (
    <div className="p-3">
      <div className="flex flex-col items-center">
        {count ? (
          <p className="font-bold text-xl">{count}</p>
        ) : count === 0 ? (
          <p className="font-bold text-xl">0</p>
        ) : (
          <Skeleton className="h-6 w-6 rounded-lg" />
        )}
        <div className="flex items-center gap-2">
          <Icon className="text-xl" />
          {title === 'Подписчики' && typeof count === 'number'
            ? pluralizeRu(count, ['подписчик', 'подписчика', 'подписчиков'])
            : title === 'Подписки' && typeof count === 'number'
            ? pluralizeRu(count, ['подписка', 'подписки', 'подписок'])
            : title === 'Публикации' && typeof count === 'number'
            ? pluralizeRu(count, ['публикация', 'публикации', 'публикаций'])
            : title || <Skeleton className="h-4 w-16 rounded-lg" />}
        </div>
      </div>
    </div>
  )

  if (!userId) {
    return content
  }

  return (
    <Link
      className="transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110"
      href={`/${userId}/${type}`}
    >
      {content}
    </Link>
  )
}

export default CountInfo
