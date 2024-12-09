import { useEffect } from 'react'

interface ContainerProps {
  children: React.ReactNode | React.ReactNode[] | React.ReactNode
}

function Container({ children }: ContainerProps) {

  return <div className="flex max-w-screen-xl mx-auto mt-10">{children}</div>
}

export default Container
