'use client'
import { Card, Skeleton } from '@heroui/react'
import { FaUsers } from 'react-icons/fa'
import { FiUsers } from 'react-icons/fi'
import CountInfo from '../CountInfo'
import CardSkeleton from '../CardSkeleton'
import { BsPostcardFill } from 'react-icons/bs'

function UserProfileSkeleton() {
  return (
    <div>
      {/* GoBack скелетон */}
      <Skeleton className="w-20 h-6 rounded-lg" />

      <div className="flex lg:flex-row flex-col items-stretch gap-4 mt-10">
        {/* Левая карточка с аватаром */}
        <Card className="flex flex-col items-center text-center space-y-6 p-5 flex-2 min-h-[200px] min-w-[200px] lg:min-h-[300px] lg:min-w-[300px]">
          <Skeleton className="lg:max-w-[300px] lg:max-h-[300px] max-w-[200px] max-h-[200px] aspect-square w-full rounded-xl" />
          <div className="flex flex-col gap-4 items-center w-full">
            <Skeleton className="h-6 w-32 rounded-lg" />
            <Skeleton className="h-9 w-40 rounded-lg" />
          </div>
        </Card>

        {/* Правая карточка с информацией */}
        <Card className="flex flex-col space-y-4 p-5 flex-1">
          {/* Блок с подписчиками и подписками */}
          <Card className="flex gap-2 justify-center flex-row flex-wrap mb-2">
            <CountInfo Icon={BsPostcardFill} title="Публикации" isLoading />
            <CountInfo Icon={FaUsers} title="Подписчики" isLoading />
            <CountInfo Icon={FiUsers} title="Подписки" isLoading />
          </Card>
          {/* Информационные поля */}
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex flex-col gap-1">
              <Skeleton className="h-4 w-24 rounded-lg" />
              <Skeleton className="h-4 w-full rounded-lg" />
            </div>
          ))}
          <div className="flex gap-2 justify-center flex-wrap"></div>
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
