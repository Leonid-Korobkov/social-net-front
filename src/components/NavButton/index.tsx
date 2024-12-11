import { useNavigate } from 'react-router-dom'
import { Button, TButtonColors } from '../Button'

interface NavButtonProps {
  children: React.ReactNode
  icon?: JSX.Element
  href: string
  color?: TButtonColors
}

function NavButton({ children, icon, href, color }: NavButtonProps) {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(href)
  }

  return (
    <Button
      className="flex justify-start text-xl"
      type="button"
      fullWidth
      icon={icon}
      onClick={handleClick}
      color={color}
    >
      {children}
    </Button>
  )
}

export default NavButton
