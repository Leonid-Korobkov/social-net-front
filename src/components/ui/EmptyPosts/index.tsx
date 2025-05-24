import { TbUsers, TbMoodEmpty } from 'react-icons/tb'
import { motion } from 'framer-motion'
import { Button } from '@heroui/react'
import { useRouter } from 'next/navigation'
import { BsFilePost } from 'react-icons/bs'
import { useStore } from 'zustand'
import { UserSettingsStore } from '@/store/userSettings.store'

function EmptyPosts() {
  const router = useRouter()
  const currentUser = useStore(UserSettingsStore, state => state.current)
  const isOwnProfile = location.pathname.includes(currentUser?.userName || '')

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="text-center py-12 px-4"
    >
      <div className="relative flex flex-col items-center justify-center">
        <div className="absolute -top-6 -right-6">
          <motion.div
            initial={{ rotate: -10, scale: 0.8 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5, ease: 'easeOut' }}
          >
            <TbUsers size={40} className="text-primary-300" />
          </motion.div>
        </div>
        <div className="absolute -top-2 -left-4">
          <motion.div
            initial={{ rotate: 10, scale: 0.8 }}
            animate={{ rotate: 0, scale: 1 }}
            whileHover={{
              rotate: [0, -10, 10, -5, 5, 0],
              scale: 1.2,
              transition: { duration: 0.6 },
            }}
            transition={{ delay: 0.4, duration: 0.5, ease: 'easeOut' }}
            className="text-default-400 drop-shadow-md cursor-pointer"
          >
            <TbMoodEmpty size={30} />
          </motion.div>
        </div>
        <div className="w-24 h-24 mb-6 rounded-full bg-gradient-to-r from-primary-300 to-primary-500 flex items-center justify-center shadow-lg">
          <motion.div
            initial={{ scale: 0.5 }}
            animate={{ scale: [0.5, 1.2, 1] }}
            transition={{ delay: 0.3, duration: 0.6, ease: 'easeOut' }}
          >
            <BsFilePost size={60} className="text-white" />
          </motion.div>
        </div>
        <motion.h3
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-2xl font-bold mb-3"
        >
          {isOwnProfile ? 'У вас пока нет постов' : 'Постов пока нет'}
        </motion.h3>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="bg-content1 p-4 rounded-xl shadow-md max-w-md border border-default-200 mb-4"
        >
          <p className="text-lg">
            {isOwnProfile
              ? 'Создайте свой первый пост, чтобы начать делиться мыслями!'
              : 'Похоже, здесь пока нет ни одного поста.'}
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.5 }}
          className="mt-8"
        >
          {isOwnProfile ? (
            <Button
              color="primary"
              variant="shadow"
              fullWidth
              size="lg"
              className="font-medium"
              onClick={() => router.push('/create')}
            >
              Создать пост
            </Button>
          ) : (
            <Button
              color="primary"
              variant="shadow"
              fullWidth
              size="lg"
              className="font-medium"
              onClick={() => router.push('/search')}
            >
              Найти друзей
            </Button>
          )}
        </motion.div>
        {/* Декоративные круги в фоне */}
        <div className="absolute -z-10 top-0 right-0 w-48 h-48 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 opacity-30 blur-2xl" />
        <div className="absolute -z-10 bottom-0 left-0 w-40 h-40 rounded-full bg-gradient-to-tr from-secondary-100 to-secondary-200 opacity-30 blur-2xl" />
      </div>
    </motion.div>
  )
}

export default EmptyPosts
