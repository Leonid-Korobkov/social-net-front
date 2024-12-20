import { Outlet, useNavigate } from 'react-router-dom'
import Container from '../components/shared/Container'
import Header from '../components/shared/Header'
import NavBar from '../components/shared/NavBar'
import MobileNavBar from '../components/shared/MobileNavBar'
import { useSelector } from 'react-redux'
import { selectIsAuthenticated, selectUser } from '../features/user/user.slice'
import { useEffect } from 'react'
import Profile from '../components/shared/Profile'

function Layout() {
  const isAuth = useSelector(selectIsAuthenticated)
  const user = useSelector(selectUser)
  const loading = useSelector((state: any) => state.auth.loading)
  const navigate = useNavigate()
  console.log(loading)


  useEffect(() => {
    if (!isAuth) {
      navigate('/auth')
    }
  }, [])

  return (
    <>
      <Header />
      <Container>
        <div className="flex-2 p-4 lg:sticky lg:top-16 hidden lg:block">
          <NavBar />
        </div>
        <div className="flex-2 p-4 overflow-auto flex-grow pb-20 lg:pb-4">
          <Outlet />
        </div>
        {user === null && !loading && (
          <div className="flex-2 p-4 lg:sticky lg:top-16 hidden lg:block">
            <div className="flex-col flex gap-5">
              <Profile />
            </div>
          </div>
        )}
      </Container>
      <MobileNavBar />
    </>
  )
}

export default Layout
