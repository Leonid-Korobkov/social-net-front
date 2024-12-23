import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './app/store'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import ThemeProvider from './components/shared/ThemeProvider'
import Auth from './pages/Auth'
import Layout from './layout'
import Posts from './pages/Posts'
import CurrentPost from './pages/CurrentPost'
import UserProfile from './pages/UserProfile'
import Followers from './pages/Followers'
import Following from './pages/Following'
import Search from './pages/Search'
import AuthGuard from './features/user/AuthGuard'
import ErrorPage from './pages/Error'

const container = document.getElementById('root')

const router = createBrowserRouter([
  {
    path: '/auth',
    element: <Auth />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '',
        element: <Posts />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'search',
        element: <Search />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'posts/:id',
        element: <CurrentPost />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'users/:id',
        element: <UserProfile />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'followers',
        element: <Followers />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'following',
        element: <Following />,
        errorElement: <ErrorPage />,
      },
    ],
  },
])

if (container) {
  const root = createRoot(container)

  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <ThemeProvider>
          <AuthGuard>
            <RouterProvider router={router} />
          </AuthGuard>
        </ThemeProvider>
      </Provider>
    </React.StrictMode>,
  )
} else {
  throw new Error(
    "Root element with ID 'root' was not found in the document. Ensure there is a corresponding HTML element with the ID 'root' in your HTML file.",
  )
}
