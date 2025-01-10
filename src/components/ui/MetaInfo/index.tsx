import { Spinner } from '@nextui-org/react'
import { IconType } from 'react-icons'
import { motion, AnimatePresence } from 'framer-motion'

interface IMetaInfo {
  count: number
  Icon: IconType | typeof Spinner
  classNameForIcon?: string
  isLiked?: boolean
}

function MetaInfo({ count, Icon, classNameForIcon, isLiked }: IMetaInfo) {
  return (
    <div className="flex items-center gap-2 cursor-pointer">
      <AnimatePresence mode="popLayout">
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
            transform: 'perspective(1000px)',
          }}
          className="select-none font-semibold text-default-400 text-l"
        >
          {count}
        </motion.p>
      </AnimatePresence>
      <div
        className={
          'text-default-400 text-xl transition hover:transform hover:scale-125 ease-in-out duration-300' +
          classNameForIcon
        }
      >
        <motion.div
          initial={false}
          animate={
            isLiked
              ? {
                  scale: [1, 1.4, 0.9, 1.1, 1],
                  rotate: [0, -20, 20, -20, 0],
                }
              : {
                  scale: 1,
                  rotate: 0,
                }
          }
          transition={{
            duration: 0.6,
            ease: [0.4, 0, 0.2, 1],
          }}
        >
          <Icon />
        </motion.div>
      </div>
    </div>
  )
}

export default MetaInfo
