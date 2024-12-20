import { useGetAllPostsQuery } from '../../app/services/post.api'
import Card from '../../components/shared/Card'
import CardSkeleton from '../../components/ui/CardSkeleton'
import CreatePost from '../../components/shared/PostCreate'
import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PostList from '../../components/shared/PostList'

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
      <PostList
        data={data || []}
        isLoading={isLoading}
        handleCardClick={handleCardClick}
      />
    </>
  )
}

export default Posts
