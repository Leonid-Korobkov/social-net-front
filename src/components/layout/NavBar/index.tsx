'use client'
import { FaUsers } from 'react-icons/fa'
import { IoSearch } from 'react-icons/io5'
import NavButton from '../../shared/NavButton'
import { useActiveNavLink } from '../../../hooks/useActiveNavLink'
import { FaRegSquarePlus, FaUser } from 'react-icons/fa6'
import { GoHomeFill } from 'react-icons/go'
import { RiUserFollowFill } from 'react-icons/ri'
import { useUserStore } from '@/store/user.store'

interface NavBarProps {
  onCreatePost: () => void
}

function NavBar({ onCreatePost }: NavBarProps) {
  const currentUser = useUserStore.use.current()

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
      path: `/users/${currentUser?.id}/following`,
      icon: RiUserFollowFill,
      label: 'Подписки',
    },
    {
      path: `/users/${currentUser?.id}/followers`,
      icon: FaUsers,
      label: 'Подписчики',
    },
    {
      path: `/users/${currentUser?.id}`,
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
