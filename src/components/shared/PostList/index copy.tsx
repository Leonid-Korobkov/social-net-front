// import { AnimatePresence, motion } from 'framer-motion'
// import CardSkeleton from '../../ui/CardSkeleton'
// import Card from '../Card'
// import { useEffect, useRef, useState } from 'react'
// import { Spinner } from '@heroui/react'
// import { useInView } from 'react-intersection-observer'
// import { Post } from '@/store/types'

// interface PostListProps {
//   data: Post[]
//   isLoading: boolean
//   handleCardClick?: () => void
//   className?: string
//   hasMore?: boolean
//   onLoadMore?: () => void
//   isFetchingMore?: boolean
// }

// function PostList({
//   data,
//   isLoading,
//   handleCardClick,
//   className,
//   hasMore,
//   onLoadMore,
//   isFetchingMore,
// }: PostListProps) {
//   const { ref: loadMoreRef, inView } = useInView({
//     threshold: 0,
//   })

//   useEffect(() => {
//     if (inView && !isLoading && !isFetchingMore && hasMore && onLoadMore) {
//       onLoadMore()
//     }
//   }, [inView, isLoading, isFetchingMore, hasMore])

//   if (isLoading && !data.length) {
//     return (
//       <div>
//         {Array.from({ length: 5 }).map((_, index) => (
//           <CardSkeleton key={index} />
//         ))}
//       </div>
//     )
//   }

//   return (
//     <div className={className}>
//       <AnimatePresence mode="popLayout">
//         {data.map(post => (
//           <motion.div
//             key={post.id}
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             transition={{ duration: 0.3 }}
//             className="mb-4"
//           >
//             <Card
//               id={post.id}
//               authorId={post.authorId}
//               avatarUrl={post.author.avatarUrl || ''}
//               cardFor={'post'}
//               content={post.content}
//               name={post.author.name || ''}
//               likedByUser={post.likedByUser}
//               commentsCount={post.comments.length}
//               createdAt={post.createdAt}
//               likesCount={post.likes.length}
//               isFollowing={post.isFollowing}
//               likes={post.likes}
//               onClick={handleCardClick}
//             />
//           </motion.div>
//         ))}
//       </AnimatePresence>
//       {(hasMore || isFetchingMore) && (
//         <div ref={loadMoreRef} className="py-4 flex justify-center">
//           {isFetchingMore ? (
//             <Spinner size="lg" />
//           ) : (
//             hasMore && <div className="h-20" />
//           )}
//         </div>
//       )}
//     </div>
//   )
// }

// export default PostList
