interface ContainerProps {
  children: React.ReactNode | React.ReactNode[] | React.ReactNode
  className?: string
}

function Container({ children, className }: ContainerProps) {
  return (
    <div className={`lg:flex max-w-screen-xl mx-auto items-start ${className}`}>
      {children}
    </div>
  )
}

export default Container
