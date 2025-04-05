'use client'
import { Button, Card } from '@heroui/react'
import { BiError } from 'react-icons/bi'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { RiEmotionSadLine } from 'react-icons/ri'
import GoBack from '@/components/shared/GoBack'

function ErrorPage() {
  const router = useRouter()
  // Сделайть перезагрузку страницы
  const reloadPage = () => {
    router.push('/')
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center min-h-[60vh] p-4"
      >
        <RiEmotionSadLine className="w-32 h-32 text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-700 mb-2">
          Упс! Пользователь не найден
        </h2>
        <p className="text-gray-500 text-center max-w-md mb-4">
          Возможно, пользователь был удален или указан неверный идентификатор
        </p>
        <GoBack />
      </motion.div>
    </>
  )
}

export default ErrorPage
