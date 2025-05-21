'use client'
import PostList from '@/components/shared/PostList'
import { FeedType, useGetFeed } from '@/services/api/post.api'
import { useState } from 'react'

function PostsClient() {
  const [feedType, setFeedType] = useState<FeedType>('for-you')
  const [sort, setSort] = useState<string>('newest')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const {
    data: data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
  } = useGetFeed({
    limit: 10,
    feedType,
    sort,
    sortOrder,
  })

  const handleLoadMore = () => {
    fetchNextPage()
  }

  const handleFeedTypeChange = (newFeedType: FeedType) => {
    setFeedType(newFeedType)
    // Сбрасываем сортировку на дефолтную при смене типа ленты
    if (newFeedType === 'viewed') {
      setSort('viewed_newest')
      setSortOrder('desc') // Дефолтное направление для viewed_newest
    } else {
      setSort('newest')
      setSortOrder('desc') // Дефолтное направление для остальных
    }
  }

  const handleSortChange = (newSort: string) => {
    setSort(newSort)
    // Сброс направления по умолчанию для likes/views
    if (newSort === 'likes' || newSort === 'views') {
      setSortOrder('desc')
    } else {
      setSortOrder('desc')
    }
  }

  const handleSortOrderToggle = () => {
    setSortOrder(prev => (prev === 'desc' ? 'asc' : 'desc'))
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
      sort={sort}
      onSortChange={handleSortChange}
      sortOrder={sortOrder}
      onSortOrderToggle={handleSortOrderToggle}
    />
  )
}

export default PostsClient
