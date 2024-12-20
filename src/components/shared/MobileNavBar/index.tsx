import { Link, useLocation } from 'react-router-dom'
import { BsPostcard } from 'react-icons/bs'
import { FiUsers } from 'react-icons/fi'
import { FaUsers } from 'react-icons/fa'
import { CgProfile } from 'react-icons/cg'
import { useSelector } from 'react-redux'
import { selectCurrent } from '../../../features/user/user.slice'

function MobileNavBar() {
  const location = useLocation()
  const currentUser = useSelector(selectCurrent)

  const isActive = (path: string) => {
    return location.pathname === path
  }

  const navItems = [
    {
      path: '/',
      icon: BsPostcard,
      label: 'Посты',
    },
    {
      path: '/following',
      icon: FiUsers,
      label: 'Подписки',
    },
    {
      path: '/followers',
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
            className={`flex flex-col items-center gap-1 ${
              isActive(path) ? 'text-secondary' : 'text-foreground'
            }`}
          >
            {/* <Button
              startContent={<Icon />}
              size="sm"
              color={isActive(path) ? 'secondary' : 'default'}
              variant="flat"
              className="flex p-2 min-h-[50px] gap-1 [&>svg]:w-[16px] [&>svg]:h-[16px] flex-col text-xs pointer-events-none"
              type="button"
              fullWidth={true}
            >
              {label}
            </Button> */}
            <Icon className="text-xl" />
            <span className="text-xs">{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  )
}

export default MobileNavBar
