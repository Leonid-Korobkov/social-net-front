import { Button as NextButton } from '@nextui-org/react'

type Props = {
  children: React.ReactNode
  icon?: JSX.Element
  className?: string
  type?: 'button' | 'submit' | 'reset'
  fullWidth?: boolean
  onClick: () => void
  color?:
    | 'default'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'danger'
    | undefined
}

export const Button: React.FC<Props> = ({
  children,
  icon,
  className,
  type,
  fullWidth,
  color,
  onClick,
}) => {
  return (
    <NextButton
      startContent={icon}
      size="lg"
      color={color}
      variant="light"
      className={className}
      type={type}
      fullWidth={fullWidth}
      onClick={onClick}
    >
      {children}
    </NextButton>
  )
}
