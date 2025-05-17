'use client'
import PostList from '@/components/shared/PostList'
import { FeedType, useGetFeed } from '@/services/api/post.api'
import { useState } from 'react'

function PostsClient() {
  const [feedType, setFeedType] = useState<FeedType>('for-you')

  const {
    data: data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
  } = useGetFeed({
    limit: 10,
    feedType,
  })

  const handleLoadMore = () => {
    fetchNextPage()
  }

  const handleFeedTypeChange = (newFeedType: FeedType) => {
    setFeedType(newFeedType)
  }

  return (
    <PostList
      data={data?.data ?? []}
      isLoading={isLoading}
      hasMore={hasNextPage}
      onLoadMore={handleLoadMore}
      isFetchingMore={isFetchingNextPage && !isLoading}
      currentFeedType={feedType}
      onFeedTypeChange={handleFeedTypeChange}
      allViewed={data?.allViewed}
    />
  )
}

export default PostsClient
