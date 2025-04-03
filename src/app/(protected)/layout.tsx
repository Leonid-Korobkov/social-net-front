'use client'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'
import { useDisclosure } from '@heroui/react'
import { selectIsAuthenticated } from '@/features/user/user.slice'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation'
import CreatePostModal from '@/components/shared/CreatePostModal'
import Header from '@/components/shared/Header'
import Container from '@/components/shared/Container'
import NavBar from '@/components/shared/NavBar'
import Profile from '@/components/shared/Profile'
import MobileNavBar from '@/components/shared/MobileNavBar'

function Layout({ children }: { children: React.ReactNode }) {
  const isAuth = useSelector(selectIsAuthenticated)
  const pathname = usePathname()
  const router = useRouter()
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  const isUserProfilePage = pathname.match(/^\/users\/[^/]+$/)
  useEffect(() => {
    if (!isAuth) {
      router.push('/auth')
    }
  }, [])

  useEffect(() => {
    if (pathname === '/create') {
      onOpen()
      router.back()
    }
  }, [pathname])

  return (
    <>
      <Header />
      <Container className="flex-grow">
        <div className="flex-2 p-4 lg:sticky lg:top-16 hidden lg:block">
          <NavBar onCreatePost={onOpen} />
        </div>
        {/* mb-40 lg:mb-4 */}
        <div className="flex-2 p-4 overflow-auto pb-20 lg:pb-4 h-full w-full">
          {children}
        </div>
        {!isUserProfilePage && (
          <div className="flex-2 p-4 lg:sticky lg:top-16 hidden lg:block">
            <div className="flex-col flex gap-5">
              <Profile />
            </div>
          </div>
        )}
      </Container>
      <MobileNavBar onCreatePost={onOpen} />
      <CreatePostModal isOpen={isOpen} onOpenChange={onOpenChange} />
    </>
  )
}

export default Layout
