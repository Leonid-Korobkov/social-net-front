import { useNavigate } from 'react-router-dom'
import { Button } from '../Button'

interface NavButtonProps {
  children: React.ReactNode
  icon?: JSX.Element
  href: string
}

function NavButton({ children, icon, href }: NavButtonProps) {
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
    >
      {children}
    </Button>
  )
}

export default NavButton
