import { useGetAllPostsQuery } from '../../app/services/post.api'
import Card from '../../components/shared/Card'
import CardSkeleton from '../../components/ui/CardSkeleton'
import CreatePost from '../../components/shared/PostCreate'
import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PostList from '../../components/shared/PostList'

function Posts() {
  const { data, isLoading } = useGetAllPostsQuery()

  return (
    <>
      <div className="mb-10 w-full">
        <CreatePost />
      </div>
      <PostList data={data || []} isLoading={isLoading} />
    </>
  )
}

export default Posts
