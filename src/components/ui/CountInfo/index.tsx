import { Link } from 'react-router-dom'
import MetaInfo from '../MetaInfo'
import { IconType } from 'react-icons'
import { Spinner, Skeleton } from '@nextui-org/react'

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
          count
        ) : count === 0 ? (
          <p className="font-bold text-xl">{count}</p>
        ) : (
          <Skeleton className="h-6 w-6 rounded-lg" />
        )}
        <div className="flex items-center gap-2">
          <Icon className="text-xl" />
          {title ? title : <Skeleton className="h-4 w-16 rounded-lg" />}
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
      to={`/users/${userId}/${type}`}
    >
      {content}
    </Link>
  )
}

export default CountInfo
