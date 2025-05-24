'use client'
import CardCommentSkeleton from '@/components/ui/CardCommentSkeleton'
import { Spinner } from '@heroui/react'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import Card from '../Card'
import { Comment } from '@/store/types'

interface CommentsListProps {
  data: Comment[] | undefined
  isLoading: boolean
  handleCardClick?: () => void
  className?: string
  hasMore?: boolean
  onLoadMore?: () => void
  isFetchingMore?: boolean
}

function CommentList({
  data,
  isLoading,
  className,
  hasMore,
  onLoadMore,
  isFetchingMore,
}: CommentsListProps) {
  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0,
  })

  useEffect(() => {
    if (inView && !isLoading && !isFetchingMore && hasMore && onLoadMore) {
      onLoadMore()
    }
  }, [inView, isLoading, isFetchingMore, hasMore])

  if (isLoading && !data?.length) {
    return (
      <div className="mt-10">
        {Array.from({ length: 5 }).map((_, index) => (
          <CardCommentSkeleton key={index} />
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
          {!isLoading && data
            ? data.map(comment => (
                <motion.div
                  key={comment.id}
                  id={`comment-${comment.id}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, bounce: 0 }}
                  layout="position"
                >
                  <Card
                    cardFor="comment"
                    avatarUrl={comment.user?.avatarUrl ?? ''}
                    content={comment.content}
                    username={comment.user?.userName ?? ''}
                    authorId={comment.userId ?? ''}
                    commentId={comment.id}
                    id={comment.postId}
                    createdAt={comment.createdAt}
                    likedByUser={comment.likedByUser}
                    likesCount={comment.likeCount}
                    likes={comment.likes}
                    media={comment.media}
                  />
                </motion.div>
              ))
            : null}
        </AnimatePresence>
      </motion.div>
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

export default CommentList
