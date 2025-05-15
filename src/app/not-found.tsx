'use client'
import { Button, Card } from '@heroui/react'
import { BiError } from 'react-icons/bi'
import { useRouter } from 'next/navigation'

function ErrorPage() {
  const router = useRouter()
  const reloadPage = () => {
    router.push('/')
  }

  return (
    <>
      <div className="flex items-center justify-center min-h-dvh">
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
    </>
  )
}

export default ErrorPage
