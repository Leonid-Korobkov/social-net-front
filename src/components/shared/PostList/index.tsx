import { AnimatePresence, motion } from 'framer-motion'
import { Post } from '../../../app/types'
import CardSkeleton from '../../ui/CardSkeleton'
import Card from '../Card'

interface PostListProps {
  data: Post[]
  isLoading: boolean
  handleCardClick?: () => void
  className?: string
}

function PostList({
  data,
  isLoading,
  handleCardClick,
  className,
}: PostListProps) {
  return (
    <div className={className}>
      {isLoading ? (
        <div className="mt-10">
          {Array.from({ length: 5 }).map((_, index) => (
            <CardSkeleton key={index} />
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <AnimatePresence mode="popLayout">
            {data &&
              data.length > 0 &&
              data.map(
                ({
                  author,
                  authorId,
                  comments,
                  content,
                  createdAt,
                  id,
                  likes,
                  likedByUser,
                  isFollowing,
                }) => (
                  <motion.div
                    key={id}
                    initial="hidden"
                    animate="show"
                    exit="exit"
                  >
                    <Card
                      id={id}
                      authorId={authorId}
                      avatarUrl={author.avatarUrl || ''}
                      cardFor={'post'}
                      content={content}
                      name={author.name || ''}
                      likedByUser={likedByUser}
                      commentsCount={comments.length}
                      createdAt={createdAt}
                      likesCount={likes.length}
                      isFollowing={isFollowing}
                      onClick={handleCardClick}
                    />
                  </motion.div>
                ),
              )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  )
}

export default PostList
