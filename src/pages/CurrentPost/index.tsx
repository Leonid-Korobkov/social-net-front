import { useParams } from 'react-router-dom'
import { useGetPostByIdQuery } from '../../app/services/post.api'
import Card from '../../components/Card'
import GoBack from '../../components/GoBack'
import CreateComment from '../../components/CommentCreate'
import { Spinner } from '@nextui-org/react'

function CurrentPost() {
  const params = useParams<{ id: string }>()
  const { data, refetch, isLoading } = useGetPostByIdQuery(params?.id ?? '')

  if (isLoading) return <Spinner size="lg" color="primary" />
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
        refetch={refetch}
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
                refetch={refetch}
              />
            ))
          : null}
      </div>
    </>
  )
}

export default CurrentPost
