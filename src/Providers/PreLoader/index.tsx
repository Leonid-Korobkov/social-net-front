'use client'
import { useCurrentUserQuery } from '@/store/services/user.api'
import Image from 'next/image'
import { useEffect } from 'react'

function PreLoader() {
  const { isLoading } = useCurrentUserQuery()

  useEffect(() => {
    const html = document.documentElement
    html.classList.add('overflow-hidden')
    if (isLoading) {
      html.classList.add('overflow-hidden')
    } else {
      html.classList.remove('overflow-hidden')
    }
    return () => {
      html.classList.remove('overflow-hidden')
    }
  }, [isLoading])

  return (
    <>
      {isLoading && (
        <div className="flex items-center justify-center min-h-dvh flex-col absolute min-w-full bg-background z-[1000]">
          <Image
            src={'/Zling-logo-white.svg'}
            height={150}
            width={150}
            alt="Zling логотип"
            className="h-[100px] animate-spinner-ease-spin"
            priority
          />
        </div>
      )}
    </>
  )
}

export default PreLoader
