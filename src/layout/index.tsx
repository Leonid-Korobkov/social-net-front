import { Outlet, useNavigate } from 'react-router-dom'
import Container from '../components/shared/Container'
import Header from '../components/shared/Header'
import NavBar from '../components/shared/NavBar'
// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import { useSelector } from 'react-redux'
import { selectIsAuthenticated, selectUser } from '../features/user/user.slice'
import { useEffect } from 'react'
import Profile from '../components/shared/Profile'

function Layout() {
  const isAuth = useSelector(selectIsAuthenticated)
  const user = useSelector(selectUser)

  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuth) {
      navigate('/auth')
    }
  }, [])

  return (
    <>
      {/* <ScrollRestoration /> */}
      <Header />
      <Container>
        <div className="flex-2 p-4 lg:sticky lg:top-16 hidden lg:block">
          <NavBar />
        </div>
        <div className="flex-2 p-4 overflow-auto flex-grow">
          <Outlet />
        </div>
        {!user && (
          <div className="flex-2 p-4 lg:sticky lg:top-16 hidden lg:block">
            <div className="flex-col flex gap-5">
              <Profile />
            </div>
          </div>
        )}
      </Container>
    </>
  )
}

export default Layout
