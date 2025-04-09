'use client'

import { Image } from '@heroui/image'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export default function Logo(){
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <Image
      src={
        resolvedTheme === 'dark'
          ? '/Zling-logo-white.svg'
          : '/Zling-logo-black.svg'
      }
      height={60}
      alt="Zling логотип"
    />
  )
}
