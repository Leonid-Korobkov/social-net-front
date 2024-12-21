import { Card, Skeleton } from '@nextui-org/react'
import { FaUsers } from 'react-icons/fa'
import { FiUsers } from 'react-icons/fi'
import CountInfo from '../CountInfo'
import CardSkeleton from '../CardSkeleton'

function UserProfileSkeleton() {
  return (
    <div>
      {/* GoBack скелетон */}
      <Skeleton className="w-20 h-6 rounded-lg" />

      <div className="flex lg:flex-row flex-col items-stretch gap-4 mt-10">
        {/* Левая карточка с аватаром */}
        <Card className="flex flex-col items-center text-center space-y-6 p-5 flex-2">
          <Skeleton className="rounded-xl w-[200px] h-[200px]" />
          <div className="flex flex-col gap-4 items-center w-full">
            <Skeleton className="h-6 w-32 rounded-lg" />
            <Skeleton className="h-9 w-40 rounded-lg" />
          </div>
        </Card>

        {/* Правая карточка с информацией */}
        <Card className="flex flex-col space-y-4 p-5 flex-1">
          {/* Информационные поля */}
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex flex-col gap-1">
              <Skeleton className="h-4 w-24 rounded-lg" />
              <Skeleton className="h-4 w-full rounded-lg" />
            </div>
          ))}

          {/* Блок с подписчиками и подписками */}
          <div className="flex gap-2 justify-center flex-wrap">
            <CountInfo Icon={FaUsers} count={0} title="Подписчики" isLoading />
            <CountInfo Icon={FiUsers} count={0} title="Подписки" isLoading />
          </div>
        </Card>
      </div>

      {/* Скелетоны постов */}
      <div className="w-full mt-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <CardSkeleton key={index} />
        ))}
      </div>
    </div>
  )
}

export default UserProfileSkeleton
