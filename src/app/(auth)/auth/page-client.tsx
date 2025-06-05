'use client'
import { Alert, Card, CardBody, Tab, Tabs } from '@heroui/react'
import { useEffect, useState } from 'react'
import { IoLogIn, IoPeople } from 'react-icons/io5'
import Login from '@/features/user/login'
import Register from '@/features/user/register'
import { useUserStore } from '@/store/user.store'
import { useSearchParams, useRouter } from 'next/navigation'

function AuthClient() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const initialTab = searchParams.get('tab') || 'login'
  const [selected, setSelected] = useState(initialTab)
  const error = useUserStore(state => state.error)

  return (
    <>
      <div className="flex flex-1 items-center justify-center w-full h-full flex-col ">
        <div className="flex flex-col w-full max-w-[390px] ">
          <Card className="min-h-[450px] m-5">
            <CardBody className="overflow-hidden">
              <Tabs
                aria-label="Options"
                color="primary"
                variant="bordered"
                size="md"
                fullWidth
                selectedKey={selected}
                onSelectionChange={key => {
                  const tabKey = key as string
                  setSelected(tabKey)
                  router.replace(`/auth?tab=${tabKey}`)
                }}
              >
                <Tab
                  key="login"
                  title={
                    <div className="flex items-center space-x-2">
                      <IoLogIn />
                      <span>Вход</span>
                    </div>
                  }
                >
                  <Login setSelected={setSelected} />
                </Tab>
                <Tab
                  key="register"
                  title={
                    <div className="flex items-center space-x-2">
                      <IoPeople />
                      <span>Регистрация</span>
                    </div>
                  }
                >
                  <Register setSelected={setSelected} />
                </Tab>
              </Tabs>
            </CardBody>
          </Card>
          {error && (
            <div className="flex items-center justify-center p-4">
              <Alert
                color="danger"
                title="Ошибка"
                description={error ? error : 'Произошла неизвестная ошибка'}
              />
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default AuthClient
