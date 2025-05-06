import { APP_URL } from '@/app/constants'
import User from '@/components/ui/User'
import { useDeleteComment } from '@/services/api/comment.api'
import { useGetLikes } from '@/services/api/like.api'
import { useDeletePost, useIncrementShareCount } from '@/services/api/post.api'
import { UserSettingsStore } from '@/store/userSettings.store'
import { formatToClientDate } from '@/utils/formatToClientDate'
import { hasErrorField } from '@/utils/hasErrorField'
import {
  Button,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  useDisclosure,
} from '@heroui/react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { AiOutlineLike } from 'react-icons/ai'
import { FaEllipsisVertical } from 'react-icons/fa6'
import { LuSend } from 'react-icons/lu'
import { RiDeleteBinLine } from 'react-icons/ri'
import { ICard } from '../Card'
import { useStore } from 'zustand'

function CardActionWidget({
  authorId,
  id = '',
  cardFor,
  commentId = '',
  onClick,
}: Pick<
  ICard,
  'authorId' | 'id' | 'cardFor' | 'commentId' | 'likes' | 'onClick'
>) {
  const currentUser = useStore(UserSettingsStore, state => state.current)
  const [isLikesModalOpen, setIsLikesModalOpen] = useState(false)
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const {
    data: likes,
    refetch: refetchLikes,
    isLoading: isLoadingLikes,
  } = useGetLikes(id, commentId)

  const { mutateAsync: deletePost } = useDeletePost()
  const { mutateAsync: deleteComment } = useDeleteComment()

  const { mutate: incrementShareCount, isPending: isSharing } =
    useIncrementShareCount()

  const router = useRouter()

  const handleDelete = async () => {
    onClick?.()
    const toastId = toast.loading('Удаление...')
    try {
      switch (cardFor) {
        case 'post': {
          const promise = deletePost({ id })
          promise
            .then(() => {
              toast.success('Пост успешно удален!')
            })
            .catch(err => {
              if (hasErrorField(err)) {
                toast.error(err.data.error)
              } else {
                toast.error('Произошла ошибка при удалении')
              }
            })
            .finally(() => {
              toast.dismiss(toastId)
            })
          break
        }
        case 'current-post': {
          const promise = deletePost({ id })
          promise
            .then(() => {
              toast.success('Пост успешно удален!')
              router.push('/')
            })
            .catch(err => {
              if (hasErrorField(err)) {
                toast.error(err.data.error)
              } else {
                toast.error('Произошла ошибка при удалении')
              }
            })
            .finally(() => {
              toast.dismiss(toastId)
            })
          break
        }
        case 'comment': {
          const promise = deleteComment({
            id: commentId,
            postId: id,
          })
          promise
            .then(() => {
              toast.success('Комментарий успешно удален!')
            })
            .catch(err => {
              if (hasErrorField(err)) {
                toast.error(err.data.error)
              } else {
                toast.error('Произошла ошибка при удалении')
              }
            })
            .finally(() => {
              toast.dismiss(toastId)
            })
          break
        }
        default:
          throw new Error('Неверный аргумент cardFor')
      }
    } catch (err) {
      toast.dismiss(toastId)
      if (hasErrorField(err)) {
        toast.error(err.data.error)
      } else {
        toast.error('Произошла ошибка при удалении')
      }
    }
  }

  const handleShare = () => {
    const baseUrl = APP_URL
    let shareUrl = ''

    if (cardFor === 'comment') {
      shareUrl = `${baseUrl}/posts/${id}?comment=${commentId}`
    } else {
      shareUrl = `${baseUrl}/posts/${id}`
    }

    navigator.clipboard
      .writeText(shareUrl)
      .then(() => {
        incrementShareCount(id)
        toast.success('Ссылка скопирована в буфер обмена')
      })
      .catch(() => {
        toast.error('Не удалось скопировать ссылку')
      })
  }

  const handleOpenModalLikes = () => {
    refetchLikes()
    setIsLikesModalOpen(true)
  }

  return (
    <>
      <Dropdown>
        <DropdownTrigger>
          <Button isIconOnly size="sm" variant="light">
            <FaEllipsisVertical />
          </Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Post actions">
          <DropdownItem
            key="likes"
            color="secondary"
            startContent={<AiOutlineLike />}
            onClick={handleOpenModalLikes}
          >
            Просмотр лайков
          </DropdownItem>
          <DropdownItem
            key="share"
            color="secondary"
            startContent={<LuSend />}
            onClick={handleShare}
          >
            Поделиться
          </DropdownItem>
          {authorId === currentUser?.id ? (
            <DropdownItem
              key="delete"
              className="text-danger"
              color="danger"
              startContent={<RiDeleteBinLine />}
              onClick={onOpen}
            >
              Удалить
            </DropdownItem>
          ) : null}
        </DropdownMenu>
      </Dropdown>

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
                Подтвердите ваше действие
              </ModalHeader>
              <ModalBody>
                Данное действие нельзя будет отменить и данные будут удалены без
                возможности восстановления
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onClick={onClose}>
                  Отмена
                </Button>
                <Button
                  color="secondary"
                  onClick={() => {
                    onClose()
                    handleDelete()
                  }}
                >
                  Да, удалить
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal
        isOpen={isLikesModalOpen}
        onOpenChange={setIsLikesModalOpen}
        scrollBehavior="outside"
        placement="center"
        backdrop="blur"
      >
        <ModalContent>
          {onClose => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Понравилось
              </ModalHeader>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                exit={{ opacity: 0 }}
              >
                <ModalBody className="flex flex-col gap-2">
                  {isLoadingLikes && (
                    <Spinner size="sm" color="secondary" variant="gradient" />
                  )}
                  {!isLoadingLikes &&
                    likes?.length !== 0 &&
                    likes?.map(like => (
                      <motion.div
                        key={like.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5, bounce: 0 }}
                        layout="position"
                      >
                        <Link key={like.id} href={`/users/${like.userId}`}>
                          <Divider className="mb-2" />
                          <User
                            username={like.user?.name || 'Аноним'}
                            avatarUrl={like.user?.avatarUrl || ''}
                            description={
                              <div className="flex items-center gap-1">
                                <AiOutlineLike />
                                {formatToClientDate(
                                  new Date(like.createdAt?.toString() || '')
                                )}
                              </div>
                            }
                            className="cursor-pointer"
                          />{' '}
                        </Link>
                      </motion.div>
                    ))}
                  {!isLoadingLikes && likes?.length === 0 && (
                    <div className="flex flex-col items-center gap-1">
                      <p>Никто не поставил лайк</p>
                    </div>
                  )}
                </ModalBody>
              </motion.div>
              <ModalFooter>
                <Button color="secondary" onClick={onClose}>
                  Закрыть
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}

export default CardActionWidget
