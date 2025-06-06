'use client'
import { useShare } from '@/hooks/useShare'
import { UserSettingsStore } from '@/store/userSettings.store'
import { Spinner } from '@heroui/react'
import { AnimatePresence, motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { IconType } from 'react-icons'
import { FaHeart, FaRegHeart } from 'react-icons/fa6'

interface IMetaInfo {
  username?: string
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
  username = '',
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
  const [prevCount, setPrevCount] = useState(count)

  const iconSizeClass = size === 'small' ? 'text-sm' : 'text-xl'
  const textSizeClass = size === 'small' ? 'text-xs' : 'text-l'

  const countStr = count.toString()
  const prevCountStr = prevCount.toString()
  const staticPart = countStr.slice(0, -1)
  const animatedDigit = countStr.slice(-1)

  useEffect(() => {
    setPrevCount(count)
  }, [count])

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
          username,
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
          <Spinner size="sm" color="primary" variant="gradient" />
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
        <div
          className={`select-none font-semibold text-default-400 ${textSizeClass} flex items-center`}
        >
          {staticPart}
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={animatedDigit}
              initial={{
                opacity: 0,
                y: !isLiked ? 20 : -20,
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
                y: !isLiked ? -20 : 20,
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
            >
              {animatedDigit}
            </motion.span>
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}

export default MetaInfo
