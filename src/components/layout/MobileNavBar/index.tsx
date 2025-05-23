'use client'
import { UserSettingsStore } from '@/store/userSettings.store'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FaRegSquarePlus, FaUser } from 'react-icons/fa6'
import { GoHomeFill } from 'react-icons/go'
import { IoSearch } from 'react-icons/io5'
import { useActiveNavLink } from '../../../hooks/useActiveNavLink'
import { useStore } from 'zustand'

interface MobileNavBarProps {
  onCreatePost: () => void
}

function MobileNavBar({ onCreatePost }: MobileNavBarProps) {
  const pathname = usePathname()
  const currentUser = useStore(UserSettingsStore, state => state.current)

  const isActive = useActiveNavLink

  const handleClick = (
    e: React.MouseEvent,
    path: string,
    onClick?: () => void
  ) => {
    if (onClick) {
      e.preventDefault()
      onClick()
      return
    }

    if (pathname === path) {
      e.preventDefault()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const navItems = [
    {
      path: '/',
      icon: GoHomeFill,
      label: 'Посты',
    },
    {
      path: '/search',
      icon: IoSearch,
      label: 'Поиск',
    },
    {
      path: '/create-post',
      icon: FaRegSquarePlus,
      label: 'Создать',
    },
    {
      path: `/${currentUser?.userName}`,
      icon: FaUser,
      label: 'Профиль',
    },
  ]

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 bg-background border-t border-divider lg:hidden z-50
      backdrop-blur-lg backdrop-saturate-150 bg-background/70"
    >
      <div className="flex justify-around items-center h-16">
        {navItems.map(({ path, icon: Icon, label }) => (
          <Link
            key={path}
            href={path}
            onClick={e => handleClick(e, path)}
            className={`flex flex-col items-center gap-1 p-2 ${
              isActive(path) ? 'text-primary' : 'text-foreground'
            }`}
            title={label}
          >
            <Icon className="text-2xl" />
          </Link>
        ))}
      </div>
    </nav>
  )
}

export default MobileNavBar
