'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState, useEffect } from 'react'
import { useIncrementViewsBatch } from '@/services/api/post.api'
import { UserSettingsStore } from '@/store/userSettings.store'

function BatchViewSender() {
  const { mutate } = useIncrementViewsBatch()
  useEffect(() => {
    const sendBatch = () => {
      const ids = UserSettingsStore.getState().getAndClearPendingViewPosts()
      if (ids.length) mutate(ids)
    }
    const interval = setInterval(sendBatch, 5000)
    window.addEventListener('beforeunload', sendBatch)
    window.addEventListener('visibilitychange', sendBatch)
    return () => {
      clearInterval(interval)
      window.removeEventListener('beforeunload', sendBatch)
      window.addEventListener('visibilitychange', sendBatch)
    }
  }, [mutate])
  return null
}

export const StoreProvider = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 0,
          },
        },
      })
  )
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <BatchViewSender />
    </QueryClientProvider>
  )
}
