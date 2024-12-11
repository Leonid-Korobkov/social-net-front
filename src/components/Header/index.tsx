import {
  Button,
  Image,
  Navbar as NextNavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Switch,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  NavbarMenuToggle,
  NavbarMenu,
} from '@nextui-org/react'
import { useTheme } from 'next-themes'
import { FaMoon, FaUser } from 'react-icons/fa'
import { LuSunMedium } from 'react-icons/lu'
// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import { useDispatch, useSelector } from 'react-redux'
import {
  logout,
  selectCurrent,
  selectIsAuthenticated,
} from '../../features/user/user.slice'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { CiLogout } from 'react-icons/ci'
import { useEffect, useState } from 'react'
import NavBar from '../NavBar'
import NavButton from '../NavButton'

function Header({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme()

  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  const isAuth = useSelector(selectIsAuthenticated)
  const currentUser = useSelector(selectCurrent)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(logout())
    localStorage.removeItem('token')
    navigate('/auth')
  }

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setIsMenuOpen(false)
  }, [location])

  return (
    <NextNavbar
      className=""
      maxWidth="xl"
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
    >
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          className="lg:hidden"
        />
        <NavbarBrand>
          <Link to="/">
            <Image
              src={
                theme === 'dark'
                  ? '/assets/Zling-logo-white.svg'
                  : '/assets/Zling-logo-black.svg'
              }
              height={60}
            />
          </Link>
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem>
          <Switch
            defaultSelected={theme === 'dark'}
            onChange={e => setTheme(e.target.checked ? 'dark' : 'light')}
            color="primary"
            size="md"
            thumbIcon={({ isSelected, className }) =>
              isSelected ? (
                <LuSunMedium className={className} />
              ) : (
                <FaMoon className={className} />
              )
            }
          ></Switch>
        </NavbarItem>
        <NavbarItem>
          {isAuth && (
            <Button
              color="default"
              variant="flat"
              className="gap-2"
              onClick={onOpen}
            >
              <CiLogout /> <span>Выйти</span>
            </Button>
          )}
        </NavbarItem>
      </NavbarContent>
      <NavbarMenu>
        <NavBar />
        <NavButton
          href={`/users/${currentUser?.id}`}
          icon={<FaUser />}
          color={'primary'}
        >
          Мой профиль
        </NavButton>
      </NavbarMenu>
      <Modal
        isOpen={isOpen}
        scrollBehavior={'inside'}
        onOpenChange={onOpenChange}
        backdrop="blur"
      >
        <ModalContent>
          {onClose => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Вы уверены, что хотите выйти из аккаунта?
              </ModalHeader>
              <ModalBody></ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Отмена
                </Button>
                <Button color="primary" onPress={handleLogout}>
                  Да, выйти
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </NextNavbar>
  )
}

export default Header
