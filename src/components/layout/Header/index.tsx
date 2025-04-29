'use client'
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
  Dropdown,
  DropdownTrigger,
  User,
  DropdownMenu,
  DropdownItem,
  DropdownSection,
} from '@heroui/react'
import { useTheme } from 'next-themes'
import { FaMoon } from 'react-icons/fa'
import { LuSunMedium } from 'react-icons/lu'
import { useRouter } from 'next/navigation'
import { CiLogout } from 'react-icons/ci'
import { useState } from 'react'
import { useCloudinaryImage } from '../../../hooks/useCloudinaryImage'
import Link from 'next/link'
import Logo from '../../shared/Logo'
import { useUserStore } from '@/store/user.store'
import { useQueryClient } from '@tanstack/react-query'

function Header({ className }: { className?: string }) {
  const { setTheme, resolvedTheme } = useTheme()
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const queryClient = useQueryClient()

  const logout = useUserStore.use.logout()
  const currentUser = useUserStore.use.current()
  const isAuth = useUserStore.use.isAuthenticated()

  const router = useRouter()

  const { getOptimizedUrl } = useCloudinaryImage({
    src: currentUser?.avatarUrl,
    width: 200,
  })

  const handleLogout = () => {
    router.push('/auth')
    queryClient.removeQueries()
    logout()
  }

  return (
    <NextNavbar
      className=""
      maxWidth="xl"
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
    >
      <NavbarContent>
        <NavbarBrand>
          <Link href="/">
            <Logo />
          </Link>
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem>
          {isAuth ? (
            <Dropdown placement="bottom-start">
              <DropdownTrigger>
                <User
                  as="button"
                  avatarProps={{
                    isBordered: true,
                    src: getOptimizedUrl(),
                  }}
                  className="transition-transform [&>span]:order-1 [&>div]:items-end"
                  description={currentUser?.email}
                  name={currentUser?.name}
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="User Actions" variant="flat">
                <DropdownSection showDivider>
                  <DropdownItem key="user" className="h-14 gap-2">
                    <p className="font-light">Вы вошли как</p>
                    <p className="font-bold">{currentUser?.name}</p>
                  </DropdownItem>
                  <DropdownItem
                    key="profile"
                    onPress={() => router.push(`/users/${currentUser?.id}`)}
                    textValue="Мой профиль"
                  >
                    Мой профиль
                  </DropdownItem>
                  <DropdownItem
                    key="theme"
                    isReadOnly
                    className="cursor-default"
                    endContent={
                      <Switch
                        defaultSelected={resolvedTheme === 'light'}
                        onChange={e =>
                          setTheme(e.target.checked ? 'light' : 'dark')
                        }
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
                    }
                  >
                    Тема
                  </DropdownItem>
                </DropdownSection>
                <DropdownItem
                  key="logout"
                  color="danger"
                  endContent={<CiLogout className="text-large" />}
                  onPress={onOpen}
                >
                  Выйти
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          ) : (
            <Switch
              defaultSelected={resolvedTheme === 'light'}
              onChange={e => setTheme(e.target.checked ? 'light' : 'dark')}
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
          )}
        </NavbarItem>
      </NavbarContent>
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
