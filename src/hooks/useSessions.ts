import { useGetSessions } from '@/services/api/session.api'
import { useSessionStore } from '@/store/sessionStore'
import { useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { useAuth } from './useAuth'
import { useModalsStore } from '@/store/modals.store'

export const useSessions = () => {
  const { refetch: refetchSessions } = useGetSessions()
  const { user } = useAuth()
  const { currentSessionId, initializeSocket, socket } = useSessionStore()
  const { openSessionTermination } = useModalsStore()

  // Инициализация WebSocket при наличии пользователя
  useEffect(() => {
    if (user) {
      initializeSocket(user.id)
    }
  }, [user, initializeSocket, socket])

  // Обработка событий WebSocket
  useEffect(() => {
    if (!socket) return

    const handleSessionTerminated = (data: {
      sessionId: string
      socketId: string
    }) => {
      openSessionTermination()
      toast.error('Ваша сессия была завершена')
      // handleLogout()
      // router.push('/auth')
    }

    const handleSessionsUpdated = () => {
      toast.success('Совершен новый вход в аккаунт с другого устройства!')
      refetchSessions()
    }

    // Подписка на события WebSocket
    socket.on('sessionTerminated', handleSessionTerminated)
    socket.on('sessionsUpdated', handleSessionsUpdated)

    // Очистка обработчиков событий
    return () => {
      socket.off('sessionTerminated', handleSessionTerminated)
      socket.off('sessionsUpdated', handleSessionsUpdated)
    }
  }, [socket, currentSessionId])

  return {
    currentSessionId,
  }
}
