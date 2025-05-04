import Header from '@/components/layout/Header'
import Container from '@/components/layout/Container'
import LayoutNavigation from '@/components/layout/LayoutNavigation'
import ProfileSidebar from '@/components/layout/ProfileSidebar'
import ProtectedRoute from '@/components/layout/ProtectedRoute'

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <Header />
      <Container className="flex-grow">
        <LayoutNavigation />
        <div className="flex-2 p-4 overflow-auto pb-20 lg:pb-4 h-full w-full">
          {children}
        </div>
        <ProfileSidebar />
      </Container>
    </ProtectedRoute>
  )
}

export default Layout
