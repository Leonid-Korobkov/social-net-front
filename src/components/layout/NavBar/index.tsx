'use client'
import { UserSettingsStore } from '@/store/userSettings.store'
import { FaUsers } from 'react-icons/fa'
import { FaRegSquarePlus, FaUser } from 'react-icons/fa6'
import { GoHomeFill } from 'react-icons/go'
import { IoSearch } from 'react-icons/io5'
import { RiUserFollowFill } from 'react-icons/ri'
import { useActiveNavLink } from '../../../hooks/useActiveNavLink'
import NavButton from '../../shared/NavButton'
import { useStore } from 'zustand'

interface NavBarProps {
  onCreatePost: () => void
}

function NavBar({ onCreatePost }: NavBarProps) {
  const currentUser = useStore(UserSettingsStore, state => state.current)

  const isActive = useActiveNavLink

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
      label: 'Создать пост',
      onClick: onCreatePost,
    },
    {
      path: `/${currentUser?.id}/following`,
      icon: RiUserFollowFill,
      label: 'Подписки',
    },
    {
      path: `/${currentUser?.id}/followers`,
      icon: FaUsers,
      label: 'Подписчики',
    },
    {
      path: `/${currentUser?.userName}`,
      icon: FaUser,
      label: 'Профиль',
    },
  ]

  return (
    <nav className="flex flex-col gap-2">
      <ul className="flex gap-2 flex-col">
        {navItems.map(({ path, icon: Icon, label, onClick }) => (
          <li className="flex flex-col gap-5" key={path}>
            <NavButton
              href={path}
              icon={<Icon />}
              isActive={isActive(path)}
              onClick={onClick}
            >
              {label}
            </NavButton>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default NavBar
