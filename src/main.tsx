import React, { Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './app/store'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import ThemeProvider from './components/shared/ThemeProvider'
import Layout from './layout'
import ErrorPage from './pages/Error'
import { Spinner } from '@nextui-org/react'
import AuthGuard from './features/user/AuthGuard'

// Ленивая загрузка компонентов
const Auth = React.lazy(() => import('./pages/Auth'))
const Posts = React.lazy(() => import('./pages/Posts'))
const CurrentPost = React.lazy(() => import('./pages/CurrentPost'))
const UserProfile = React.lazy(() => import('./pages/UserProfile'))
const Followers = React.lazy(() => import('./pages/Followers'))
const Following = React.lazy(() => import('./pages/Following'))
const Search = React.lazy(() => import('./pages/Search'))

const LoadingFallback = () => (
  <div className="flex justify-center items-center h-screen">
    <Spinner size="lg" />
  </div>
)

const router = createBrowserRouter([
  {
    path: '/auth',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <Auth />
      </Suspense>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <Posts />
          </Suspense>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: 'search',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <Search />
          </Suspense>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: 'posts/:id',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <CurrentPost />
          </Suspense>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: 'users/:id',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <UserProfile />
          </Suspense>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: 'users/:id/followers',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <Followers />
          </Suspense>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: 'users/:id/following',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <Following />
          </Suspense>
        ),
        errorElement: <ErrorPage />,
      },
    ],
  },
])

const container = document.getElementById('root')

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
