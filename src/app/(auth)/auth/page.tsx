'use client'
import { Alert, Card, CardBody, Tab, Tabs } from '@heroui/react'
import { useState } from 'react'
import { IoLogIn, IoPeople } from 'react-icons/io5'
import Login from '@/features/user/login'
import Register from '@/features/user/register'
import { useUserStore } from '@/store/user.store'

function Auth() {
  const [selected, setSelected] = useState('login')
  const [isRegisterSuccess, setRegisterSuccess] = useState(false)
  const error = useUserStore(state => state.error)

  return (
    <>
      <div className="flex flex-1 items-center justify-center w-full h-full flex-col ">
        <div className="flex flex-col w-full max-w-[390px] ">
          <Card className="min-h-[450px] m-5">
            <Alert
              color="success"
              description={
                'Вы успешно зарегистрировались. Пройдите процесс входа'
              }
              isVisible={isRegisterSuccess}
              title={'Успешная регистрация'}
              variant="faded"
              onClose={() => setRegisterSuccess(false)}
            />
            <CardBody className="overflow-hidden">
              <Tabs
                aria-label="Options"
                color="secondary"
                variant="bordered"
                size="md"
                fullWidth
                selectedKey={selected}
                onSelectionChange={key => setSelected(key as string)}
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
                  <Login
                    setSelected={setSelected}
                    isRegisterSuccess={isRegisterSuccess}
                  />
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
                  <Register
                    setSelected={setSelected}
                    setRegisterSuccess={setRegisterSuccess}
                  />
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

export default Auth
