import { useGetAllPostsQuery } from '../../app/services/post.api'
import Card from '../../components/Card'
import CardSkeleton from '../../components/CardSkeleton'
import CreatePost from '../../components/PostCreate'
import { Link } from 'react-router-dom'
import { useEffect } from 'react'

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
        data &&
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
        )
      )}
    </>
  )
}

export default Posts
