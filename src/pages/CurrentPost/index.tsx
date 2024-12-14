import { useParams } from 'react-router-dom'
import { useGetPostByIdQuery } from '../../app/services/post.api'
import Card from '../../components/Card'
import GoBack from '../../components/GoBack'
import CreateComment from '../../components/CommentCreate'
import CardSkeleton from '../../components/CardSkeleton'
import CreateCommentSkeleton from '../../components/CommentCreateSkeleton'
import CardCommentSkeleton from '../../components/CardCommentSkeleton'
function CurrentPost() {
  const params = useParams<{ id: string }>()
  const { data, isLoading } = useGetPostByIdQuery(params?.id ?? '')

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
      />
      <div className="mt-10">
        <CreateComment />
      </div>
      <div className="mt-10">
        {data.comments
          ? data.comments.map(comment => (
              <Card
                cardFor="comment"
                key={comment.id}
                avatarUrl={comment.User?.avatarUrl ?? ''}
                content={comment.content}
                name={comment.User?.name ?? ''}
                authorId={comment.userId ?? ''}
                commentId={comment.id}
                id={id}
              />
            ))
          : null}
      </div>
    </>
  )
}

export default CurrentPost
