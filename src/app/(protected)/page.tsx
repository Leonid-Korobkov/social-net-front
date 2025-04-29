'use client'
import PostList from '@/components/shared/PostList'
import { useGetAllPosts } from '@/services/api/post.api'

function Posts() {
  const {
    data: data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
  } = useGetAllPosts({
    limit: 5,
  })

  const handleLoadMore = () => {
    fetchNextPage()
  }

  return (
    <>
      <PostList
        data={data ?? []}
        isLoading={isLoading}
        hasMore={hasNextPage}
        onLoadMore={handleLoadMore}
        isFetchingMore={isFetchingNextPage && !isLoading}
      />
    </>
  )
}

export default Posts
