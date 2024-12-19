import { useRouteError } from 'react-router-dom'
import { Button, Card } from '@nextui-org/react'
import { BiError } from 'react-icons/bi'

function ErrorPage() {
  const error = useRouteError() as { statusText?: string; message?: string }
  // Сделайть перезагрузку страницы
  const reloadPage = () => {
    window.location.reload()
  }

  return (
    <div className="flex items-center justify-center">
      <Card className="p-8 text-center space-y-4">
        <BiError className="text-6xl text-danger mx-auto" />
        <h1 className="text-2xl font-bold text-danger">
          Упс! Что-то пошло не так
        </h1>
        <p className="text-default-500">
          {error?.statusText ||
            error?.message ||
            'Произошла неизвестная ошибка'}
        </p>
        <Button color="primary" onClick={reloadPage}>
          Вернуться на главную
        </Button>
      </Card>
    </div>
  )
}

export default ErrorPage