'use client'
import { useGetPostByIdQuery } from '@/store/services/post.api'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, use } from 'react'
import GoBack from '@/components/layout/GoBack'
import CardSkeleton from '@/components/ui/CardSkeleton'
import CreateCommentSkeleton from '@/components/ui/CommentCreateSkeleton'
import CardCommentSkeleton from '@/components/ui/CardCommentSkeleton'
import CreateComment from '@/components/shared/CommentCreate'
import Card from '@/components/shared/Card'
import { useRouter } from 'next/navigation'

type PageProps = {
  params: Promise<{
    [x: string]: string
    id: string
  }>
  searchParams: Promise<{
    [x: string]: string
    comment: string
  }>
}

function CurrentPost({ params, searchParams }: PageProps) {
  const paramsIn = use(params)
  const searchParamsIn = use(searchParams)

  const commentId = searchParamsIn.comment
  const router = useRouter()
  const { data, isLoading } = useGetPostByIdQuery(paramsIn.id)

  useEffect(() => {
    if (commentId && !isLoading && data?.comments) {
      const commentElement = document.getElementById(`comment-${commentId}`)
      if (commentElement) {
        setTimeout(() => {
          commentElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
          commentElement.classList.add('highlight')
          setTimeout(() => {
            commentElement.classList.remove('highlight')
            router.push(`/posts/${paramsIn.id}`)
          }, 2000)
        }, 200)
      }
    }
  }, [commentId, isLoading, data])

  if (isLoading) {
    return (
      <>
        <GoBack />
        <CardSkeleton />
        <div className="mt-10">
          <CreateCommentSkeleton />
        </div>
        <div className="mt-10">
          {Array.from({ length: 5 }).map((_, index) => (
            <CardCommentSkeleton key={index} />
          ))}
        </div>
      </>
    )
  }

  if (!data) return <h1>Поста не существует</h1>

  const {
    content,
    author,
    authorId,
    comments,
    likes,
    createdAt,
    id,
    likedByUser,
    isFollowing,
  } = data

  return (
    <>
      <GoBack />
      <Card
        cardFor="current-post"
        avatarUrl={author?.avatarUrl ?? ''}
        content={content}
        name={author?.name ?? ''}
        likesCount={likes.length}
        commentsCount={comments?.length}
        authorId={authorId}
        id={id}
        likedByUser={likedByUser}
        createdAt={createdAt}
        isFollowing={isFollowing}
        likes={likes}
      />
      <div className="mt-10">
        <CreateComment params={paramsIn} />
      </div>
      <div className="mt-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <AnimatePresence mode="popLayout">
            {data.comments
              ? data.comments.map(comment => (
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
                      name={comment.user?.name ?? ''}
                      authorId={comment.userId ?? ''}
                      commentId={comment.id}
                      id={id}
                      createdAt={comment.createdAt}
                      likedByUser={comment.likedByUser}
                      likesCount={comment.likes.length}
                      likes={comment.likes}
                    />
                  </motion.div>
                ))
              : null}
          </AnimatePresence>
        </motion.div>
      </div>
    </>
  )
}

export default CurrentPost
