'use client'
import { FeedType } from '@/services/api/post.api'
import { UserSettingsStore } from '@/store/userSettings.store'
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@heroui/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { RiUserFollowFill } from 'react-icons/ri'
import { TbChevronDown, TbClock, TbEye, TbFlame } from 'react-icons/tb'
import { useStore } from 'zustand'

// Мапинг типов лент на их иконки и описания
const feedTypeInfo = {
  'for-you': {
    icon: <TbFlame className="text-orange-500" />,
    label: 'Для вас',
    description: 'Рекомендованные посты',
  },
  new: {
    icon: <TbClock className="text-blue-500" />,
    label: 'Новое',
    description: 'Самые свежие посты',
  },
  following: {
    icon: <RiUserFollowFill className="text-purple-500" />,
    label: 'Подписки',
    description: 'Посты от пользователей, на которых вы подписаны',
  },
  viewed: {
    icon: <TbEye className="text-green-500" />,
    label: 'Просмотренное',
    description: 'Посты, которые вы уже смотрели',
  },
}

function FeedTypeDropdown({
  currentFeedType,
  onFeedTypeChange,
}: {
  currentFeedType: FeedType | null
  onFeedTypeChange?: (feedType: FeedType) => void
}) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Получение типа ленты из URL или Zustand
  const urlFeedType = searchParams.get('feed') as FeedType | null

  const feedTypeFromStore = useStore(
    UserSettingsStore,
    state => state.feedType as FeedType
  )
  const setFeedTypeToStore = useStore(
    UserSettingsStore,
    state => state.setFeedType
  )

  // Приоритет: URL >  хранилище > переданный параметр > значение по умолчанию
  const initialFeedType =
    urlFeedType || feedTypeFromStore || currentFeedType || 'new'
  const [feedType, setFeedType] = useState<FeedType>(initialFeedType)

  // Обновление URL и Zustand при первой загрузке
  useEffect(() => {
    // Обновляем URL
    const params = new URLSearchParams(searchParams.toString())

    params.set('feed', feedType)

    // Обновляем Zustand
    setFeedTypeToStore(feedType)

    // Вызываем колбэк если он передан
    if (onFeedTypeChange) {
      onFeedTypeChange(feedType)
    }
  }, [])

  // Обработчик изменения типа ленты
  const handleFeedTypeChange = (feedKey: string | number | null) => {
    if (feedKey) {
      const newFeedType = feedKey.toString() as FeedType

      // Обновляем URL
      const params = new URLSearchParams(searchParams.toString())
      params.set('feed', newFeedType)
      const newUrl = params.toString() ? `?${params.toString()}` : ''
      router.replace(`${newUrl}`, { scroll: false })

      // Обновляем Zustand
      setFeedTypeToStore(newFeedType)

      // Вызываем колбэк если он передан
      if (onFeedTypeChange) {
        onFeedTypeChange(newFeedType)
      }

      setFeedType(newFeedType)
    }
  }

  return (
    <div className="">
      <Dropdown>
        <DropdownTrigger>
          <Button
            variant="flat"
            className="px-4 py-2 rounded-full border border-default-200 bg-content1 flex items-center gap-2 hover:bg-default-200/70 transition-colors"
          >
            {feedTypeInfo[feedType].icon}
            <span className="font-medium">{feedTypeInfo[feedType].label}</span>
            <div className="w-6 h-6 rounded-full border border-default-300 flex items-center justify-center ml-1">
              <TbChevronDown size={14} />
            </div>
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          variant="flat"
          aria-label="Выберите тип ленты"
          onAction={handleFeedTypeChange}
          selectedKeys={[feedType]}
        >
          <DropdownItem
            key="for-you"
            startContent={feedTypeInfo['for-you'].icon}
            description={feedTypeInfo['for-you'].description}
          >
            {feedTypeInfo['for-you'].label}
          </DropdownItem>
          <DropdownItem
            key="new"
            startContent={feedTypeInfo['new'].icon}
            description={feedTypeInfo['new'].description}
          >
            {feedTypeInfo['new'].label}
          </DropdownItem>
          <DropdownItem
            key="following"
            startContent={feedTypeInfo['following'].icon}
            description={feedTypeInfo['following'].description}
          >
            {feedTypeInfo['following'].label}
          </DropdownItem>
          <DropdownItem
            key="viewed"
            startContent={feedTypeInfo['viewed'].icon}
            description={feedTypeInfo['viewed'].description}
          >
            {feedTypeInfo['viewed'].label}
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  )
}

export default FeedTypeDropdown
