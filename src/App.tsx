// App.tsx or App.jsx
import type { NavigateOptions } from 'react-router-dom'

import {
  useNavigate,
  useHref,
  Routes,
  Route,
} from 'react-router-dom'
import { HeroUIProvider } from "@heroui/system"

import Posts from './pages/Posts'

declare module '@react-types/shared' {
  interface RouterConfig {
    routerOptions: NavigateOptions
  }
}

function App() {
  const navigate = useNavigate()

  return (
    <HeroUIProvider navigate={navigate} useHref={useHref}>
      <Routes>
        <Route path="/" element={<Posts />} />
      </Routes>
    </HeroUIProvider>
  )
}

export default App
