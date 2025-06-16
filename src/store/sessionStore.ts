import { create } from 'zustand'
import { io, Socket } from 'socket.io-client'
import { BASE_URL } from '@/app/constants'

interface SessionStore {
  currentSessionId: string | null
  socket: Socket | null
  setCurrentSessionId: (sessionId: string) => void
  initializeSocket: (userId: string) => void
  disconnectSocket: () => void
}

export const useSessionStore = create<SessionStore>((set, get) => ({
  currentSessionId: null,
  socket: null,

  setCurrentSessionId: sessionId => set({ currentSessionId: sessionId }),

  initializeSocket: (userId: string) => {
    // Если сокет уже существует, ничего не делаем
    if (get().socket) {
      return
    }

    try {
      const socket = io(`${BASE_URL}`, {
        auth: {
          userId,
        },
        withCredentials: true,
        reconnection: true, // Включить автоматическое переподключение
        reconnectionAttempts: 2, // Количество попыток
        reconnectionDelay: 1000, // Интервал между попытками (1 секунда)
      })

      socket.on('connect', () => {
        console.log('WebSocket подключен')
        socket.emit('authenticate', userId)
      })

      socket.on('connect_error', error => {
        console.error('Ошибка подключения WebSocket:', error)
      })

      socket.on('disconnect', reason => {
        console.log('WebSocket отключен:', reason)
        if (reason === 'io server disconnect') {
          // Сервер принудительно отключил соединение
          socket.connect()
        }
      })

      set({ socket })
    } catch (error) {
      console.error('Ошибка при инициализации WebSocket:', error)
    }
  },

  disconnectSocket: () => {
    const { socket } = get()
    if (socket) {
      socket.disconnect()
      set({ socket: null })
    }
  },
}))
