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
      {count > 0 && (
        <AnimatePresence mode="popLayout">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="select-none font-semibold text-default-400 text-l"
          >
            {count}
          </motion.div>
        </AnimatePresence>
      )}
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
                  scale: [1, 1.2, 0.95, 1],
                  rotate: [0, -15, 15, 0],
                }
              : {
                  scale: 1,
                  rotate: 0,
                }
          }
          transition={{
            duration: 0.5,
            ease: 'easeInOut',
          }}
        >
          <Icon />
        </motion.div>
      </div>
    </div>
  )
}

export default MetaInfo
