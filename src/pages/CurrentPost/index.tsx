import { useParams } from 'react-router-dom'
import { useGetPostByIdQuery } from '../../app/services/post.api'
import Card from '../../components/shared/Card'
import GoBack from '../../components/shared/GoBack'
import CreateComment from '../../components/shared/CommentCreate'
import CardSkeleton from '../../components/ui/CardSkeleton'
import CreateCommentSkeleton from '../../components/ui/CommentCreateSkeleton'
import CardCommentSkeleton from '../../components/ui/CardCommentSkeleton'
import { AnimatePresence, motion } from 'framer-motion'
import OpenGraphMeta from '../../components/shared/OpenGraphMeta'
import { APP_URL, BASE_URL } from '../../constants'

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
      <OpenGraphMeta
        title={author?.name ?? 'Пост'}
        description={content.slice(0, 20)}
        url={`${APP_URL}/posts/${id}`}
        image={author?.avatarUrl ?? ''}
        siteName="Zling"
        type="article"
      />
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
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, bounce: 0 }}
                    layout="position"
                  >
                    <Card
                      cardFor="comment"
                      avatarUrl={comment.User?.avatarUrl ?? ''}
                      content={comment.content}
                      name={comment.User?.name ?? ''}
                      authorId={comment.userId ?? ''}
                      commentId={comment.id}
                      id={id}
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
