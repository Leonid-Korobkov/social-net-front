import { useNavigate, useRouteError } from 'react-router-dom'
import { Button, Card } from "@heroui/react"
import { BiError } from 'react-icons/bi'
import OpenGraphMeta from '../../components/shared/OpenGraphMeta'
import { APP_URL } from '../../constants'

function ErrorPage() {
  const error = useRouteError() as { statusText?: string; message?: string }
  const navigate = useNavigate()
  // Сделайть перезагрузку страницы
  const reloadPage = () => {
    navigate('/')
    window.location.reload()
  }

  return (
    <>
      <OpenGraphMeta
        title="Ошибка | Zling"
        description="Произошла ошибка при загрузке страницы"
        url={`${APP_URL}/error`}
        image=""
        siteName="Zling"
        type="website"
      />
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
    </>
  )
}

export default ErrorPage
