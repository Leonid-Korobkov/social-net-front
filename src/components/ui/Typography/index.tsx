'use client'
import { ReactNode } from 'react'

interface ITypography {
  children: ReactNode
  size?: string
}

function Typography({ children, size = 'text-xl' }: ITypography) {
  return <p className={`${size}`}>{children}</p>
}

export default Typography
