'use client'
import { SessionList } from '@/components/sessions/SessionList'
import { useDeleteUser, useUpdateUserSettings } from '@/services/api/user.api'
import { ApiErrorResponse } from '@/services/ApiConfig'
import { User } from '@/store/types'
import { useUserStore } from '@/store/user.store'
import { UserSettingsStore } from '@/store/userSettings.store'
import { UserThemeStore } from '@/store/userTheme.store'
import { IUserSettings } from '@/types/user.interface'
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Radio,
  RadioGroup,
  Switch,
} from '@heroui/react'
import { TbLockPassword } from 'react-icons/tb'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { BiSolidBookContent } from 'react-icons/bi'
import { FaBirthdayCake, FaMapMarkerAlt } from 'react-icons/fa'
import { IoMdMail } from 'react-icons/io'
import { MdAnimation } from 'react-icons/md'
import { useStore } from 'zustand'

interface SettingsProfileProps {
  user: User
}

export default function SettingsProfile({ user }: SettingsProfileProps) {
  const { mutateAsync: updateSettings, isPending: isUpdatingSettings } =
    useUpdateUserSettings()
  const { mutateAsync: deleteUser, isPending: isDeletingUser } = useDeleteUser()
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
  const [loadingField, setLoadingField] = useState<keyof IUserSettings | null>(
    null
  )

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
    enablePushNotifications: user?.enablePushNotifications ?? false,
    enableEmailNotifications: user?.enableEmailNotifications ?? false,
    notifyOnNewPostPush: user?.notifyOnNewPostPush ?? false,
    notifyOnNewPostEmail: user?.notifyOnNewPostEmail ?? false,
    notifyOnNewCommentPush: user?.notifyOnNewCommentPush ?? false,
    notifyOnNewCommentEmail: user?.notifyOnNewCommentEmail ?? false,
    notifyOnLikePush: user?.notifyOnLikePush ?? false,
    notifyOnLikeEmail: user?.notifyOnLikeEmail ?? false,
    notifyOnRepostPush: user?.notifyOnRepostPush ?? false,
    notifyOnRepostEmail: user?.notifyOnRepostEmail ?? false,
    notifyOnNewFollowerPush: user?.notifyOnNewFollowerPush ?? false,
    notifyOnNewFollowerEmail: user?.notifyOnNewFollowerEmail ?? false,
  })

  useEffect(() => {
    if (user) {
      reset(user)
    }
  }, [user, reset])

  const handleSave = async (
    newSettings = settings,
    newTheme = selectedTheme,
    field?: keyof IUserSettings
  ) => {
    try {
      await updateSettings({
        username: user?.userName?.toString() || '',
        data: newSettings,
      })
      if (UserThemeStore.getState().theme !== newTheme) {
        setTheme(newTheme as any)
      }
      if (newSettings.reduceAnimation) {
        setReduce(newSettings.reduceAnimation)
        setShowReloadConfirm(true)
      }
    } catch (error) {
      console.error('Error updating settings:', error)
    } finally {
      if (field) setLoadingField(null)
    }
  }

  const handleToggle = (field: keyof IUserSettings) => {
    setSettings(prev => {
      const newSettings = { ...prev, [field]: !prev[field] }
      setLoadingField(field)
      handleSave(newSettings, selectedTheme, field)
      return newSettings
    })
  }

  const handleReload = () => {
    location.reload()
  }

  const handleThemeChange = (theme: string) => {
    setSelectedTheme(theme)
    setLoadingField('theme' as keyof IUserSettings)
    handleSave(settings, theme, 'theme' as keyof IUserSettings)
  }

  const handleDeleteAccount = async () => {
    if (!isDeleteConfirmed) return
    try {
      const toastId = toast.loading('Удаление аккаунта...')
      await deleteUser({
        userId: user.id.toString(),
        confirmationText: deleteConfirmation,
      })
      toast.success('Аккаунт успешно удален!')
      logout()
      logoutSettings()
      router.push('/auth')
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
      <div className="space-y-6">
        <Card>
          <CardHeader className="flex gap-2 items-center text-lg font-semibold text-foreground">
            <h3>Приватность</h3>
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
                isDisabled={loadingField === 'showEmail'}
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
                isDisabled={loadingField === 'showBio'}
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
                isDisabled={loadingField === 'showLocation'}
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
                isDisabled={loadingField === 'showDateOfBirth'}
              />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader className="flex gap-2 items-center text-lg font-semibold text-foreground">
            <h3>Анимация</h3>
          </CardHeader>
          <CardBody>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <MdAnimation className="text-xl flex-shrink-0" />
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
                isDisabled={loadingField === 'reduceAnimation'}
              />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader className="flex gap-2 items-center text-lg font-semibold text-foreground">
            <h3>Тема оформления</h3>
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
          <CardHeader className="flex gap-2 items-center text-lg font-semibold text-foreground">
            <h3>Уведомления</h3>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Push-уведомления</span>
              <Switch
                color="primary"
                isSelected={settings.enablePushNotifications}
                onValueChange={() => handleToggle('enablePushNotifications')}
                isDisabled={loadingField === 'enablePushNotifications'}
              />
            </div>
            <div className="flex justify-between items-center">
              <span>Email-уведомления</span>
              <Switch
                color="primary"
                isSelected={settings.enableEmailNotifications}
                onValueChange={() => handleToggle('enableEmailNotifications')}
                isDisabled={loadingField === 'enableEmailNotifications'}
              />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader className="flex gap-2 items-center text-lg font-semibold text-foreground">
            <h3>Уведомления по событиям</h3>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center gap-1">
                <span className="text-gray-400">Тип уведомления</span>
                <div className="flex gap-3">
                  <span className="text-gray-400">Push</span>
                  <span className="text-gray-400">Email</span>
                </div>
              </div>
              <div className="flex justify-between items-center gap-1">
                <span>Новый пост от пользователя, на которого я подписан</span>
                <div className="flex gap-2">
                  <Switch
                    color="primary"
                    isSelected={settings.notifyOnNewPostPush}
                    onValueChange={() => handleToggle('notifyOnNewPostPush')}
                    size="sm"
                    isDisabled={loadingField === 'notifyOnNewPostPush'}
                  ></Switch>
                  <Switch
                    color="primary"
                    isSelected={settings.notifyOnNewPostEmail}
                    onValueChange={() => handleToggle('notifyOnNewPostEmail')}
                    size="sm"
                    isDisabled={loadingField === 'notifyOnNewPostEmail'}
                  ></Switch>
                </div>
              </div>
              <div className="flex justify-between items-center gap-1">
                <span>Новый комментарий к моему посту</span>
                <div className="flex gap-2">
                  <Switch
                    color="primary"
                    isSelected={settings.notifyOnNewCommentPush}
                    onValueChange={() => handleToggle('notifyOnNewCommentPush')}
                    size="sm"
                    isDisabled={loadingField === 'notifyOnNewCommentPush'}
                  ></Switch>
                  <Switch
                    color="primary"
                    isSelected={settings.notifyOnNewCommentEmail}
                    onValueChange={() =>
                      handleToggle('notifyOnNewCommentEmail')
                    }
                    size="sm"
                    isDisabled={loadingField === 'notifyOnNewCommentEmail'}
                  ></Switch>
                </div>
              </div>
              <div className="flex justify-between items-center gap-1">
                <span>Лайк к моему посту</span>
                <div className="flex gap-2">
                  <Switch
                    color="primary"
                    isSelected={settings.notifyOnLikePush}
                    onValueChange={() => handleToggle('notifyOnLikePush')}
                    size="sm"
                    isDisabled={loadingField === 'notifyOnLikePush'}
                  ></Switch>
                  <Switch
                    color="primary"
                    isSelected={settings.notifyOnLikeEmail}
                    onValueChange={() => handleToggle('notifyOnLikeEmail')}
                    size="sm"
                    isDisabled={loadingField === 'notifyOnLikeEmail'}
                  ></Switch>
                </div>
              </div>
              <div className="flex justify-between items-center gap-1">
                <span>Репост к моему посту</span>
                <div className="flex gap-2">
                  <Switch
                    color="primary"
                    isSelected={settings.notifyOnRepostPush}
                    onValueChange={() => handleToggle('notifyOnRepostPush')}
                    size="sm"
                    isDisabled={loadingField === 'notifyOnRepostPush'}
                  ></Switch>
                  <Switch
                    color="primary"
                    isSelected={settings.notifyOnRepostEmail}
                    onValueChange={() => handleToggle('notifyOnRepostEmail')}
                    size="sm"
                    isDisabled={loadingField === 'notifyOnRepostEmail'}
                  ></Switch>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span>Новый подписчик</span>
                <div className="flex gap-2">
                  <Switch
                    color="primary"
                    isSelected={settings.notifyOnNewFollowerPush}
                    onValueChange={() =>
                      handleToggle('notifyOnNewFollowerPush')
                    }
                    size="sm"
                    isDisabled={loadingField === 'notifyOnNewFollowerPush'}
                  ></Switch>
                  <Switch
                    color="primary"
                    isSelected={settings.notifyOnNewFollowerEmail}
                    onValueChange={() =>
                      handleToggle('notifyOnNewFollowerEmail')
                    }
                    size="sm"
                    isDisabled={loadingField === 'notifyOnNewFollowerEmail'}
                  ></Switch>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader className="flex gap-2 items-center text-lg font-semibold text-foreground">
            <h3 className="text-lg font-semibold">Активные сессии</h3>
          </CardHeader>
          <CardBody>
            <SessionList />
          </CardBody>
        </Card>

        <Card>
          <CardHeader className="flex gap-2 items-center text-lg font-semibold text-foreground">
            <h3>Сброс пароля</h3>
          </CardHeader>
          <CardBody>
            <div className="flex justify-between md:items-center flex-col md:flex-row gap-2 md:gap-0">
              <div className="flex items-center gap-2">
                <TbLockPassword className="text-xl flex-shrink-0" />
                <div className="flex flex-col">
                  <span>Мы отправим код подтверждения на ваш email.</span>
                  <span className="text-sm text-gray-400">
                    Затем нужно будет ввести новый пароль и подтвердить его.
                  </span>
                </div>
              </div>
              <Button
                color="primary"
                onClick={() => {
                  router.push('/reset-password')
                }}
              >
                Сбросить пароль
              </Button>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader className="flex gap-2 items-center text-lg font-semibold text-danger max-w-3xl:flex-col">
            <h3>Удаление аккаунта</h3>
          </CardHeader>
          <CardBody>
            <div className="flex justify-between md:items-center flex-col md:flex-row gap-2 md:gap-0">
              <div className="flex flex-col">
                <span>Полностью удалить ваш аккаунт и все данные.</span>
                <span className="text-sm text-gray-400">
                  Это действие необратимо.
                </span>
              </div>
              <Button color="danger" onClick={() => setShowDeleteConfirm(true)}>
                Удалить
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>

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
              isDisabled={isDeletingUser}
            >
              Удалить аккаунт
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
