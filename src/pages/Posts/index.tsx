import { useGetAllPostsQuery } from '../../app/services/post.api'
import PostList from '../../components/shared/PostList'
import OpenGraphMeta from '../../components/shared/OpenGraphMeta'
import { APP_URL } from '../../constants'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  addPosts,
  selectPosts,
  setPage,
  selectPostsPage,
} from '../../features/posts/posts.slice'

function Posts() {
  const dispatch = useDispatch()
  const page = useSelector(selectPostsPage)
  const allPosts = useSelector(selectPosts)

  const { data, isLoading, isFetching } = useGetAllPostsQuery({
    page,
    limit: 5,
  })

  useEffect(() => {
    if (data?.posts) {
      // Фильтруем дубликаты по id
      const newPosts = data.posts.filter(
        newPost =>
          !allPosts.some(existingPost => existingPost.id === newPost.id),
      )

      if (newPosts.length > 0) {
        dispatch(addPosts(newPosts))
      }
    }
  }, [data?.posts, dispatch])

  const handleLoadMore = () => {
    dispatch(setPage(page + 1))
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
      {/* TODO: оптимизировать посты и лайки
      search: rtk query как сделать бесконечный скролл
      https://medium.com/@ngure1/building-and-using-a-custom-infinite-scroll-hook-in-react-with-rtk-query-7e210850d3b5
      https://stackoverflow.com/questions/72530121/rtk-query-infinite-scrolling-retaining-existing-data
      https://codesandbox.io/p/sandbox/react-rtk-query-inifinite-scroll-8kj9bh?file=%2Fsrc%2FApp.js
      */}
      <PostList
        data={allPosts}
        isLoading={isLoading}
        hasMore={data?.hasMore}
        onLoadMore={handleLoadMore}
        isFetchingMore={isFetching && !isLoading}
      />
    </>
  )
}

export default Posts
