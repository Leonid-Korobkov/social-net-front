'use client'
import { Spinner } from '@heroui/react'
import { IconType } from 'react-icons'
import { motion, AnimatePresence } from 'framer-motion'
import { FaHeart, FaRegHeart } from 'react-icons/fa6'
import { UserSettingsStore } from '@/store/userSettings.store'
import { toast } from 'react-hot-toast'
import { useEffect, useState } from 'react'
import { APP_URL } from '@/app/constants'

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
  const [canNativeShare, setCanNativeShare] = useState(false)

  useEffect(() => {
    // Проверяем поддержку Web Share API
    setCanNativeShare('share' in navigator)
  }, [])

  const iconSizeClass = size === 'small' ? 'text-sm' : 'text-xl'
  const textSizeClass = size === 'small' ? 'text-xs' : 'text-l'

  const handleClick = async () => {
    if (onClick) {
      onClick()
      return
    }

    if (postId && canNativeShare) {
      const shareUrl = `${APP_URL}/posts/${postId}`

      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        })

        if (onShare) {
          onShare()
        }

        toast.success('Ссылка успешно отправлена')
      } catch (error) {
        // Пользователь отменил шаринг или произошла ошибка
        const err = error as Error
        if (err.name !== 'AbortError') {
          toast.error('Не удалось поделиться ссылкой')
          console.error('Ошибка при шаринге:', err)
        }
      }
    } else if (postId) {
      // Fallback для браузеров без поддержки Web Share API
      const shareUrl = `${APP_URL}/posts/${postId}`
      navigator.clipboard
        .writeText(shareUrl)
        .then(() => {
          if (onShare) {
            onShare()
          }
          toast.success('Ссылка скопирована в буфер обмена')
        })
        .catch(() => {
          toast.error('Не удалось скопировать ссылку')
        })
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
        {Icon ? <Icon /> : isLiked ? <FaHeart /> : <FaRegHeart />}
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
