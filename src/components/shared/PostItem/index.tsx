'use client'
import { Post } from '@/store/types'
import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import Card from '../Card'

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
    ogImageUrl = '',
    ogTitle = '',
    ogDescr = '',
    ogUrl = '',
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
        ogImageUrl={ogImageUrl}
        ogTitle={ogTitle}
        ogDescr={ogDescr}
        ogUrl={ogUrl}
      />
    </motion.div>
  )
}

export default PostItem
