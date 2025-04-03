'use client'
import { store } from '@/store/store'
import React from 'react'
import { ThemeProvider } from 'next-themes'
import { Provider as RProvider } from 'react-redux'

export const Provider = (props: React.PropsWithChildren) => {
  return (
    <ThemeProvider>
      <RProvider store={store}>{props.children}</RProvider>
    </ThemeProvider>
  )
}
