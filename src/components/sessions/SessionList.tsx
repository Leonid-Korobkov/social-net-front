import {
  useGetSessions,
  useTerminateOtherSessions,
} from '@/services/api/session.api'
import { Button, Spinner } from '@heroui/react'
import React from 'react'
import { toast } from 'react-hot-toast'
import { SessionCard } from './SessionCard'

export const SessionList: React.FC = () => {
  const { data: sessions, isLoading, error } = useGetSessions()
  const { mutate: terminateOtherSessions, isPending: isTerminatingOthers } =
    useTerminateOtherSessions()

  const handleTerminateOtherSessions = async () => {
    terminateOtherSessions(undefined, {
      onSuccess: () => {
        toast.success('Все другие сессии успешно завершены')
      },
      onError: err => {
        console.error('Ошибка при завершении других сессий:', err)
        toast.error('Ошибка при завершении других сессий')
      },
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Spinner size="md" variant="gradient" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 text-center text-danger">Ошибка загрузки сессий</div>
    )
  }

  if (!sessions || sessions.length === 0) {
    return <div className="p-4 text-center">Нет активных сессий</div>
  }

  // Определяем текущую сессию и остальные
  const currentSession =
    sessions.find(session => session.isCurrentSession) || null
  const otherSessions = sessions.filter(session => !session.isCurrentSession)

  return (
    <div className="space-y-6">
      {/* Секция "ЭТО УСТРОЙСТВО" */}
      {currentSession && (
        <div className="space-y-4">
          <h4 className="text-default-500 text-small uppercase">
            ЭТО УСТРОЙСТВО
          </h4>
          <SessionCard session={currentSession} isCurrentSession={true} />

          <div className="space-y-2">
            <Button
              variant="ghost"
              color="danger"
              size="sm"
              onClick={handleTerminateOtherSessions}
              isLoading={isTerminatingOthers}
              className="justify-start"
            >
              Завершить все другие сеансы
            </Button>
            <p className="text-sm text-default-500">
              Выйти на всех устройствах, кроме этого.
            </p>
          </div>
        </div>
      )}

      {/* Секция "АКТИВНЫЕ СЕАНСЫ" */}
      {otherSessions.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-default-500 text-small uppercase">
            АКТИВНЫЕ СЕАНСЫ
          </h4>
          <div className="space-y-3">
            {otherSessions.map(session => (
              <SessionCard
                key={session.sessionId}
                session={session}
                isCurrentSession={false}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
