import { TbUsers, TbAward, TbConfetti, TbCheck } from 'react-icons/tb'
import Confetti from 'react-confetti'
import { motion } from 'framer-motion'
import { useWindowSize } from '@/hooks/useWindowSize'
import { useState } from 'react'
import { UserSettingsStore } from '@/store/userSettings.store'
import { Button } from '@heroui/react'

function ViewedAllPosts() {
  const [showConfetti, setShowConfetti] = useState(false)
  const size = useWindowSize()

  return (
    <>
      <Confetti
        width={size.width}
        height={size.height}
        recycle={false}
        run={showConfetti}
        onConfettiComplete={confetti => {
          if (confetti) {
            confetti.reset()
          }
        }}
      />
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="text-center py-12 px-4"
        onAnimationComplete={() => {
          // Запускаем конфетти после завершения анимации появления контента
          setTimeout(() => setShowConfetti(true), 800)
        }}
      >
        <div className="relative inline-flex flex-col items-center justify-center">
          <div className="absolute -top-6 -right-6">
            <motion.div
              initial={{ rotate: -20, scale: 0.8 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5, ease: 'easeOut' }}
            >
              <TbConfetti size={40} className="text-primary-500" />
            </motion.div>
          </div>

          {/* Интерактивная звезда */}
          <div className="absolute -top-2 -left-4">
            <motion.div
              initial={{ rotate: 15, scale: 0.8 }}
              animate={{ rotate: 0, scale: 1 }}
              whileHover={{
                rotate: [0, -10, 10, -5, 5, 0],
                scale: 1.2,
                transition: { duration: 0.6 },
              }}
              transition={{ delay: 0.4, duration: 0.5, ease: 'easeOut' }}
              className="text-yellow-400 drop-shadow-md cursor-pointer"
            >
              <svg
                width="30"
                height="30"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
            </motion.div>
          </div>

          <div className="w-24 h-24 mb-6 rounded-full bg-gradient-to-r from-primary-300 to-primary-500 flex items-center justify-center shadow-lg">
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: [0.5, 1.2, 1] }}
              transition={{ delay: 0.3, duration: 0.6, ease: 'easeOut' }}
            >
              <TbAward size={60} className="text-white" />
            </motion.div>
          </div>

          <motion.h3
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-2xl font-bold mb-3"
          >
            Поздравляем!
          </motion.h3>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="bg-content1 p-4 rounded-xl shadow-md max-w-md border border-default-200 mb-4"
          >
            <p className="text-lg">Вы просмотрели все посты</p>

            {/* Счётчик просмотренных постов */}
            <div className="flex flex-col items-center mt-4 mb-1">
              <div className="flex items-center justify-center gap-2 font-mono">
                <div className="text-sm text-default-400">Просмотрено:</div>
                <motion.div
                  className="font-bold text-lg text-primary"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.9, duration: 0.3 }}
                >
                  {UserSettingsStore.getState().viewedPosts.length}
                </motion.div>
                <div className="text-sm text-default-400">постов</div>
              </div>

              {/* Индикатор прогресса */}
              <div className="w-full mt-2 bg-default-100 rounded-full h-1.5 overflow-hidden">
                <motion.div
                  className="bg-primary h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ delay: 1, duration: 1, ease: 'easeOut' }}
                />
              </div>
            </div>

            <div className="mt-2 text-success flex items-center justify-center gap-1">
              <TbCheck /> Достижение разблокировано
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="text-sm text-default-400"
          >
            Загляните позже или подпишитесь на новых пользователей
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.5 }}
            className="mt-8"
          >
            <Button
              color="primary"
              variant="shadow"
              size="lg"
              className="font-medium"
              startContent={<TbUsers className="text-xl" />}
              onClick={() => (window.location.href = '/search')}
            >
              Найти новых пользователей
            </Button>
          </motion.div>

          {/* Декоративные круги в фоне */}
          <div className="absolute -z-10 -top-10 -right-24 w-48 h-48 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 opacity-30 blur-2xl" />
          <div className="absolute -z-10 -bottom-10 -left-20 w-40 h-40 rounded-full bg-gradient-to-tr from-secondary-100 to-secondary-200 opacity-30 blur-2xl" />
        </div>
      </motion.div>
    </>
  )
}

export default ViewedAllPosts
