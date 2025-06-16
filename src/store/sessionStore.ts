import { create } from 'zustand'
import { Session } from './types'
import { io, Socket } from 'socket.io-client'
import { BASE_URL } from '@/app/constants'
import toast from 'react-hot-toast'

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
        transports: ['websocket'],
      })

      socket.on('connect', () => {
        console.log('WebSocket подключен')
        socket.emit('authenticate', userId)
      })

      socket.on('connect_error', error => {
        console.error('Ошибка подключения WebSocket:', error)
      })

      socket.on('disconnect', () => {
        console.log('WebSocket отключен')
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
