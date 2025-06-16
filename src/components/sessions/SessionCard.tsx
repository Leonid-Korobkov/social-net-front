import { useTerminateSession } from '@/services/api/session.api'
import { Session } from '@/store/types'
import {
  Button,
  Card,
  CardBody,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tooltip,
  useDisclosure,
} from '@heroui/react'
import { format, isToday } from 'date-fns'
import { ru } from 'date-fns/locale'
import React from 'react'
import { toast } from 'react-hot-toast'
import { BsPhone, BsTablet } from 'react-icons/bs'
import { FaApple, FaDesktop, FaLinux, FaWindows } from 'react-icons/fa'
import {
  RiComputerLine,
  RiDeleteBin6Line,
  RiGlobalLine,
  RiMapPinLine,
} from 'react-icons/ri'

interface SessionCardProps {
  session: Session
  isCurrentSession: boolean
}

export const SessionCard: React.FC<SessionCardProps> = ({
  session,
  isCurrentSession,
}) => {
  const { mutate: terminateSessionApi, isPending } = useTerminateSession()
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  // Определяем иконку операционной системы/устройства
  const getOSDeviceIcon = () => {
    const os = session.os?.toLowerCase()
    const device = session.device?.toLowerCase()

    if (os?.includes('macos') || os?.includes('ios')) {
      return <FaApple className="w-6 h-6 text-foreground" />
    }
    if (os?.includes('windows')) {
      return <FaWindows className="w-6 h-6 text-foreground" />
    }
    if (os?.includes('linux')) {
      return <FaLinux className="w-6 h-6 text-foreground" />
    }
    if (device === 'mobile') {
      return <BsPhone className="w-6 h-6 text-foreground" />
    }
    if (device === 'tablet') {
      return <BsTablet className="w-6 h-6 text-foreground" />
    }
    if (device === 'desktop') {
      return <FaDesktop className="w-6 h-6 text-foreground" />
    }
    return <RiComputerLine className="w-6 h-6 text-foreground" /> // Дефолтная иконка
  }

  const handleTerminate = async () => {
    if (isCurrentSession) {
      toast.error('Нельзя завершить текущую сессию')
      return
    }

    terminateSessionApi(session.sessionId, {
      onSuccess: () => {
        toast.success('Сессия успешно завершена')
      },
      onError: () => {
        toast.error('Ошибка при завершении сессии')
      },
    })
  }

  // Форматирование времени последней активности
  const formatLastActivity = (dateString: string) => {
    const date = new Date(dateString)
    if (isToday(date)) {
      return format(date, 'HH:mm', { locale: ru })
    } else {
      return format(date, 'E', { locale: ru }) // Например, 'Пн', 'Вт'
    }
  }

  return (
    <>
      <Card>
        <CardBody className="p-4">
          <div className="flex justify-between h-full">
            {/* Левая часть */}
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  {getOSDeviceIcon()}
                  <div>
                    <span className="font-medium text-lg text-foreground">
                      {session.browser ?? 'Неизвестно'} на{' '}
                      {session.os ?? 'Неизвестно'}
                    </span>
                    <p className="text-sm text-default-500">
                      {session.browserVersion}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 text-sm text-default-500">
                <RiGlobalLine className="w-4 h-4" />
                <span>{session.device}</span>
              </div>

              <div className="flex items-center space-x-2 text-sm text-default-500">
                <RiMapPinLine className="w-4 h-4" />
                <span>
                  {session.location.city}, {session.location.region},{' '}
                  {session.location.country}
                </span>
              </div>
            </div>

            {/* Правая часть */}
            <div className="flex flex-col justify-between items-end h-auto">
              {/* Время */}
              <div>
                {isCurrentSession ? (
                  <span className="text-primary-600 lowercase text-sm">
                    В сети
                  </span>
                ) : (
                  <span className="text-sm text-default-500">
                    {formatLastActivity(session.lastActivity)}
                  </span>
                )}
              </div>
              {/* Кнопка удаления */}
              <div>
                {!isCurrentSession && (
                  <Tooltip content="Завершить сессию">
                    <Button
                      onClick={onOpen}
                      disabled={isPending}
                      size="sm"
                      isIconOnly
                      color="danger"
                      variant="bordered"
                    >
                      <RiDeleteBin6Line className="w-4 h-4" />
                    </Button>
                  </Tooltip>
                )}
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      <Modal
        isOpen={isOpen}
        scrollBehavior={'inside'}
        onOpenChange={onOpenChange}
        backdrop="blur"
      >
        <ModalContent>
          {onClose => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {/* Вывести всю информацию о сессии */}
                Вы уверены, что хотите удалить сессию {session.browser} на {session.os}
                ?
              </ModalHeader>
              <ModalBody>
                Браузер {session.browserVersion}. Устройство {session.device}.
                <span className="text-sm text-default-500">
                  {session.location.city}, {session.location.region},{' '}
                  {session.location.country}
                </span>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onClick={onClose}>
                  Отмена
                </Button>
                <Button color="primary" onClick={handleTerminate}>
                  Да, удалить
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
