'use client'
import { Card, CardHeader, CardBody, Skeleton } from '@heroui/react'

function ProfileSkeleton() {
  return (
    <Card className="py-5 w-[300px]">
      <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
        <Skeleton className="w-full min-w-full aspect-square rounded-lg" />
      </CardHeader>
      <CardBody className="overflow-visible py-2 flex flex-col gap-3">
        <Skeleton className="h-6 w-32 rounded-lg" />
        <Skeleton className="h-4 w-24 rounded-lg" />
      </CardBody>
    </Card>
  )
}

export default ProfileSkeleton