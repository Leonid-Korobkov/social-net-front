'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useTheme } from 'next-themes'

import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Navbar as NextNavbar,
  Switch,
  User,
  useDisclosure,
} from '@heroui/react'

import { AiFillEdit } from 'react-icons/ai'
import { CiLogout } from 'react-icons/ci'
import { FaMoon, FaPalette, FaUser } from 'react-icons/fa'
import { IoIosSettings } from 'react-icons/io'
import { LuSunMedium } from 'react-icons/lu'

import Logo from '../../shared/Logo'
import { useAuth } from '@/hooks/useAuth'
import { useCloudinaryImage } from '@/hooks/useCloudinaryImage'

function Header({ className }: { className?: string }) {
  const { setTheme, resolvedTheme } = useTheme()
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const { user, handleLogout, isAuthenticated } = useAuth()
  const router = useRouter()

  const { getOptimizedUrl } = useCloudinaryImage({
    src: user?.avatarUrl,
    width: 200,
  })

  const isDisabled = !user?.isEmailVerified

  return (
    <>
      <NextNavbar
        className={className}
        maxWidth="xl"
        isMenuOpen={isMenuOpen}
        onMenuOpenChange={setIsMenuOpen}
      >
        <NavbarContent>
          <NavbarBrand>
            <Link href={isAuthenticated ? '/' : '/auth'}>
              <Logo />
            </Link>
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent justify="end">
          <NavbarItem>
            <Dropdown placement="bottom-start">
              <DropdownTrigger>
                <User
                  as="button"
                  avatarProps={{
                    isBordered: true,
                    src: getOptimizedUrl(),
                  }}
                  className="transition-transform [&>span]:order-1 [&>div]:items-end"
                  description={user?.email}
                  name={user?.userName}
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="User Actions" variant="flat">
                <DropdownSection showDivider>
                  <DropdownItem
                    key="profile"
                    onClick={() => router.push(`/${user?.userName}`)}
                    textValue="Мой профиль"
                    startContent={<FaUser />}
                    isDisabled={isDisabled}
                  >
                    Мой профиль
                  </DropdownItem>
                  <DropdownItem
                    key="settings"
                    onClick={() =>
                      user?.userName &&
                      router.push(`/${user.userName}/settings`)
                    }
                    textValue="Настройки"
                    startContent={<IoIosSettings />}
                    isDisabled={isDisabled}
                  >
                    Настройки
                  </DropdownItem>
                  <DropdownItem
                    key="edit-profile"
                    onClick={() =>
                      user?.userName && router.push(`/${user.userName}/edit`)
                    }
                    textValue="Редактировать профиль"
                    startContent={<AiFillEdit />}
                    isDisabled={isDisabled}
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
                      />
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
                  isDisabled={isDisabled}
                >
                  Выйти
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </NavbarItem>
        </NavbarContent>
      </NextNavbar>

      <Modal
        isOpen={isOpen}
        scrollBehavior="inside"
        onOpenChange={onOpenChange}
        backdrop="blur"
      >
        <ModalContent>
          {onClose => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Вы уверены, что хотите выйти из аккаунта?
              </ModalHeader>
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
