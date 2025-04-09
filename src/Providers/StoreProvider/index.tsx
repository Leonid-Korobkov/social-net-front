'use client'
import { makeStore, AppStore } from '@/store/store'
import { useRef } from 'react'
import { Provider as RProvider } from 'react-redux'
import PreLoader from '../PreLoader'

export const StoreProvider = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  const storeRef = useRef<AppStore>(undefined)
  if (!storeRef.current) {
    storeRef.current = makeStore()
  }

  return (
    <RProvider store={storeRef.current}>
      {children}
    </RProvider>
  )
}
