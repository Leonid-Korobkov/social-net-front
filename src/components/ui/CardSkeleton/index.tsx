import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Skeleton,
} from "@heroui/react"

function CardSkeleton() {
  return (
    <Card className="mb-5">
      <CardHeader className="justify-between items-center bg-transparent">
        <div className="flex gap-2 items-center w-full">
          <Skeleton className="rounded-full w-10 h-10" /> {/* Аватар */}
          <div className="flex flex-1 flex-col gap-2">
            <Skeleton className="h-3 w-24 rounded-lg" /> {/* Имя */}
            <Skeleton className="h-3 w-40 rounded-lg" /> {/* Дата */}
          </div>
          <Skeleton className="rounded-md w-4 h-6" /> {/* Аватар */}
        </div>
      </CardHeader>

      <CardBody className="px-3 py-2 mb-5">
        <div className="space-y-3">
          <Skeleton className="w-3/4 h-3 rounded-lg" /> {/* Контент */}
          <Skeleton className="w-full h-3 rounded-lg" />
          <Skeleton className="w-2/3 h-3 rounded-lg" />
        </div>
      </CardBody>

      <CardFooter className="gap-3">
        <div className="flex gap-5 items-center">
          <div className="flex items-center gap-1">
            <Skeleton className="w-6 h-3 rounded-lg" />{' '}
            {/* Количество лайков */}
            <Skeleton className="w-6 h-6 rounded-lg" /> {/* Иконка лайка */}
          </div>
          <div className="flex items-center gap-1">
            <Skeleton className="w-6 h-3 rounded-lg" />{' '}
            {/* Количество комментариев */}
            <Skeleton className="w-6 h-6 rounded-lg" />{' '}
            {/* Иконка комментариев */}
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}

export default CardSkeleton
