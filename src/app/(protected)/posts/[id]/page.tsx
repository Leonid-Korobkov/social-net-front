'use client'
import GoBack from '@/components/layout/GoBack'
import Card from '@/components/shared/Card'
import CreateComment from '@/components/shared/CommentCreate'
import CommentList from '@/components/shared/CommentList'
import CardCommentSkeleton from '@/components/ui/CardCommentSkeleton'
import CardSkeleton from '@/components/ui/CardSkeleton'
import CreateCommentSkeleton from '@/components/ui/CommentCreateSkeleton'
import { useGetCommentsByPostId } from '@/services/api/comment.api'
import { useGetPostById } from '@/services/api/post.api'
import { AnimatePresence, motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { use, useEffect } from 'react'

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

  const {
    data: comments,
    fetchNextPage: fetchNextPageComments,
    hasNextPage: hasNextPageComments,
    isLoading: isLoadingComments,
    isFetchingNextPage: isFetchingNextPageComments,
  } = useGetCommentsByPostId({
    limit: 10,
    postId: paramsIn.id,
  })

  const commentId = searchParamsIn.comment
  const router = useRouter()
  const { data, isLoading } = useGetPostById(paramsIn.id)

  // Скролл к комменту при открытии страницы
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
    likeCount,
    commentCount,
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
        likesCount={likeCount}
        commentsCount={commentCount}
        authorId={authorId}
        id={id}
        likedByUser={likedByUser}
        createdAt={createdAt}
        isFollowing={isFollowing}
      />
      <div className="mt-10">
        <CreateComment params={paramsIn} />
      </div>
      <div className="mt-10">
        <CommentList
          data={comments}
          isLoading={isLoadingComments}
          hasMore={hasNextPageComments}
          onLoadMore={fetchNextPageComments}
          isFetchingMore={isFetchingNextPageComments}
        />
      </div>
    </>
  )
}

export default CurrentPost
