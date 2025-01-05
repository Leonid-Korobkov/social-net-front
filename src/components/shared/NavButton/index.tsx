import { NavLink, useLocation } from 'react-router-dom'
import { Button, TButtonColors } from '../../ui/Button'

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
  const location = useLocation()

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault()
      onClick()
      return
    }

    if (location.pathname === href) {
      e.preventDefault()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <NavLink to={href} onClick={handleClick}>
      {() => (
        <Button
          className="flex justify-start text-xl pointer-events-none"
          type="button"
          fullWidth
          icon={icon}
          color={isActive ? 'secondary' : color}
        >
          {children}
        </Button>
      )}
    </NavLink>
  )
}

export default NavButton
