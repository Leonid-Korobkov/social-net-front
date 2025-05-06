'use client'
import { useGetCurrentUser } from '@/services/api/user.api'
import { useUserStore } from '@/store/user.store'
import { UserSettingsStore } from '@/store/userSettings.store'
import Image from 'next/image'
import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

function PreLoader() {
  const { error } = useGetCurrentUser()
  const setError = useUserStore(state => state.setError)

  useEffect(() => {
    if (error && error.status !== 401) {
      setError(error.errorMessage)
    }
  }, [])

  // useEffect(() => {
  //   const html = document.documentElement
  //   if (isLoading) {
  //     html.style.overflow = 'hidden'
  //     document.body.style.overflow = 'hidden'
  //   } else {
  //     html.style.overflow = 'initial'
  //     document.body.style.overflow = 'initial'
  //   }
  //   return () => {
  //     html.style.overflow = 'initial'
  //     document.body.style.overflow = 'initial'
  //   }
  // }, [isLoading])

  return (
    <></>
    // <AnimatePresence>
    //   {isLoading && (
    //     <motion.div
    //       initial={{ opacity: 1, scale: 1 }}
    //       animate={{ opacity: 1, scale: 1 }}
    //       exit={{ opacity: 0, scale: 1.5 }}
    //       transition={{ duration: 0.5, ease: 'easeOut' }}
    //       className="flex items-center justify-center min-h-dvh flex-col absolute min-w-full bg-background z-[1000]"
    //     >
    //       <Image
    //         src={'/Zling-logo-white.svg'}
    //         height={150}
    //         width={150}
    //         alt="Zling логотип"
    //         className="h-[100px] animate-spinner-ease-spin"
    //         priority
    //       />
    //     </motion.div>
    //   )}
    // </AnimatePresence>
  )
}

export default PreLoader
