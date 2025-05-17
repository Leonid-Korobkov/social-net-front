'use client'
import { motion } from 'framer-motion'
import CardSkeleton from '../../ui/CardSkeleton'
import Card from '../Card'
import {
  Spinner,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  cn,
} from '@heroui/react'
import { useInView } from 'react-intersection-observer'
import { useEffect, useRef, useState } from 'react'
import { Post } from '@/store/types'
import { FeedType } from '@/services/api/post.api'
import { useIncrementViewsBatch } from '@/services/api/post.api'
import { UserSettingsStore } from '@/store/userSettings.store'
import { TbFlame, TbClock, TbEye, TbChevronDown } from 'react-icons/tb'
import { RiUserFollowFill } from 'react-icons/ri'
import ViewedAllPosts from '@/components/ui/ViewedAllPosts'
import { useStore } from 'zustand'
import { useRouter, useSearchParams } from 'next/navigation'

// Компонент для отдельного поста с отслеживанием видимости
const PostItem = ({
  post,
  handleCardClick,
  onPostInView,
}: {
  post: Post
  handleCardClick?: () => void
  onPostInView: (postId: string) => void
}) => {
  const {
    author,
    authorId,
    commentCount,
    content,
    createdAt,
    id,
    likeCount,
    likedByUser = false,
    isFollowing = false,
    viewCount = 0,
    shareCount = 0,
    media = [],
  } = post

  // Используем useInView для отслеживания видимости поста
  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: true,
  })

  // Отслеживаем видимость поста
  useEffect(() => {
    if (inView) {
      onPostInView(id)
    }
  }, [inView, id, onPostInView])

  return (
    <motion.div
      key={id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, bounce: 0 }}
      layout="position"
      ref={ref}
    >
      <Card
        id={id}
        authorId={authorId}
        avatarUrl={author?.avatarUrl || ''}
        cardFor={'post'}
        content={content}
        username={author?.userName || ''}
        likedByUser={likedByUser}
        commentsCount={commentCount}
        createdAt={createdAt}
        likesCount={likeCount}
        isFollowing={isFollowing}
        onClick={handleCardClick}
        viewCount={viewCount}
        shareCount={shareCount}
        media={media}
      />
    </motion.div>
  )
}

// Мапинг типов лент на их иконки и описания
const feedTypeInfo = {
  'for-you': {
    icon: <TbFlame className="text-orange-500" />,
    label: 'Для вас',
    description: 'Рекомендованные посты',
  },
  new: {
    icon: <TbClock className="text-blue-500" />,
    label: 'Новое',
    description: 'Самые свежие посты',
  },
  following: {
    icon: <RiUserFollowFill className="text-purple-500" />,
    label: 'Подписки',
    description: 'Посты от пользователей, на которых вы подписаны',
  },
  viewed: {
    icon: <TbEye className="text-green-500" />,
    label: 'Просмотренное',
    description: 'Посты, которые вы уже смотрели',
  },
}

function PostListDropdown({
  currentFeedType,
  onFeedTypeChange,
}: {
  currentFeedType: FeedType | null
  onFeedTypeChange?: (feedType: FeedType) => void
}) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Получение типа ленты из URL или Zustand
  const urlFeedType = searchParams.get('feed') as FeedType | null

  const feedTypeFromStore = useStore(
    UserSettingsStore,
    state => state.feedType as FeedType
  )
  const setFeedTypeToStore = useStore(
    UserSettingsStore,
    state => state.setFeedType
  )

  // Приоритет: URL >  хранилище > переданный параметр > значение по умолчанию
  const initialFeedType =
    urlFeedType || feedTypeFromStore || currentFeedType || 'new'
  const [feedType, setFeedType] = useState<FeedType>(initialFeedType)

  // Обновление URL и Zustand при первой загрузке
  useEffect(() => {
    // Обновляем URL
    const params = new URLSearchParams(searchParams.toString())

    params.set('feed', feedType)

    // Обновляем Zustand
    setFeedTypeToStore(feedType)

    // Вызываем колбэк если он передан
    if (onFeedTypeChange) {
      onFeedTypeChange(feedType)
    }
  }, [])

  // Обработчик изменения типа ленты
  const handleFeedTypeChange = (feedKey: string | number | null) => {
    if (feedKey) {
      const newFeedType = feedKey.toString() as FeedType

      // Обновляем URL
      const params = new URLSearchParams(searchParams.toString())
      params.set('feed', newFeedType)
      const newUrl = params.toString() ? `?${params.toString()}` : ''
      router.replace(`${newUrl}`, { scroll: false })

      // Обновляем Zustand
      setFeedTypeToStore(newFeedType)

      // Вызываем колбэк если он передан
      if (onFeedTypeChange) {
        onFeedTypeChange(newFeedType)
      }

      setFeedType(newFeedType)
    }
  }

  return (
    <div className="md:sticky md:top-0 md:z-50 md:py-3 mb-4 flex justify-center">
      <Dropdown>
        <DropdownTrigger>
          <Button
            variant="flat"
            className="px-4 py-2 rounded-full border border-default-200 bg-content1 flex items-center gap-2 hover:bg-default-200/70 transition-colors"
          >
            {feedTypeInfo[feedType].icon}
            <span className="font-medium">{feedTypeInfo[feedType].label}</span>
            <div className="w-6 h-6 rounded-full border border-default-300 flex items-center justify-center ml-1">
              <TbChevronDown size={14} />
            </div>
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          variant="flat"
          aria-label="Выберите тип ленты"
          onAction={handleFeedTypeChange}
          selectedKeys={[feedType]}
        >
          <DropdownItem
            key="for-you"
            startContent={feedTypeInfo['for-you'].icon}
            description={feedTypeInfo['for-you'].description}
          >
            {feedTypeInfo['for-you'].label}
          </DropdownItem>
          <DropdownItem
            key="new"
            startContent={feedTypeInfo['new'].icon}
            description={feedTypeInfo['new'].description}
          >
            {feedTypeInfo['new'].label}
          </DropdownItem>
          <DropdownItem
            key="following"
            startContent={feedTypeInfo['following'].icon}
            description={feedTypeInfo['following'].description}
          >
            {feedTypeInfo['following'].label}
          </DropdownItem>
          <DropdownItem
            key="viewed"
            startContent={feedTypeInfo['viewed'].icon}
            description={feedTypeInfo['viewed'].description}
          >
            {feedTypeInfo['viewed'].label}
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  )
}

interface PostListProps {
  data: Post[]
  isLoading: boolean
  handleCardClick?: () => void
  className?: string
  hasMore?: boolean
  onLoadMore?: () => void
  isFetchingMore?: boolean
  skeletonClassName?: string
  onFeedTypeChange?: (feedType: FeedType) => void
  currentFeedType?: FeedType | null
  allViewed?: boolean
}

function PostList({
  data,
  isLoading,
  handleCardClick,
  className,
  hasMore,
  onLoadMore,
  isFetchingMore,
  skeletonClassName,
  onFeedTypeChange,
  currentFeedType,
  allViewed,
}: PostListProps) {
  const parentRef = useRef<HTMLDivElement>(null)

  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0,
  })

  // Для загрузки следующей страницы
  useEffect(() => {
    if (inView && !isLoading && !isFetchingMore && hasMore && onLoadMore) {
      onLoadMore()
    }
  }, [inView, isLoading, isFetchingMore, hasMore, onLoadMore])

  // Обработчик просмотра поста
  const handlePostInView = (postId: string) => {
    if (!UserSettingsStore.getState().wasPostViewed(postId)) {
      UserSettingsStore.getState().addViewedPost(postId)
      UserSettingsStore.getState().addPendingViewPost(postId)
    }
  }

  if (isLoading && !data.length) {
    return (
      <div className={cn(currentFeedType != null && 'md:mt-[-80px]')}>
        {currentFeedType != null && (
          <PostListDropdown
            onFeedTypeChange={onFeedTypeChange}
            currentFeedType={currentFeedType}
          />
        )}
        <div className={skeletonClassName}>
          {Array.from({ length: 5 }).map((_, index) => (
            <CardSkeleton key={index} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={cn(currentFeedType != null && 'md:mt-[-80px]', className)}>
      {currentFeedType != null && (
        <PostListDropdown
          onFeedTypeChange={onFeedTypeChange}
          currentFeedType={currentFeedType}
        />
      )}
      {data.length === 0 && allViewed && <ViewedAllPosts />}
      {data.length > 0 && (
        <div ref={parentRef} className="relative md:w-full md:overflow-visible">
          <div className="w-full">
            {data.map(post => {
              if (!post || !post.authorId) return null

              return (
                <PostItem
                  key={post.id}
                  post={post}
                  handleCardClick={handleCardClick}
                  onPostInView={handlePostInView}
                />
              )
            })}
          </div>
        </div>
      )}
      {(hasMore || isFetchingMore) && (
        <div ref={loadMoreRef} className="py-4 flex justify-center">
          {isFetchingMore ? (
            <Spinner size="lg" color="primary" variant="gradient" />
          ) : (
            hasMore && <div className="h-20" />
          )}
        </div>
      )}
    </div>
  )
}

export default PostList
