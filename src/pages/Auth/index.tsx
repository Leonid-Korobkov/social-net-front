import { Alert, Card, CardBody, Tab, Tabs } from '@nextui-org/react'
import { useState } from 'react'
import { IoLogIn, IoPeople } from 'react-icons/io5'
import Login from '../../features/user/login'
import Register from '../../features/user/register'
import Header from '../../components/Header'

function Auth() {
  const [selected, setSelected] = useState('login')
  const [isRegisterSuccess, setRegisterSuccess] = useState(false)

  return (
    <>
      <div className="flex items-center justify-start h-screen flex-col">
        <Header />
        <div className="flex items-center justify-center w-full h-full flex-col">
          <div className="flex flex-col w-full max-w-[350px] m-2">
            <Card className="min-h-[450px]">
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
          </div>
        </div>
      </div>
    </>
  )
}

export default Auth
