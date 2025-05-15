'use client'
import { useModalsStore } from '@/store/modals.store'
import { useUserStore } from '@/store/user.store'
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Navbar as NextNavbar,
  Switch,
  useDisclosure,
  User,
} from '@heroui/react'
import { useQueryClient } from '@tanstack/react-query'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { AiFillEdit } from 'react-icons/ai'
import { CiLogout } from 'react-icons/ci'

import { UserSettingsStore } from '@/store/userSettings.store'
import { FaMoon, FaPalette, FaUser } from 'react-icons/fa'
import { IoIosSettings } from 'react-icons/io'
import { LuSunMedium } from 'react-icons/lu'
import { useCloudinaryImage } from '../../../hooks/useCloudinaryImage'
import Logo from '../../shared/Logo'
import { useStore } from 'zustand'

function Header({ className }: { className?: string }) {
  const { setTheme, resolvedTheme } = useTheme()
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const queryClient = useQueryClient()

  const logout = useUserStore(state => state.logout)
  const logoutSettings = useStore(UserSettingsStore, state => state.logout)

  const currentUser = useStore(UserSettingsStore, state => state.current)
  const isAuth = currentUser != null

  const router = useRouter()

  const { getOptimizedUrl } = useCloudinaryImage({
    src: currentUser?.avatarUrl,
    width: 200,
  })

  const { openEditProfile, openSettings } = useModalsStore()

  const handleLogout = () => {
    logout()
    logoutSettings()
    router.push('/auth')
    queryClient.removeQueries()
  }

  return (
    <>
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
                    name={currentUser?.userName}
                  />
                </DropdownTrigger>
                <DropdownMenu aria-label="User Actions" variant="flat">
                  <DropdownSection showDivider>
                    <DropdownItem
                      key="profile"
                      onClick={() => router.push(`/users/${currentUser?.id}`)}
                      textValue="Мой профиль"
                      startContent={<FaUser />}
                    >
                      Мой профиль
                    </DropdownItem>
                    <DropdownItem
                      key="settings"
                      onClick={() =>
                        currentUser?.id && openSettings(currentUser.id)
                      }
                      textValue="Настройки"
                      startContent={<IoIosSettings />}
                    >
                      Настройки
                    </DropdownItem>
                    <DropdownItem
                      key="edit-profile"
                      onClick={() =>
                        currentUser?.id && openEditProfile(currentUser.id)
                      }
                      textValue="Редактировать профиль"
                      startContent={<AiFillEdit />}
                    >
                      Редактировать профиль
                    </DropdownItem>
                    <DropdownItem
                      key="theme"
                      isReadOnly
                      className="cursor-default"
                      startContent={<FaPalette />}
                      endContent={
                        <Switch
                          defaultSelected={resolvedTheme === 'light'}
                          onChange={e =>
                            setTheme(e.target.checked ? 'light' : 'dark')
                          }
                          color="primary"
                          size="sm"
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
                    startContent={<CiLogout className="text-large" />}
                    onClick={onOpen}
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
      </NextNavbar>

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
                <Button color="danger" variant="light" onClick={onClose}>
                  Отмена
                </Button>
                <Button color="primary" onClick={handleLogout}>
                  Да, выйти
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}

export default Header
