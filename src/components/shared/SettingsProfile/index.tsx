'use client'
import { useUpdateUserSettings, useDeleteUser } from '@/services/api/user.api'
import { User } from '@/store/types'
import { IUserSettings } from '@/types/user.interface'
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Switch,
  Tabs,
  Tab,
  RadioGroup,
  Radio,
  Input,
} from '@heroui/react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { IoIosSettings } from 'react-icons/io'
import { IoMdMail } from 'react-icons/io'
import { BiSolidBookContent } from 'react-icons/bi'
import { FaMapMarkerAlt, FaBirthdayCake } from 'react-icons/fa'
import { MdAnimation } from 'react-icons/md'
import { MdColorLens } from 'react-icons/md'
import toast from 'react-hot-toast'
import { ApiErrorResponse } from '@/services/ApiConfig'
import { UserSettingsStore } from '@/store/userSettings.store'
import { UserThemeStore } from '@/store/userTheme.store'
import { useUserStore } from '@/store/user.store'
import { useStore } from 'zustand'
import { useRouter } from 'next/navigation'

interface SettingsProfileProps {
  isOpen: boolean
  onClose: () => void
  user: User | null
  params: {
    id: string
  }
}

export default function SettingsProfile({
  isOpen,
  onClose,
  user,
  params,
}: SettingsProfileProps) {
  const { mutateAsync: updateSettings, isPending: isUpdatingSettings } =
    useUpdateUserSettings()
  const { mutateAsync: deleteUser, isPending: isDeletingUser } = useDeleteUser()
  const { id } = params
  const setReduce = UserSettingsStore.getState().setReduceAnimation
  const setTheme = UserThemeStore.getState().setTheme
  const [showReloadConfirm, setShowReloadConfirm] = useState(false)
  const [selectedTheme, setSelectedTheme] = useState<string>(
    UserThemeStore.getState().theme
  )
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState('')
  const isDeleteConfirmed = deleteConfirmation === 'Delete'
  const logout = useUserStore(state => state.logout)
  const logoutSettings = useStore(UserSettingsStore, state => state.logout)
  const router = useRouter()

  const {
    reset,
    formState: { errors },
  } = useForm<User>({
    mode: 'onChange',
    reValidateMode: 'onBlur',
    defaultValues: {
      email: user?.email,
      name: user?.name,
      dateOfBirth: user?.dateOfBirth,
      bio: user?.bio,
      location: user?.location,
      userName: user?.userName,
    },
  })

  const [settings, setSettings] = useState<IUserSettings>({
    showEmail: user?.showEmail ?? false,
    showBio: user?.showBio ?? false,
    showLocation: user?.showLocation ?? false,
    showDateOfBirth: user?.showDateOfBirth ?? false,
    reduceAnimation: user?.reduceAnimation ?? false,
  })

  useEffect(() => {
    if (user) {
      reset(user)
    }
  }, [user, reset])

  const handleToggle = (field: keyof IUserSettings) => {
    setSettings(prev => ({
      ...prev,
      [field]: !prev[field],
    }))
  }

  const handleSave = async () => {
    try {
      const promise = updateSettings({ userId: id.toString(), data: settings })

      const toastId = toast.loading('Сохранение...')

      promise
        .then(() => {
          toast.success('Настройки сохранены!')

          // Применяем тему
          if (UserThemeStore.getState().theme !== selectedTheme) {
            setTheme(selectedTheme as any)
          }

          if (settings.reduceAnimation) {
            setReduce(settings.reduceAnimation)
            setShowReloadConfirm(true)
          } else {
            onClose()
          }
        })
        .catch((err: ApiErrorResponse) => {
          toast.error(err.errorMessage)
        })
        .finally(() => {
          toast.dismiss(toastId)
        })
    } catch (error) {
      console.error('Error updating settings:', error)
    }
  }

  const handleReload = () => {
    location.reload()
    onClose()
  }

  const handleThemeChange = (theme: string) => {
    setSelectedTheme(theme)
  }

  const handleDeleteAccount = async () => {
    if (!isDeleteConfirmed) return
    try {
      const toastId = toast.loading('Удаление аккаунта...')
      await deleteUser({
        userId: id.toString(),
        confirmationText: deleteConfirmation,
      })
      toast.success('Аккаунт успешно удален!')
      logout()
      logoutSettings()
      router.push('/auth')
      onClose()
    } catch (err: any) {
      console.error('Ошибка при удалении аккаунта:', err)
      toast.error(err.errorMessage || 'Не удалось удалить аккаунт')
    } finally {
      toast.dismiss()
      setShowDeleteConfirm(false)
      setDeleteConfirmation('')
    }
  }

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        backdrop="blur"
        scrollBehavior="inside"
        size="2xl"
      >
        <ModalContent>
          <ModalHeader>Настройки профиля</ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Card>
                <CardHeader className="flex gap-2 items-center text-primary">
                  <IoIosSettings className="text-2xl" />
                  <h3 className="text-lg font-semibold">Приватность</h3>
                </CardHeader>
                <CardBody className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <IoMdMail className="text-xl" />
                      <span>Показывать email</span>
                    </div>
                    <Switch
                      color="primary"
                      isSelected={settings.showEmail}
                      onValueChange={() => handleToggle('showEmail')}
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <BiSolidBookContent className="text-xl" />
                      <span>Показывать биографию</span>
                    </div>
                    <Switch
                      color="primary"
                      isSelected={settings.showBio}
                      onValueChange={() => handleToggle('showBio')}
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <FaMapMarkerAlt className="text-xl" />
                      <span>Показывать местоположение</span>
                    </div>
                    <Switch
                      color="primary"
                      isSelected={settings.showLocation}
                      onValueChange={() => handleToggle('showLocation')}
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <FaBirthdayCake className="text-xl" />
                      <span>Показывать дату рождения</span>
                    </div>
                    <Switch
                      color="primary"
                      isSelected={settings.showDateOfBirth}
                      onValueChange={() => handleToggle('showDateOfBirth')}
                    />
                  </div>
                </CardBody>
              </Card>

              <Card>
                <CardHeader className="flex gap-2 items-center text-primary">
                  <MdAnimation className="text-2xl" />
                  <h3 className="text-lg font-semibold">Анимация</h3>
                </CardHeader>
                <CardBody>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <MdAnimation className="text-xl" />
                      <div className="flex flex-col">
                        <span>Уменьшить анимацию</span>
                        <span className="text-sm text-gray-400">
                          Если настройка не применилась - перезагрузите страницу
                        </span>
                      </div>
                    </div>
                    <Switch
                      color="primary"
                      isSelected={settings.reduceAnimation}
                      onValueChange={() => handleToggle('reduceAnimation')}
                    />
                  </div>
                </CardBody>
              </Card>

              <Card>
                <CardHeader className="flex gap-2 items-center text-primary">
                  <MdColorLens className="text-2xl" />
                  <h3 className="text-lg font-semibold">Тема оформления</h3>
                </CardHeader>
                <CardBody>
                  <RadioGroup
                    value={selectedTheme}
                    onValueChange={handleThemeChange}
                    orientation="horizontal"
                    className="grid gap-2 w-full"
                  >
                    <div className="grid gap-2 w-full">
                      <Radio
                        value="default"
                        classNames={{
                          base: 'inline-flex m-0 flex-1 w-full max-w-full min-w-[200px] bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 items-center justify-start cursor-pointer rounded-lg gap-2 p-3 border-2 data-[selected=true]:border-primary shadow-sm transition-all data-[selected=true]:shadow-md',
                        }}
                      >
                        <div className="w-full flex flex-col gap-1">
                          <p className="text-medium">По умолчанию</p>
                          <div className="flex gap-1">
                            <span className="w-4 h-4 rounded-full bg-[#9353D3]" />
                            <span className="w-4 h-4 rounded-full bg-[#18181B]" />
                          </div>
                        </div>
                      </Radio>

                      <Radio
                        value="purple"
                        classNames={{
                          base: 'inline-flex m-0 flex-1 w-full max-w-full min-w-[200px] bg-purple-100 dark:bg-purple-900 hover:bg-purple-200 dark:hover:bg-purple-800 items-center justify-start cursor-pointer rounded-lg gap-2 p-3 border-2 data-[selected=true]:border-primary shadow-sm transition-all data-[selected=true]:shadow-md',
                        }}
                      >
                        <div className="w-full flex flex-col gap-1">
                          <p className="text-medium">Фиолетовая</p>
                          <div className="flex gap-1">
                            <span className="w-4 h-4 rounded-full bg-[#9353d3]" />
                            <span className="w-4 h-4 rounded-full bg-[#637aff]" />
                          </div>
                        </div>
                      </Radio>

                      <Radio
                        value="monochrome"
                        classNames={{
                          base: 'inline-flex m-0 flex-1 w-full max-w-full min-w-[200px] bg-gray-100 dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800 items-center justify-start cursor-pointer rounded-lg gap-2 p-3 border-2 data-[selected=true]:border-primary shadow-sm transition-all data-[selected=true]:shadow-md',
                        }}
                      >
                        <div className="w-full flex flex-col gap-1">
                          <p className="text-medium">Монохромная</p>
                          <div className="flex gap-1">
                            <span className="w-4 h-4 rounded-full bg-black dark:bg-white" />
                            <span className="w-4 h-4 rounded-full bg-gray-400" />
                          </div>
                        </div>
                      </Radio>

                      <Radio
                        value="brown"
                        classNames={{
                          base: 'inline-flex m-0 flex-1 w-full max-w-full min-w-[200px] bg-amber-50 dark:bg-amber-950 hover:bg-amber-100 dark:hover:bg-amber-900 items-center justify-start cursor-pointer rounded-lg gap-2 p-3 border-2 data-[selected=true]:border-primary shadow-sm transition-all data-[selected=true]:shadow-md',
                        }}
                      >
                        <div className="w-full flex flex-col gap-1">
                          <p className="text-medium">Коричневая</p>
                          <div className="flex gap-1">
                            <span className="w-4 h-4 rounded-full bg-[#db924b]" />
                            <span className="w-4 h-4 rounded-full bg-[#5a8486]" />
                          </div>
                        </div>
                      </Radio>

                      <Radio
                        value="green"
                        classNames={{
                          base: 'inline-flex m-0 flex-1 w-full max-w-full min-w-[200px] bg-green-50 dark:bg-green-950 hover:bg-green-100 dark:hover:bg-green-900 items-center justify-start cursor-pointer rounded-lg gap-2 p-3 border-2 data-[selected=true]:border-primary shadow-sm transition-all data-[selected=true]:shadow-md',
                        }}
                      >
                        <div className="w-full flex flex-col gap-1">
                          <p className="text-medium">Зеленая</p>
                          <div className="flex gap-1">
                            <span className="w-4 h-4 rounded-full bg-[#66cc8a]" />
                            <span className="w-4 h-4 rounded-full bg-[#377cfb]" />
                          </div>
                        </div>
                      </Radio>
                    </div>
                  </RadioGroup>
                </CardBody>
              </Card>

              <Card>
                <CardHeader className="flex gap-2 items-center text-danger">
                  <h3 className="text-lg font-semibold">Удаление аккаунта</h3>
                </CardHeader>
                <CardBody>
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col">
                      <span>Полностью удалить ваш аккаунт и все данные.</span>
                      <span className="text-sm text-gray-400">
                        Это действие необратимо.
                      </span>
                    </div>
                    <Button
                      color="danger"
                      onClick={() => setShowDeleteConfirm(true)}
                    >
                      Удалить
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </div>
          </ModalBody>
          <Divider />
          <ModalFooter>
            <Button variant="ghost" onClick={onClose}>
              Отмена
            </Button>
            <Button
              color="primary"
              onClick={handleSave}
              isLoading={isUpdatingSettings}
            >
              Сохранить
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={showReloadConfirm}
        onClose={() => setShowReloadConfirm(false)}
        size="sm"
      >
        <ModalContent>
          <ModalHeader className="flex gap-2 items-center text-primary">
            <MdAnimation className="text-2xl" />
            <h3 className="text-lg font-semibold">Обновление анимации</h3>
          </ModalHeader>
          <ModalBody>
            <p>
              Для применения новых настроек анимации необходимо обновить
              страницу. Хотите сделать это сейчас?
            </p>
          </ModalBody>
          <Divider />
          <ModalFooter>
            <Button
              variant="ghost"
              onClick={() => {
                setShowReloadConfirm(false)
                onClose()
              }}
            >
              Позже
            </Button>
            <Button color="primary" onClick={handleReload}>
              Обновить сейчас
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false)
          setDeleteConfirmation('')
        }}
        size="sm"
      >
        <ModalContent>
          <ModalHeader className="flex gap-2 items-center text-danger">
            <h3 className="text-lg font-semibold">Подтвердите удаление</h3>
          </ModalHeader>
          <ModalBody className="gap-2">
            <p>
              Для удаления аккаунта введите <b>Delete</b> в поле ниже:
            </p>
            <Input
              type="text"
              label="Подтверждение удаления"
              placeholder="Delete"
              value={deleteConfirmation}
              onChange={e => setDeleteConfirmation(e.target.value)}
              variant="bordered"
              className="mt-1"
            />
          </ModalBody>
          <Divider />
          <ModalFooter>
            <Button
              variant="ghost"
              onClick={() => {
                setShowDeleteConfirm(false)
                setDeleteConfirmation('')
              }}
            >
              Отмена
            </Button>
            <Button
              color="danger"
              onClick={handleDeleteAccount}
              isLoading={isDeletingUser}
              isDisabled={!isDeleteConfirmed}
            >
              Удалить аккаунт
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
