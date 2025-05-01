'use client'
import { useUpdateUserSettings } from '@/services/api/user.api'
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
} from '@heroui/react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { IoIosSettings } from 'react-icons/io'
import { IoMdMail } from 'react-icons/io'
import { BiSolidBookContent } from 'react-icons/bi'
import { FaMapMarkerAlt, FaBirthdayCake } from 'react-icons/fa'
import { MdAnimation } from 'react-icons/md'
import toast from 'react-hot-toast'
import { ApiErrorResponse } from '@/services/ApiConfig'
import { UserSettingsStore } from '@/store/userSettings.store'

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
  const { id } = params
  const setReduce = UserSettingsStore.getState().setReduceAnimation
  const [showReloadConfirm, setShowReloadConfirm] = useState(false)

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
          if (user!.reduceAnimation !== settings.reduceAnimation) {
            console.log('reduce')
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

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        scrollBehavior="inside"
        size="2xl"
      >
        <ModalContent>
          <ModalHeader>Настройки профиля</ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Card>
                <CardHeader className="flex gap-2 items-center text-[#9353D3]">
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
                      isSelected={settings.showDateOfBirth}
                      onValueChange={() => handleToggle('showDateOfBirth')}
                    />
                  </div>
                </CardBody>
              </Card>

              <Card>
                <CardHeader className="flex gap-2 items-center text-[#9353D3]">
                  <MdAnimation className="text-2xl" />
                  <h3 className="text-lg font-semibold">Анимация</h3>
                </CardHeader>
                <CardBody>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <MdAnimation className="text-xl" />
                      <span>Уменьшить анимацию</span>
                    </div>
                    <Switch
                      isSelected={settings.reduceAnimation}
                      onValueChange={() => handleToggle('reduceAnimation')}
                    />
                  </div>
                </CardBody>
              </Card>
            </div>
          </ModalBody>
          <Divider />
          <ModalFooter>
            <Button variant="ghost" onPress={onClose}>
              Отмена
            </Button>
            <Button
              color="primary"
              onPress={handleSave}
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
          <ModalHeader className="flex gap-2 items-center text-[#9353D3]">
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
              onPress={() => {
                setShowReloadConfirm(false)
                onClose()
              }}
            >
              Позже
            </Button>
            <Button color="primary" onPress={handleReload}>
              Обновить сейчас
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
