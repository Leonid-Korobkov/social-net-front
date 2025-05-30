import Header from '@/components/layout/Header'
import Container from '@/components/layout/Container'
import LayoutNavigation from '@/components/layout/LayoutNavigation'
import ProfileSidebar from '@/components/layout/ProfileSidebar'

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <Container className="flex-grow">
        <LayoutNavigation />
        <div className="flex-2 p-4 overflow-x-visible pb-20 lg:pb-4 h-full w-full">
          {children}
        </div>
        <ProfileSidebar />
      </Container>
    </>
  )
}

export default Layout
