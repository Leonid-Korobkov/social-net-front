import {
  Outlet,
  useNavigate,
  useLocation,
  ScrollRestoration,
} from 'react-router-dom'
import Container from '../components/shared/Container'
import Header from '../components/shared/Header'
import NavBar from '../components/shared/NavBar'
import MobileNavBar from '../components/shared/MobileNavBar'
import { useSelector } from 'react-redux'
import { selectIsAuthenticated } from '../features/user/user.slice'
import { useEffect } from 'react'
import Profile from '../components/shared/Profile'
import CreatePostModal from '../components/shared/CreatePostModal'
import { useDisclosure } from "@heroui/react"

function Layout() {
  const isAuth = useSelector(selectIsAuthenticated)
  const location = useLocation()
  const navigate = useNavigate()
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  const isUserProfilePage = location.pathname.match(/^\/users\/[^/]+$/)

  useEffect(() => {
    if (!isAuth) {
      navigate('/auth')
    }
  }, [])

  useEffect(() => {
    if (location.pathname === '/create') {
      onOpen()
      navigate(-1)
    }
  }, [location.pathname])

  return (
    <>
      <ScrollRestoration
        getKey={(location, matches) => {
          return location.pathname
        }}
      />
      <Header />
      <Container className="flex-grow">
        <div className="flex-2 p-4 lg:sticky lg:top-16 hidden lg:block">
          <NavBar onCreatePost={onOpen} />
        </div>
        {/* mb-40 lg:mb-4 */}
        <div className="flex-2 p-4 overflow-auto pb-20 lg:pb-4 h-full w-full">
          <Outlet />
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
