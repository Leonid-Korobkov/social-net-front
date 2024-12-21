import { Card } from '@nextui-org/react'
import { IconType } from 'react-icons'
import { Skeleton } from '@nextui-org/react'

interface CountInfoProps {
  Icon: IconType
  count: number
  title: string
  isLoading?: boolean
}

function CountInfo({ Icon, count, title, isLoading }: CountInfoProps) {
  return (
    <Card className="p-3">
      <div className="flex items-center gap-2">
        <Icon className="text-xl" />
        {isLoading ? (
          <div className="flex flex-col gap-1">
            <Skeleton className="h-4 w-16 rounded-lg" />
            <Skeleton className="h-3 w-12 rounded-lg" />
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <p className="font-bold text-primary">{count}</p>
            <p className="text-sm text-default-500">{title}</p>
          </div>
        )}
      </div>
    </Card>
  )
}

export default CountInfo
