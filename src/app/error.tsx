'use client' // Error boundaries must be Client Components
import { Button, Card } from '@heroui/react'
import { BiError } from 'react-icons/bi'
import { useRouter } from 'next/navigation'
import Header from '@/components/layout/Header'
import Container from '@/components/layout/Container'
import LayoutNavigation from '@/components/layout/LayoutNavigation'
import ProfileSidebar from '@/components/layout/ProfileSidebar'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()
  const reloadPage = () => {
    router.push('/')
  }

  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <>
      <Header />
      <Container className="flex-grow">
        <LayoutNavigation />
        <div className="flex-2 p-4 overflow-x-visible pb-20 lg:pb-4 h-full w-full">
          <div className="flex items-center justify-center">
            <Card className="p-8 text-center space-y-4">
              <BiError className="text-6xl text-danger mx-auto" />
              <h1 className="text-2xl font-bold text-danger">
                Упс! Что-то пошло не так
              </h1>
              <p className="text-default-500">Произошла неизвестная ошибка</p>
              <Button color="primary" onClick={reloadPage}>
                Вернуться на главную
              </Button>
            </Card>
          </div>
        </div>
        <ProfileSidebar />
      </Container>
    </>
  )
}
