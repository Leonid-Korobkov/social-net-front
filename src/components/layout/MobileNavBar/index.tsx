'use client'
import { usePathname } from 'next/navigation'
import { IoSearch } from 'react-icons/io5'
import { useActiveNavLink } from '../../../hooks/useActiveNavLink'
import { FaRegSquarePlus, FaUser } from 'react-icons/fa6'
import { GoHomeFill } from 'react-icons/go'
import Link from 'next/link'
import { useUserStore } from '@/store/user.store'

interface MobileNavBarProps {
  onCreatePost: () => void
}

function MobileNavBar({ onCreatePost }: MobileNavBarProps) {
  const pathname = usePathname()
  const currentUser = useUserStore.use.current()

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
      path: '#',
      icon: FaRegSquarePlus,
      label: 'Создать',
      onClick: onCreatePost,
    },
    {
      path: `/users/${currentUser?.id}`,
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
        {navItems.map(({ path, icon: Icon, label, onClick }) => (
          <Link
            key={path}
            href={path}
            onClick={e => handleClick(e, path, onClick)}
            className={`flex flex-col items-center gap-1 p-2 ${
              isActive(path) ? 'text-secondary' : 'text-foreground'
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
