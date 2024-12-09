import { useGetAllPostsQuery } from '../../app/services/post.api'
import Card from '../../components/Card'
import CreatePost from '../../components/PostCreate'

function Posts() {
  const { data } = useGetAllPostsQuery()

  return (
    <>
      <div className="mb-10 w-full">
        <CreatePost />
      </div>
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
            <Card
              key={id}
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
            />
          ),
        )}
    </>
  )
}

export default Posts
