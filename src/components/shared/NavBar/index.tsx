import { BsPostcard } from 'react-icons/bs'
import { FiUsers } from 'react-icons/fi'
import { FaUsers } from 'react-icons/fa'
import { CgProfile } from 'react-icons/cg'
import { IoSearch } from 'react-icons/io5'
import { IoMdAdd } from 'react-icons/io'
import { useSelector } from 'react-redux'
import { selectCurrent } from '../../../features/user/user.slice'
import NavButton from '../NavButton'
import { useLocation } from 'react-router-dom'
import { useActiveNavLink } from '../../../hooks/useActiveNavLink'

interface NavBarProps {
  onCreatePost: () => void
}

function NavBar({ onCreatePost }: NavBarProps) {
  const currentUser = useSelector(selectCurrent)
  const location = useLocation()

  const isActive = useActiveNavLink

  const navItems = [
    {
      path: '/',
      icon: BsPostcard,
      label: 'Посты',
    },
    {
      path: '/search',
      icon: IoSearch,
      label: 'Поиск',
    },
    {
      path: '#',
      icon: IoMdAdd,
      label: 'Создать пост',
      onClick: onCreatePost,
    },
    {
      path: `users/${currentUser?.id}/following`,
      icon: FiUsers,
      label: 'Подписки',
    },
    {
      path: `users/${currentUser?.id}/followers`,
      icon: FaUsers,
      label: 'Подписчики',
    },
    {
      path: `/users/${currentUser?.id}`,
      icon: CgProfile,
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
