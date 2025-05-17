import { ReactNode } from 'react'

interface ContainerProps {
  children: ReactNode | ReactNode[] | ReactNode
  className?: string
}

export default function Container({ children, className }: ContainerProps) {
  return (
    <div
      className={`lg:flex max-w-screen-xl mx-auto w-full items-start justify-between overflow-hidden ${className}`}
    >
      {children}
    </div>
  )
}
