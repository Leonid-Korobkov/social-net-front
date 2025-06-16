'use client'
import ViewedAllPosts from '@/components/ui/ViewedAllPosts'
import { FeedType } from '@/services/api/post.api'
import { Post } from '@/store/types'
import { UserSettingsStore } from '@/store/userSettings.store'
import { cn, Spinner } from '@heroui/react'
import { useEffect, useRef } from 'react'
import { useInView } from 'react-intersection-observer'
import CardSkeleton from '../../ui/CardSkeleton'
import FeedTypeDropdown from '../FeedTypeDropdown'
import PostItem from '../PostItem'
import EmptyPosts from '@/components/ui/EmptyPosts'

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

  return (
    <div className={cn(currentFeedType != null && 'lg:mt-[-80px]', className)}>
      {currentFeedType != null && (
        <div
          className={cn(
            'flex justify-between gap-2 lg:sticky lg:top-0 lg:z-50 lg:py-3 mb-4 justify-center'
          )}
        >
          <FeedTypeDropdown
            onFeedTypeChange={onFeedTypeChange}
            currentFeedType={currentFeedType}
          />
        </div>
      )}
      {isLoading && !data.length ? (
        // Отображаем скелет при первой загрузке или когда данных еще нет
        <div className={skeletonClassName}>
          {Array.from({ length: 5 }).map((_, index) => (
            <CardSkeleton key={index} />
          ))}
        </div>
      ) : (
        // Отображаем список постов или сообщение о просмотре всех постов
        <>
          {data.length === 0 && allViewed && <ViewedAllPosts />}
          {data.length === 0 && !allViewed && <EmptyPosts />}
          {data.length > 0 && (
            <div
              ref={parentRef}
              className="relative md:w-full md:overflow-visible"
            >
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
        </>
      )}
    </div>
  )
}

export default PostList
