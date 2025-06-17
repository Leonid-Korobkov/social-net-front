import { create } from 'zustand'
import { io, Socket } from 'socket.io-client'
import { BASE_URL } from '@/app/constants'

interface SessionStore {
  currentSessionId: string | null
  socket: Socket | null
  isConnected: boolean
  connectionAttempts: number
  setCurrentSessionId: (sessionId: string) => void
  initializeSocket: (userId: string) => void
  disconnectSocket: () => void
  reconnectSocket: () => void
}

export const useSessionStore = create<SessionStore>((set, get) => ({
  currentSessionId: null,
  socket: null,
  isConnected: false,
  connectionAttempts: 0,

  setCurrentSessionId: sessionId => set({ currentSessionId: sessionId }),

  initializeSocket: (userId: string) => {
    // Если сокет уже существует и подключен, ничего не делаем
    const currentSocket = get().socket
    if (currentSocket?.connected) {
      return
    }

    // Отключаем существующий сокет если он есть
    if (currentSocket) {
      currentSocket.disconnect()
    }

    try {
      const socket = io(`${BASE_URL}`, {
        auth: {
          userId,
        },
        withCredentials: true,
        reconnection: true,
        reconnectionAttempts: 1, // Увеличено количество попыток
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        timeout: 20000,
      })

      socket.on('connect', () => {
        console.log('WebSocket подключен:', socket.id)
        set({ isConnected: true, connectionAttempts: 0 })
        socket.emit('authenticate', userId)
      })

      socket.on('connect_error', error => {
        console.error('Ошибка подключения WebSocket:', error)
        const attempts = get().connectionAttempts + 1
        set({ isConnected: false, connectionAttempts: attempts })

        // Если много неудачных попыток, можно показать уведомление пользователю
        if (attempts > 5) {
          console.warn('Множественные ошибки подключения, проверьте соединение')
        }
      })

      socket.io.on('reconnect', attempt => {
        console.log('WebSocket переподключен, попытка:', attempt)
        set({ isConnected: true, connectionAttempts: 0 })
      })

      socket.io.on('reconnect_attempt', attempt => {
        console.log('Попытка переподключения:', attempt)
        set({ connectionAttempts: attempt })
      })

      socket.io.on('reconnect_failed', () => {
        console.error('Не удалось переподключиться')
        set({ isConnected: false })
      })

      socket.on('disconnect', reason => {
        console.log('WebSocket отключен:', reason)
        set({ isConnected: false })

        // Различные причины отключения
        if (reason === 'io server disconnect') {
          // Сервер принудительно отключил соединение - переподключаемся
          console.log('Сервер отключил соединение, переподключаемся...')
          setTimeout(() => {
            socket.connect()
          }, 1000)
        } else if (
          reason === 'transport close' ||
          reason === 'transport error'
        ) {
          // Проблемы с транспортом - обычно временные
          console.log(
            'Проблемы с транспортом, ожидаем автоматического переподключения'
          )
        }
      })

      // Добавляем обработчик pong для мониторинга соединения
      socket.on('pong', latency => {
        console.log('Ping latency:', latency, 'ms')
      })

      // Периодическая проверка соединения
      const heartbeatInterval = setInterval(() => {
        if (socket.connected) {
          socket.emit('ping')
        } else {
          console.warn('Сокет не подключен во время heartbeat')
        }
      }, 30000) // каждые 30 секунд

      // Очищаем интервал при отключении
      socket.on('disconnect', () => {
        clearInterval(heartbeatInterval)
      })

      set({ socket })
    } catch (error) {
      console.error('Ошибка при инициализации WebSocket:', error)
      set({ isConnected: false })
    }
  },

  reconnectSocket: () => {
    const { socket } = get()
    if (socket && !socket.connected) {
      console.log('Принудительное переподключение сокета')
      socket.connect()
    }
  },

  disconnectSocket: () => {
    const { socket } = get()
    if (socket) {
      socket.disconnect()
      set({ socket: null, isConnected: false, connectionAttempts: 0 })
    }
  },
}))
