import { useGetAllPostsQuery } from '../../app/services/post.api'
import PostList from '../../components/shared/PostList'
import OpenGraphMeta from '../../components/shared/OpenGraphMeta'
import { APP_URL } from '../../constants'
import { useState } from 'react'

function Posts() {
  const [page, setPage] = useState(1)
  const { data, isLoading, isFetching } = useGetAllPostsQuery({
    page,
    limit: 5,
  })

  const handleLoadMore = () => {
    setPage(prev => prev + 1)
  }

  return (
    <>
      <OpenGraphMeta
        title="Лента | Zling"
        description="Смотрите последние посты пользователей в Zling"
        url={`${APP_URL}/posts`}
        image=""
        siteName="Zling"
        type="website"
      />
      <PostList
        data={data?.posts ?? []}
        isLoading={isLoading}
        hasMore={data?.hasMore}
        onLoadMore={handleLoadMore}
        isFetchingMore={isFetching && !isLoading}
      />
    </>
  )
}

export default Posts
