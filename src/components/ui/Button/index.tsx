'use client'
import { Button as NextButton } from "@heroui/react"

export type TButtonColors =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger'

type Props = {
  children: React.ReactNode
  icon?: JSX.Element
  className?: string
  type?: 'button' | 'submit' | 'reset'
  fullWidth?: boolean
  onClick?: (e: React.MouseEvent) => void
  color?: TButtonColors
}

export const  Button: React.FC<Props> = ({
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
      variant="flat"
      className={className}
      type={type}
      fullWidth={fullWidth}
      onClick={onClick}
    >
      {children}
    </NextButton>
  )
}
