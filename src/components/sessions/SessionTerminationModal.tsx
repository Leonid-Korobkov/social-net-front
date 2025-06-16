import { useAuth } from '@/hooks/useAuth'
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'

interface SessionTerminationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm?: () => void
  title: string
  message: string
  isLoading?: boolean
}

export default function SessionTerminationModal({
  isOpen = false,
  onClose = () => null,
  onConfirm = () => null,
  title = '',
  message = '',
  isLoading = false,
}: SessionTerminationModalProps) {
  const router = useRouter()
  const [countdown, setCountdown] = useState(10)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const { handleLogout } = useAuth()

  const handleRedirect = () => {
    onClose()
    if (onConfirm) onConfirm()
    router.push('/auth')
  }

  useEffect(() => {
    if (!isOpen) return

    const handleVisibilityChange = () => {
      const isTabActive = document.visibilityState === 'visible'

      if (isTabActive && !intervalRef.current) {
        intervalRef.current = setInterval(() => {
          setCountdown(prev => {
            if (prev <= 1) {
              clearInterval(intervalRef.current!)
              intervalRef.current = null
              handleLogout()
              handleRedirect()
              return 0
            }
            return prev - 1
          })
        }, 1000)
      } else if (!isTabActive && intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    // Начальная проверка и подписка на события
    handleVisibilityChange()
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      clearInterval(intervalRef.current!)
      intervalRef.current = null
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      setCountdown(10)
    }
  }, [isOpen])

  const onConfirmModal = () => {
    clearInterval(intervalRef.current!)
    intervalRef.current = null
    handleLogout()
    handleRedirect()
  }
  const onCloseModal = () => {
    clearInterval(intervalRef.current!)
    intervalRef.current = null
    onClose()
    handleLogout()
    router.push('/auth')
  }

  return (
    <Modal isOpen={isOpen} onClose={onCloseModal}>
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalBody>
          <p>{message}</p>
          <p className="text-sm text-gray-500 mt-2">
            Автоматический выход через {countdown} сек.
          </p>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="solid"
            color="danger"
            onClick={onConfirmModal}
            isLoading={isLoading}
          >
            Подтвердить
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
