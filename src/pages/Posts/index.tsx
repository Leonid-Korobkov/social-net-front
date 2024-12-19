import { useGetAllPostsQuery } from '../../app/services/post.api'
import Card from '../../components/shared/Card'
import CardSkeleton from '../../components/ui/CardSkeleton'
import CreatePost from '../../components/shared/PostCreate'
import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

function Posts() {
  const { data, isLoading } = useGetAllPostsQuery()

  useEffect(() => {
    const savedPosition = sessionStorage.getItem('scrollPosition')
    if (savedPosition) {
      window.scrollTo({
        top: parseInt(savedPosition),
        behavior: 'smooth',
      })
      sessionStorage.removeItem('scrollPosition')
    }
  }, [])

  const handleCardClick = () => {
    const scrollPosition = window.scrollY
    sessionStorage.setItem('scrollPosition', scrollPosition.toString())
  }

  return (
    <>
      <div className="mb-10 w-full">
        <CreatePost />
      </div>
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
                    layout
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
    </>
  )
}

export default Posts
