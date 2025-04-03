'use client'
import PostList from '@/components/shared/PostList'
import { useGetAllPostsQuery } from '@/store/services/post.api'
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