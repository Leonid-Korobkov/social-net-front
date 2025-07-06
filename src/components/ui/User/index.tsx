'use client'
import {
  User as NextUiUser,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@heroui/react'
import { useCloudinaryImage } from '../../../hooks/useCloudinaryImage'
import React, { useRef, useState, useEffect } from 'react'
import UserPreviewPopover from './UserPreviewPopover'
import { useGetUserById } from '@/services/api/user.api'
import { FaPlus } from 'react-icons/fa6'
import { useTouchDevice } from '@/hooks/useTouchDevice'
import { useTopLoader } from 'nextjs-toploader'
import Link from 'next/link'

interface IUser {
  username: string
  avatarUrl: string
  description?: string | React.ReactNode
  className?: string
}

function User({
  username = '',
  description = '',
  avatarUrl = '',
  className = '',
}: IUser) {
  const { getOptimizedUrl } = useCloudinaryImage({
    src: avatarUrl,
    width: 200,
  })
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const topLoader = useTopLoader()

  // Состояние: открыт ли popover по кнопке
  const [wasOpenedByButton, setWasOpenedByButton] = useState(false)

  // Получаем данные пользователя только при наведении
  const [isOpen, setIsOpen] = useState(false)
  const {
    data: userData,
    refetch: refetchUser,
    isLoading: isLoadingUser,
  } = useGetUserById(username, false)

  // Обработчики наведения
  const handleMouseEnter = () => {
    refetchUser()
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setIsOpen(true), 300)
    setWasOpenedByButton(false)
  }
  const handleMouseLeave = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      setIsOpen(false)
      setWasOpenedByButton(false)
    }, 200)
  }

  // Ref для popover-обёртки
  const popoverWrapperRef = useRef<HTMLDivElement>(null)

  // Глобальный обработчик клика вне popover
  useEffect(() => {
    if (!isOpen) return
    function handleClickOutside(event: MouseEvent) {
      if (
        popoverWrapperRef.current &&
        !popoverWrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
        setWasOpenedByButton(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [isOpen])

  return (
    <div
      className="relative inline-block"
      onMouseLeave={handleMouseLeave}
      ref={popoverWrapperRef}
    >
      <Popover
        isOpen={isOpen}
        showArrow
        backdrop={wasOpenedByButton ? 'opaque' : 'transparent'}
        classNames={{
          base: ['before:bg-default-200'],
          content: [
            'py-3 px-4 border border-default-200',
            'bg-gradient-to-br from-white to-default-300',
            'dark:from-default-100 dark:to-default-50',
          ],
        }}
      >
        <PopoverTrigger>
          <span className="relative">
            <NextUiUser
              name={
                <Link
                  href={`/${username}`}
                  className="user-nickname cursor-pointer hover:underline"
                  onMouseEnter={handleMouseEnter}
                  prefetch={false}
                >
                  {username}
                </Link>
              }
              className={className}
              description={description}
              avatarProps={{
                src: getOptimizedUrl(),
                onClick: (e: React.MouseEvent) => {
                  setTimeout(() => {
                    topLoader.done(true)
                  }, 0)
                  refetchUser()
                  e.stopPropagation()
                  e.preventDefault()
                  setWasOpenedByButton(true)
                  setIsOpen(true)
                },
                style: { cursor: 'pointer' },
              }}
            />
            <button
              type="button"
              aria-label="Открыть меню пользователя"
              className="absolute bottom-1 left-4 translate-x-1/4 translate-y-1/4 bg-foreground text-content1 rounded-full w-5 h-5 flex items-center justify-center border-2 border-content1 hover:scale-110 focus:outline-none z-10 ease-in transition-transform duration-150"
              style={{ fontSize: 12 }}
              onClick={e => {
                setTimeout(() => {
                  topLoader.done(true)
                }, 0)
                refetchUser()
                e.stopPropagation()
                e.preventDefault()
                setWasOpenedByButton(true)
                setIsOpen(true)
              }}
              tabIndex={0}
            >
              <FaPlus size={10} />
            </button>
          </span>
        </PopoverTrigger>
        <PopoverContent className="p-0">
          <UserPreviewPopover
            isLoading={isLoadingUser}
            username={userData?.userName}
            name={userData?.name}
            isFollowing={userData?.isFollowing}
            avatarUrl={userData?.avatarUrl || ''}
            description={userData?.bio || ''}
            followers={userData?._count?.followers || 0}
            following={userData?._count?.following || 0}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default User
