import { useGetAllPostsQuery } from '../../app/services/post.api'
import Card from '../../components/shared/Card'
import CardSkeleton from '../../components/ui/CardSkeleton'
import CreatePost from '../../components/shared/PostCreate'
import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PostList from '../../components/shared/PostList'
import OpenGraphMeta from '../../components/OpenGraphMeta'
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
      <div className="mb-10 w-full">
        <CreatePost />
      </div>
      <PostList data={data || []} isLoading={isLoading} />
    </>
  )
}

export default Posts
