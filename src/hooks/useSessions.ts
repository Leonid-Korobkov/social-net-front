import { useGetSessions } from '@/services/api/session.api'
import { useSessionStore } from '@/store/sessionStore'
import { useEffect, useCallback, useRef } from 'react'
import { toast } from 'react-hot-toast'
import { useAuth } from './useAuth'
import { useModalsStore } from '@/store/modals.store'
import { Session } from 'inspector/promises'

export const useSessions = () => {
  const { refetch: refetchSessions } = useGetSessions()
  const { user } = useAuth()
  const {
    currentSessionId,
    initializeSocket,
    socket,
    isConnected,
    reconnectSocket,
  } = useSessionStore()
  const { openSessionTermination } = useModalsStore()

  // Используем ref для предотвращения дублирования обработчиков
  const eventHandlersSet = useRef(false)

  // Инициализация WebSocket при наличии пользователя
  useEffect(() => {
    if (user && !socket) {
      console.log('Инициализация сокета для пользователя:', user.id)
      initializeSocket(user.id)
    }
  }, [user, socket, initializeSocket])

  // Обработчики событий WebSocket
  const handleSessionTerminated = useCallback(
    (data: { sessionId: string; message: string }) => {
      console.log('Получено уведомление о завершении сессии:', data)
      openSessionTermination()
      toast.error(data.message || 'Ваша сессия была завершена')
    },
    [openSessionTermination]
  )

  const handleSessionsUpdated = useCallback(
    (sessions: Session[]) => {
      console.log('Получено обновление сессий:', sessions)
      toast.success('Совершен новый вход в аккаунт с другого устройства!')
      refetchSessions()
    },
    [refetchSessions]
  )

  const handleConnect = useCallback(() => {
    console.log('Socket.IO: Соединение установлено')
  }, [])

  const handleDisconnect = useCallback((reason: any) => {
    console.log('Socket.IO: Соединение разорвано:', reason)
  }, [])

  const handleReconnect = useCallback(() => {
    console.log('Socket.IO: Переподключение успешно')
  }, [])

  const handleReconnectError = useCallback(() => {
    console.log('Socket.IO: Ошибка переподключения')
  }, [])

  // Подписка на события WebSocket
  useEffect(() => {
    if (!socket || eventHandlersSet.current) return

    console.log('Подписка на события сокета')

    // Основные события приложения
    socket.on('sessionTerminated', handleSessionTerminated)
    socket.on('sessionsUpdated', handleSessionsUpdated)

    // События соединения для мониторинга
    socket.on('connect', handleConnect)
    socket.on('disconnect', handleDisconnect)
    socket.io.on('reconnect', handleReconnect)
    socket.io.on('reconnect_error', handleReconnectError)

    eventHandlersSet.current = true

    // Очистка обработчиков событий при размонтировании
    return () => {
      if (socket) {
        console.log('Очистка обработчиков событий сокета')

        socket.off('sessionTerminated', handleSessionTerminated)
        socket.off('sessionsUpdated', handleSessionsUpdated)
        socket.off('connect', handleConnect)
        socket.off('disconnect', handleDisconnect)
        socket.io.off('reconnect', handleReconnect)
        socket.io.off('reconnect_error', handleReconnectError)

        eventHandlersSet.current = false
      }
    }
  }, [
    socket,
    handleSessionTerminated,
    handleSessionsUpdated,
    handleConnect,
    handleDisconnect,
    handleReconnect,
    handleReconnectError,
  ])

  // Мониторинг состояния соединения
  useEffect(() => {
    if (!socket) return

    const connectionCheckInterval = setInterval(() => {
      if (!socket.connected && socket.disconnected) {
        console.warn(
          'Обнаружено разорванное соединение, попытка переподключения'
        )
        reconnectSocket()
      }
    }, 30000) // проверяем каждые 30 секунд

    return () => {
      clearInterval(connectionCheckInterval)
    }
  }, [socket, reconnectSocket])

  // Функция для принудительного переподключения
  const forceReconnect = useCallback(() => {
    if (socket) {
      console.log('Принудительное переподключение сокета')
      reconnectSocket()
    }
  }, [socket, reconnectSocket])

  return {
    currentSessionId,
    isConnected,
    forceReconnect,
  }
}
