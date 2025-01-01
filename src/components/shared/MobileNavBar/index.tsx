import { Link, useLocation } from 'react-router-dom'
import { BsPostcard } from 'react-icons/bs'
import { FiUsers } from 'react-icons/fi'
import { FaUsers } from 'react-icons/fa'
import { CgProfile } from 'react-icons/cg'
import { IoSearch } from 'react-icons/io5'
import { useSelector } from 'react-redux'
import { selectCurrent } from '../../../features/user/user.slice'
import { useActiveNavLink } from '../../../hooks/useActiveNavLink'

function MobileNavBar() {
  const location = useLocation()
  const currentUser = useSelector(selectCurrent)

  const isActive = useActiveNavLink

  const handleClick = (e: React.MouseEvent, path: string) => {
    if (location.pathname === path) {
      e.preventDefault()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

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
      path: `/users/${currentUser?.id}/following`,
      icon: FiUsers,
      label: 'Подписки',
    },
    {
      path: `/users/${currentUser?.id}/followers`,
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
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-divider lg:hidden z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map(({ path, icon: Icon, label }) => (
          <Link
            key={path}
            to={path}
            onClick={e => handleClick(e, path)}
            className={`flex flex-col items-center gap-1 ${
              isActive(path) ? 'text-secondary' : 'text-foreground'
              }`}
            title={label}
          >
            <Icon className="text-xl" />
            <span className="text-xs">{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  )
}

export default MobileNavBar
