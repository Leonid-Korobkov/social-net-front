'use client'
import { FcDislike } from 'react-icons/fc'
import { MdOutlineFavoriteBorder } from 'react-icons/md'
import MetaInfo from '../MetaInfo'
import { FaRegHeart } from 'react-icons/fa6'

interface AnimatedLikeProps {
  isLiked: boolean
  count: number
  onClick: () => void
}

function AnimatedLike({ isLiked, count, onClick }: AnimatedLikeProps) {
  return (
    <div className="flex items-center gap-2 cursor-pointer" onClick={onClick}>
      <MetaInfo
        count={count}
        isLiked={isLiked}
      />
    </div>
  )
}

export default AnimatedLike
