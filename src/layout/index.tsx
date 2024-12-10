import { Outlet, useNavigate } from 'react-router-dom'
import Container from '../components/Container'
import Header from '../components/Header'
import NavBar from '../components/NavBar'
// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import { useSelector } from 'react-redux'
import { selectIsAuthenticated, selectUser } from '../features/user/user.slice'
import { useEffect } from 'react'
import Profile from '../components/Profile'

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
      <Header />
      <Container>
        <div className="flex-2 p-4 sticky top-16">
          <NavBar />
        </div>
        <div className="flex-2 p-4 overflow-auto">
          <Outlet />
        </div>
        {!user && (
          <div className="flex-2 p-4 sticky top-16">
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
