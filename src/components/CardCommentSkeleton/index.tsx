import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Skeleton,
} from '@nextui-org/react'

function CardCommentSkeleton() {
  return (
    <Card className="mb-5">
      <CardHeader className="justify-between items-center bg-transparent">
        <div className="flex gap-3 items-center">
          <Skeleton className="rounded-full w-12 h-12" /> {/* Аватар */}
          <div className="flex flex-col gap-2">
            <Skeleton className="h-3 w-24 rounded-lg" /> {/* Имя */}
          </div>
        </div>
      </CardHeader>

      <CardBody className="px-3 py-2 mb-5">
        <div className="space-y-3">
          <Skeleton className="w-3/4 h-3 rounded-lg" /> {/* Контент */}
          <Skeleton className="w-full h-3 rounded-lg" />
          <Skeleton className="w-2/3 h-3 rounded-lg" />
        </div>
      </CardBody>
    </Card>
  )
}

export default CardCommentSkeleton
