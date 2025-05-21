'use client'
import { FeedType } from '@/services/api/post.api'
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@heroui/react'
import { JSX } from 'react'
import {
  TbChevronDown,
  TbClock,
  TbEye,
  TbHeart,
  TbHistory,
  TbSortAscending,
  TbSortDescending,
} from 'react-icons/tb'

const sortOptionsMap: Record<
  string,
  { label: string; for: FeedType[]; icon: JSX.Element; orderable?: boolean }
> = {
  newest: {
    label: 'Сначала новые посты',
    for: ['new', 'following', 'viewed'],
    icon: <TbClock />,
    orderable: false,
  },
  oldest: {
    label: 'Сначала старые посты',
    for: ['new', 'following', 'viewed'],
    icon: <TbHistory />,
    orderable: false,
  },
  likes: {
    label: 'По лайкам',
    for: ['new', 'following'],
    icon: <TbHeart />,
    orderable: true,
  },
  views: {
    label: 'По просмотрам',
    for: ['new', 'following'],
    icon: <TbEye />,
    orderable: true,
  },
  viewed_newest: {
    label: 'Недавно просмотренные',
    for: ['viewed'],
    icon: <TbClock />,
    orderable: false,
  },
  viewed_oldest: {
    label: 'Давно просмотренные',
    for: ['viewed'],
    icon: <TbHistory />,
    orderable: false,
  },
}

function SortDropdown({
  sort,
  onSortChange,
  feedType,
  sortOrder,
  onSortOrderToggle,
}: {
  sort: string
  onSortChange: (sort: string) => void
  feedType: FeedType
  sortOrder: 'asc' | 'desc'
  onSortOrderToggle: () => void
}) {
  const options = Object.entries(sortOptionsMap).filter(([, v]) =>
    v.for.includes(feedType)
  )
  return (
    <div className="">
      <Dropdown>
        <DropdownTrigger>
          <Button
            variant="flat"
            className="px-4 py-2 rounded-full border border-default-200 bg-content1 flex items-center gap-2 hover:bg-default-200/70 transition-colors"
          >
            {sortOptionsMap[sort]?.icon}
            {sortOptionsMap[sort]?.label || 'Сортировка'}
            {/* Для likes/views показываем стрелку */}
            {sortOptionsMap[sort]?.orderable && (
              <span
                onClick={e => {
                  e.stopPropagation()
                  onSortOrderToggle()
                }}
                className="w-6 h-6 rounded-full border border-default-300 flex items-center justify-center ml-1 hover:border-default-700  hover:bg-default-200/90 transition-colors"
              >
                {sortOrder === 'desc' ? (
                  <TbSortDescending />
                ) : (
                  <TbSortAscending />
                )}
              </span>
            )}
            <div className="w-6 h-6 rounded-full border border-default-300 flex items-center justify-center ml-1">
              <TbChevronDown size={14} />
            </div>
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          variant="flat"
          aria-label="Выберите сортировку"
          onAction={key => onSortChange(key as string)}
          selectedKeys={[sort]}
        >
          {options.map(([key, v]) => (
            <DropdownItem key={key} startContent={v.icon}>
              {v.label}
              {v.orderable && (
                <span className="ml-1 inline-block align-middle text-xs opacity-60">
                  {sort === key ? (
                    sortOrder === 'desc' ? (
                      <TbSortDescending />
                    ) : (
                      <TbSortAscending />
                    )
                  ) : null}
                </span>
              )}
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
    </div>
  )
}
export default SortDropdown
