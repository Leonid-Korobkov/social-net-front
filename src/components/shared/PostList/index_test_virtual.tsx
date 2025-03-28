import { motion } from 'framer-motion'
import { Post } from '../../../app/types'
import CardSkeleton from '../../ui/CardSkeleton'
import Card from '../Card'
import { useEffect, useRef, useState } from 'react'
import { Spinner } from "@heroui/react"
import { Virtuoso, Components } from 'react-virtuoso'

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
  const virtuosoRef = useRef(null)
  const [visibleRange, setVisibleRange] = useState([0, 0] as [number, number])

  // Восстанавливаем позицию скролла
  useEffect(() => {
    const scrollPosition = sessionStorage.getItem('postsScrollPosition')
    const visibleRangeStorage = sessionStorage.getItem('visibleRange')
    console.log(visibleRangeStorage)
    if (scrollPosition && virtuosoRef.current) {
      setTimeout(() => {
      // ;(virtuosoRef.current as any)?.scrollToIndex({
      //   index: 2,
      //   align: 'center',
      // })
      console.log(scrollPosition)
      window.scrollTo({ top: parseInt(scrollPosition, 10) })
      // ;(virtuosoRef.current as any)?.scrollTo({
      //   top: parseInt(scrollPosition, 10),
      // })
      }, 30)
    }
  }, [])

  // Сохраняем позицию скролла при уходе со страницы
  useEffect(() => {
    const handleScroll = () => {
      sessionStorage.setItem('postsScrollPosition', window.scrollY.toString())
      sessionStorage.setItem('visibleRange', JSON.stringify(visibleRange))
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (isLoading && !data.length) {
    return (
      <div>
        {Array.from({ length: 5 }).map((_, index) => (
          <CardSkeleton key={index} />
        ))}
      </div>
    )
  }

  const Footer: Components['Footer'] = () => {
    if (!hasMore && !isFetchingMore) return null

    return (
      <div className="py-4 flex justify-center">
        {isFetchingMore ? (
          <Spinner size="lg" />
        ) : (
          hasMore && <div className="h-20" />
        )}
      </div>
    )
  }

  return (
    <div className={className}>
      <Virtuoso
        ref={virtuosoRef}
        useWindowScroll
        data={data}
        endReached={onLoadMore}
        overscan={1000}
        components={{
          Footer,
        }}
        scrollSeekConfiguration={{
          enter: velocity => Math.abs(velocity) > 5000,
          exit: velocity => {
            const shouldExit = Math.abs(velocity) < 100
            if (shouldExit) {
              setVisibleRange([0, 0])
            }
            return shouldExit
          },
          change: (_velocity, { startIndex, endIndex }) =>
            setVisibleRange([startIndex, endIndex]),
        }}
        itemContent={(_index: number, post: Post) => (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="mb-4"
            key={_index}
          >
            <Card
              id={post.id}
              authorId={post.authorId}
              avatarUrl={post.author.avatarUrl || ''}
              cardFor={'post'}
              content={post.content}
              name={post.author.name || ''}
              likedByUser={post.likedByUser}
              commentsCount={post.comments.length}
              createdAt={post.createdAt}
              likesCount={post.likes.length}
              isFollowing={post.isFollowing}
              likes={post.likes}
              onClick={handleCardClick}
            />
          </motion.div>
        )}
      />
    </div>
  )
}
export default PostList
