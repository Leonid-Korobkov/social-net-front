'use client'
import {
  User as NextUiUser,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@heroui/react'
import { useCloudinaryImage } from '../../../hooks/useCloudinaryImage'
import React, { useRef, useState } from 'react'
import UserPreviewPopover from './UserPreviewPopover'
import { useGetUserById } from '@/services/api/user.api'

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
  // Popover state
  const [showPopover, setShowPopover] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

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
  }
  const handleMouseLeave = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setIsOpen(false), 200)
  }

  return (
    <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <Popover isOpen={isOpen} showArrow>
        <PopoverTrigger>
          <span>
            <NextUiUser
              name={username}
              className={className}
              description={description}
              avatarProps={{ src: getOptimizedUrl() }}
            />
          </span>
        </PopoverTrigger>
        <PopoverContent className='p-0'>
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
