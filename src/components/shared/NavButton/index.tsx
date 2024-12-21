import { NavLink } from 'react-router-dom'
import { Button, TButtonColors } from '../../ui/Button'

interface NavButtonProps {
  children: React.ReactNode
  icon?: JSX.Element
  href: string
  color?: TButtonColors
}

function NavButton({ children, icon, href, color }: NavButtonProps) {
  return (
    <NavLink to={href}>
      {({ isActive }) => (
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
