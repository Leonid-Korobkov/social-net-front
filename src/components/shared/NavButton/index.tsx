'use client'
import Link from 'next/link'
import { Button, TButtonColors } from '../../ui/Button'
import { usePathname } from 'next/navigation'

interface NavButtonProps {
  children: React.ReactNode
  icon?: JSX.Element
  href: string
  color?: TButtonColors
  isActive?: boolean | null
  onClick?: () => void
}

function NavButton({
  children,
  icon,
  href,
  color,
  isActive,
  onClick,
}: NavButtonProps) {
  const pathname = usePathname()

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault()
      onClick()
      return
    }

    if (pathname === href) {
      e.preventDefault()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <Link href={href} onClick={handleClick}>
      <Button
        className="flex justify-start text-xl pointer-events-none"
        type="button"
        fullWidth
        icon={icon}
        color={isActive ? 'secondary' : color}
      >
        {children}
      </Button>
    </Link>
  )
}

export default NavButton
