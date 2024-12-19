// App.tsx or App.jsx
import type { NavigateOptions } from 'react-router-dom'

import {
  useNavigate,
  useHref,
  Routes,
  Route,
} from 'react-router-dom'
import { NextUIProvider } from '@nextui-org/system'

import Posts from './pages/Posts'

declare module '@react-types/shared' {
  interface RouterConfig {
    routerOptions: NavigateOptions
  }
}

function App() {
  const navigate = useNavigate()

  return (
    <NextUIProvider navigate={navigate} useHref={useHref}>
      <Routes>
        <Route path="/" element={<Posts />} />
      </Routes>
    </NextUIProvider>
  )
}

export default App
