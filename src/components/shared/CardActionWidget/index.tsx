import User from '@/components/ui/User'
import { useShare } from '@/hooks/useShare'
import { useDeleteComment } from '@/services/api/comment.api'
import { useGetLikes } from '@/services/api/like.api'
import { useDeletePost } from '@/services/api/post.api'
import { useUserStore } from '@/store/user.store'
import { formatToClientDate } from '@/utils/formatToClientDate'
import { hasErrorField } from '@/utils/hasErrorField'
import {
  Button,
  Chip,
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
import { FaEllipsisVertical, FaRegCopy, FaRegHeart } from 'react-icons/fa6'
import { LuSend } from 'react-icons/lu'
import { RiDeleteBinLine, RiUserFollowFill } from 'react-icons/ri'
import { useStore } from 'zustand'
import { ICard } from '../Card'

function CardActionWidget({
  username,
  authorId,
  id = '',
  cardFor,
  commentId = '',
  onClick,
}: Pick<
  ICard,
  'authorId' | 'id' | 'cardFor' | 'commentId' | 'likes' | 'onClick' | 'username'
>) {
  const currentUser = useStore(useUserStore, state => state.user)
  const [isLikesModalOpen, setIsLikesModalOpen] = useState(false)
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const {
    data: likes,
    refetch: refetchLikes,
    isLoading: isLoadingLikes,
  } = useGetLikes(id, commentId)

  const { mutateAsync: deletePost } = useDeletePost()
  const { mutateAsync: deleteComment } = useDeleteComment()

  const { handleShare, getShareUrl, copyToClipboard, isSharing } = useShare()

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

  const handleShareClick = () => {
    handleShare({
      username,
      postId: id,
      commentId,
      title: 'Zling',
      text: 'Интересный пост в соцсети Zling',
    })
  }

  const handleCopyLink = () => {
    const shareUrl = getShareUrl(username, id, commentId)
    copyToClipboard(shareUrl, id)
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
            color="primary"
            startContent={<FaRegHeart />}
            onClick={handleOpenModalLikes}
          >
            Кто поставил лайк
          </DropdownItem>
          <DropdownItem
            key="share"
            color="primary"
            startContent={<LuSend />}
            onClick={handleShareClick}
            isDisabled={isSharing}
          >
            {isSharing ? (
              <>
                <Spinner size="sm" className="mr-2" /> Отправка...
              </>
            ) : (
              'Поделиться'
            )}
          </DropdownItem>
          <DropdownItem
            key="copy"
            color="primary"
            startContent={<FaRegCopy />}
            onClick={handleCopyLink}
          >
            Скопировать ссылку
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
                  color="primary"
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
                    <Spinner size="sm" color="primary" variant="gradient" />
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
                        <Link key={like.id} href={`/${like.userId}`}>
                          <Divider className="mb-2" />
                          <div className="flex items-start justify-between gap-1">
                            <User
                              username={like.user?.name || 'Аноним'}
                              avatarUrl={like.user?.avatarUrl || ''}
                              description={
                                <div className="flex items-center gap-1">
                                  <FaRegHeart />
                                  {formatToClientDate(
                                    new Date(like.createdAt?.toString() || '')
                                  )}
                                </div>
                              }
                              className="cursor-pointer"
                            />{' '}
                            {like.user?.isFollowing && (
                              <Chip
                                size="sm"
                                color="success"
                                variant="flat"
                                className="opacity-65"
                              >
                                <RiUserFollowFill />
                              </Chip>
                            )}
                          </div>
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
                <Button color="primary" onClick={onClose}>
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
