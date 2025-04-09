'use client'
import { useCurrentUserQuery } from '@/store/services/user.api'
import Image from 'next/image'

function PreLoader() {
  const { isLoading } = useCurrentUserQuery()

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
