'use client'
import { useShare } from '@/hooks/useShare'
import { UserSettingsStore } from '@/store/userSettings.store'
import { Spinner } from '@heroui/react'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { IconType } from 'react-icons'
import { FaHeart, FaRegHeart } from 'react-icons/fa6'

interface IMetaInfo {
  count: number
  Icon?: IconType | typeof Spinner
  className?: string
  classNameForIcon?: string
  isLiked?: boolean
  size?: 'small' | 'normal'
  onClick?: () => void
  postId?: string
  shareTitle?: string
  shareText?: string
  onShare?: () => void
}

function MetaInfo({
  count,
  Icon,
  classNameForIcon,
  isLiked,
  className = '',
  size = 'normal',
  onClick,
  postId,
  shareTitle = 'Zling',
  shareText = 'Интересный пост в соцсети Zling',
  onShare,
}: IMetaInfo) {
  const reduce = UserSettingsStore.getState().reduceAnimation
  const { handleShare, isSharing } = useShare()
  const [isLoading, setIsLoading] = useState(false)

  const iconSizeClass = size === 'small' ? 'text-sm' : 'text-xl'
  const textSizeClass = size === 'small' ? 'text-xs' : 'text-l'

  const handleClick = async () => {
    if (onClick) {
      onClick()
      return
    }

    if (isLoading) return

    if (postId) {
      setIsLoading(true)
      try {
        await handleShare({
          postId,
          title: shareTitle,
          text: shareText,
        })

        if (onShare) {
          onShare()
        }
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <div
      className={`flex items-center gap-1.5 cursor-pointer group px-2 py-1 rounded-xl transition-colors hover:bg-default-100 ${className}`}
      onClick={handleClick}
    >
      <div
        className={
          `${iconSizeClass} transition-colors ` +
          (isLiked ? 'text-danger' : 'text-default-400') +
          ' ' +
          classNameForIcon
        }
      >
        {isLoading || isSharing ? (
          <Spinner size="sm" color='secondary' variant='gradient'/>
        ) : Icon ? (
          <Icon />
        ) : isLiked ? (
          <FaHeart />
        ) : (
          <FaRegHeart />
        )}
      </div>
      {reduce ? (
        <span
          className={`select-none font-semibold text-default-400 ${textSizeClass}`}
        >
          {count}
        </span>
      ) : (
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.p
            key={count}
            initial={{
              opacity: 0,
              y: -20,
              filter: 'blur(8px)',
              scale: 1.2,
            }}
            animate={{
              opacity: 1,
              y: 0,
              filter: 'blur(0px)',
              scale: 1,
              transition: {
                duration: 0.4,
                type: 'spring',
                damping: 15,
                stiffness: 200,
              },
            }}
            exit={{
              opacity: 0,
              y: 20,
              filter: 'blur(8px)',
              scale: 0.8,
              transition: {
                duration: 0.3,
              },
            }}
            style={{
              backfaceVisibility: 'hidden',
              transform: 'perspective(100px)',
            }}
            className={`select-none font-semibold text-default-400 ${textSizeClass}`}
          >
            {count}
          </motion.p>
        </AnimatePresence>
      )}
    </div>
  )
}

export default MetaInfo
