'use client'
import { Spinner } from '@heroui/react'
import { IconType } from 'react-icons'
import { motion, AnimatePresence } from 'framer-motion'
import { FaHeart, FaRegHeart } from 'react-icons/fa6'
import { UserSettingsStore } from '@/store/userSettings.store'

interface IMetaInfo {
  count: number
  Icon?: IconType | typeof Spinner
  className?: string
  classNameForIcon?: string
  isLiked?: boolean
  size?: 'small' | 'normal'
}

function MetaInfo({ count, Icon, classNameForIcon, isLiked, className = '', size = 'normal' }: IMetaInfo) {
  const reduce = UserSettingsStore.getState().reduceAnimation

  return (
    <div className={`flex items-center gap-1.5 cursor-pointer group px-2 py-1 rounded-xl transition-colors hover:bg-default-100 ${className}`}>
      <div
        className={
          'text-xl transition-colors ' +
          (isLiked ? 'text-danger' : 'text-default-400') +
          ' ' +
          classNameForIcon
        }
      >
        {Icon ? <Icon /> : isLiked ? <FaHeart /> : <FaRegHeart />}
      </div>
      {reduce ? (
        <span className="select-none font-semibold text-default-400 text-l">
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
            className="select-none font-semibold text-default-400 text-l"
          >
            {count}
          </motion.p>
        </AnimatePresence>
      )}
    </div>
  )
}

export default MetaInfo
