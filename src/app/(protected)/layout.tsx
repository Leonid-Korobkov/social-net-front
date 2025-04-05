import Header from '@/components/shared/Header'
import Container from '@/components/shared/Container'
import LayoutNavigation from '@/components/client/LayoutNavigation'
import ProfileSidebar from '@/components/client/ProfileSidebar'

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <Container className="flex-grow">
        <LayoutNavigation />
        <div className="flex-2 p-4 overflow-auto pb-20 lg:pb-4 h-full w-full">
          {children}
        </div>
        <ProfileSidebar />
      </Container>
    </>
  )
}

export default Layout
