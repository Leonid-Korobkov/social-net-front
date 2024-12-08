import { useEffect } from 'react'

interface ContainerProps {
  children: React.ReactNode | React.ReactNode[] | React.ReactNode
}

function Container({ children }: ContainerProps) {
  useEffect(() => {
    window.addEventListener('click', e => {
      if (e.target instanceof HTMLElement) {
        const target = e.target.closest('button')

        if (target) {
          console.log('click')
        }
      }
    })
  })

  return <div className="flex max-w-screen-xl mx-auto mt-10">{children}</div>
}

export default Container
