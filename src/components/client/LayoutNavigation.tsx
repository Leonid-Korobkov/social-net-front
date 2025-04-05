'use client'
import { useDisclosure } from '@heroui/react'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import CreatePostModal from '@/components/shared/CreatePostModal'
import NavBar from '@/components/shared/NavBar'
import MobileNavBar from '@/components/shared/MobileNavBar'

export default function LayoutNavigation() {
  const pathname = usePathname()
  const router = useRouter()
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  useEffect(() => {
    if (pathname === '/create') {
      onOpen()
      router.back()
    }
  }, [pathname, onOpen, router])

  return (
    <>
      <div className="flex-2 p-4 lg:sticky lg:top-16 hidden lg:block">
        <NavBar onCreatePost={onOpen} />
      </div>
      <MobileNavBar onCreatePost={onOpen} />
      <CreatePostModal isOpen={isOpen} onOpenChange={onOpenChange} />
    </>
  )
}
