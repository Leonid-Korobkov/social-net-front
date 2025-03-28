import { AnimatePresence, motion } from 'framer-motion'
import { Post } from '../../../app/types'
import CardSkeleton from '../../ui/CardSkeleton'
import Card from '../Card'
import { Spinner } from "@heroui/react"
import { useInView } from 'react-intersection-observer'
import { useEffect } from 'react'

interface PostListProps {
  data: Post[]
  isLoading: boolean
  handleCardClick?: () => void
  className?: string
  hasMore?: boolean
  onLoadMore?: () => void
  isFetchingMore?: boolean
}

function PostList({
  data,
  isLoading,
  handleCardClick,
  className,
  hasMore,
  onLoadMore,
  isFetchingMore,
}: PostListProps) {
  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0,
  })

  useEffect(() => {
    if (inView && !isLoading && !isFetchingMore && hasMore && onLoadMore) {
      onLoadMore()
    }
  }, [inView, isLoading, isFetchingMore, hasMore])

  if (isLoading && !data.length) {
    return (
      <div>
        {Array.from({ length: 5 }).map((_, index) => (
          <CardSkeleton key={index} />
        ))}
      </div>
    )
  }

  return (
    <div className={className}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <AnimatePresence mode="popLayout">
          {data &&
            data.length > 0 &&
            data.map(post => {
              if (!post || !post.author) return null

              const {
                author,
                authorId,
                comments = [],
                content,
                createdAt,
                id,
                likes = [],
                likedByUser = false,
                isFollowing = false,
              } = post

              return (
                <motion.div
                  key={id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, bounce: 0 }}
                  layout="position"
                >
                  <Card
                    id={id}
                    authorId={authorId}
                    avatarUrl={author?.avatarUrl || ''}
                    cardFor={'post'}
                    content={content}
                    name={author?.name || ''}
                    likedByUser={likedByUser}
                    commentsCount={comments?.length || 0}
                    createdAt={createdAt}
                    likesCount={likes?.length || 0}
                    isFollowing={isFollowing}
                    likes={likes}
                    onClick={handleCardClick}
                  />
                </motion.div>
              )
            })}
        </AnimatePresence>
      </motion.div>
      {(hasMore || isFetchingMore) && (
        <div ref={loadMoreRef} className="py-4 flex justify-center">
          {isFetchingMore ? (
            <Spinner size="lg" />
          ) : (
            hasMore && <div className="h-20" />
          )}
        </div>
      )}
    </div>
  )
}

export default PostList
