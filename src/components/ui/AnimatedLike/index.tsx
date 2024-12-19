import { FcDislike } from 'react-icons/fc'
import { MdOutlineFavoriteBorder } from 'react-icons/md'
import MetaInfo from '../MetaInfo'

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
        Icon={isLiked ? FcDislike : MdOutlineFavoriteBorder}
        isLiked={isLiked}
      />
    </div>
  )
}

export default AnimatedLike
