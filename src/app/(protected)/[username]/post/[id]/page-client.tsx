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
import { useRouter } from 'next/navigation'
import { use, useEffect, useState } from 'react'
import CommentCreateRichModal from '@/components/shared/CommentCreate/CommentCreateRichModal'
import { Button } from '@heroui/react'

type PageProps = {
  params: { id: string; username: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

function CurrentPost({
  params: paramsIn,
  searchParams: searchParamsIn,
}: PageProps) {
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
  const [isModalOpen, setIsModalOpen] = useState(false)

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
            router.push(`/${paramsIn.username}/post/${paramsIn.id}`)
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
    viewCount,
    shareCount,
    media,
  } = data

  return (
    <>
      <GoBack />
      <Card
        cardFor="current-post"
        avatarUrl={author?.avatarUrl ?? ''}
        content={content}
        username={author?.userName ?? ''}
        likesCount={likeCount}
        commentsCount={commentCount}
        authorId={authorId}
        id={id}
        likedByUser={likedByUser}
        createdAt={createdAt}
        isFollowing={isFollowing}
        shareCount={shareCount}
        viewCount={viewCount}
        media={media}
      />
      <div className="mt-10">
        <Button color="primary" onClick={() => setIsModalOpen(true)}>
          Оставить комментарий
        </Button>
      </div>
      <CommentCreateRichModal
        isOpen={isModalOpen}
        onOpenChange={() => setIsModalOpen(false)}
        postId={id}
      />
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
