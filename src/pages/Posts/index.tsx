import { useGetAllPostsQuery } from '../../app/services/post.api'
import CreatePost from '../../components/shared/PostCreate'
import PostList from '../../components/shared/PostList'
import OpenGraphMeta from '../../components/shared/OpenGraphMeta'
import { APP_URL } from '../../constants'

function Posts() {
  const { data, isLoading } = useGetAllPostsQuery()

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
      <PostList data={data || []} isLoading={isLoading} />
    </>
  )
}

export default Posts
