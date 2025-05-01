'use client'
import { Card, CardBody, Skeleton } from '@heroui/react'

function FollowSkeleton() {
  return (
    <div className="">
      {/* GoBack скелетон */}
      <Skeleton className="w-20 h-6 rounded-lg" />

      {/* Заголовок */}
      <Skeleton className="w-48 h-8 rounded-lg mt-10 mb-5" />

      {/* Список пользователей */}
      <div className="space-y-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <Card key={index}>
            <CardBody className="flex justify-between flex-row items-center">
              <div className="flex items-center gap-4">
                {/* Аватар */}
                <Skeleton className="w-10 h-10 rounded-full" />

                <div className="space-y-2">
                  {/* Имя пользователя */}
                  <Skeleton className="w-32 h-4 rounded-lg" />
                  {/* Описание */}
                  <Skeleton className="w-24 h-3 rounded-lg" />
                </div>
              </div>

              {/* Кнопка подписки */}
              <Skeleton className="w-28 h-9 rounded-xl" />
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default FollowSkeleton
