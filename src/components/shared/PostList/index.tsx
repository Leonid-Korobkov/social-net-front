'use client'
import { AnimatePresence, motion } from 'framer-motion'
import CardSkeleton from '../../ui/CardSkeleton'
import Card from '../Card'
import { Spinner } from '@heroui/react'
import { useInView } from 'react-intersection-observer'
import { useEffect, useRef } from 'react'
import { Post } from '@/store/types'
import { useWindowVirtualizer } from '@tanstack/react-virtual'

interface PostListProps {
  data: Post[]
  isLoading: boolean
  handleCardClick?: () => void
  className?: string
  hasMore?: boolean
  onLoadMore?: () => void
  isFetchingMore?: boolean
  skeletonClassName?: string
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
}: PostListProps) {
  const parentRef = useRef<HTMLDivElement>(null)

  // const virtualizer = useWindowVirtualizer({
  //   count: data.length,
  //   estimateSize: () => 300,
  //   overscan: 5,
  //   measureElement: element => element?.getBoundingClientRect().height || 300,
  // })

  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0,
  })

  useEffect(() => {
    if (inView && !isLoading && !isFetchingMore && hasMore && onLoadMore) {
      onLoadMore()
    }
  }, [inView, isLoading, isFetchingMore, hasMore, onLoadMore])

  // Обновляем scrollMargin при монтировании и изменении позиции родительского элемента
  // useEffect(() => {
  //   if (parentRef.current) {
  //     const updateScrollMargin = () => {
  //       const offset = parentRef.current?.offsetTop || 0
  //       virtualizer.options.scrollMargin = offset
  //     }

  //     updateScrollMargin()
  //     window.addEventListener('resize', updateScrollMargin)
  //     return () => window.removeEventListener('resize', updateScrollMargin)
  //   }
  // }, [virtualizer])

  if (isLoading && !data.length) {
    return (
      <div className={skeletonClassName}>
        {Array.from({ length: 5 }).map((_, index) => (
          <CardSkeleton key={index} />
        ))}
      </div>
    )
  }

  return (
    <div className={className}>
      <div ref={parentRef} className="relative w-full">
        <div
          // style={{ height: `${virtualizer.getTotalSize()}px` }}
          className="w-full"
        >
          {data.map(post => {
            if (!post || !post.authorId) return null

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
            } = post

            return (
              <motion.div
                key={post.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, bounce: 0 }}
                layout="position"
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
                />
              </motion.div>
            )
          })}
        </div>
      </div>
      {(hasMore || isFetchingMore) && (
        <div ref={loadMoreRef} className="py-4 flex justify-center">
          {isFetchingMore ? (
            <Spinner size="lg" color="secondary" variant="gradient" />
          ) : (
            hasMore && <div className="h-20" />
          )}
        </div>
      )}
    </div>
  )
}

export default PostList
