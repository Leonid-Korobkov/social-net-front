import { Card, CardHeader, Skeleton } from "@heroui/react"

function CreateCommentSkeleton() {
  return (
    <>
      <Card className="flex-grow min-h-[120px]">
        <CardHeader className="justify-between items-center bg-transparent">
          <div className="flex gap-3 items-center">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-3 w-24 rounded-lg" />
              <Skeleton className="h-3 w-40 rounded-lg" />
            </div>
          </div>
        </CardHeader>
      </Card>
      <div className="flex justify-start mt-5">
        <Skeleton className="w-28 h-10 rounded-xl" />
      </div>
    </>
  )
}

export default CreateCommentSkeleton
