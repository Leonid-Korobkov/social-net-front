import {
  Card as NextUiCard,
  CardHeader,
  CardBody,
  CardFooter,
  Alert,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Button,
  Chip,
  Tooltip,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Divider,
} from '@nextui-org/react'
import { Link, useNavigate } from 'react-router-dom'
import {
  FaCircleInfo,
  FaRegComment,
  FaEllipsisVertical,
  FaShareFromSquare,
} from 'react-icons/fa6'
import { AiOutlineLike } from 'react-icons/ai'
import { RiDeleteBinLine, RiUserFollowFill } from 'react-icons/ri'
import { useSelector } from 'react-redux'
import { memo, useState } from 'react'
import {
  useCreateLikeMutation,
  useDeleteLikeMutation,
} from '../../../app/services/like.api'
import { selectCurrent } from '../../../features/user/user.slice'
import { useDeletePostMutation } from '../../../app/services/post.api'
import { useDeleteCommentMutation } from '../../../app/services/comment.api'
import { hasErrorField } from '../../../utils/hasErrorField'
import User from '../../ui/User'
import Typography from '../../ui/Typography'
import MetaInfo from '../../ui/MetaInfo'
import RawHTML from '../../ui/EscapeHtml'
import { toast } from 'react-hot-toast'
import AnimatedLike from '../../ui/AnimatedLike'
import { formatDistance, Locale } from 'date-fns'
import * as locales from 'date-fns/locale'
import { formatToClientDate } from '../../../utils/formatToClientDate'
import { useToggleCommentLikeMutation } from '../../../app/services/likeComment.api'
import { CommentLike, Like } from '../../../app/types'
import { APP_URL } from '../../../constants'

interface ICard {
  avatarUrl: string
  name: string
  authorId: string
  content: string
  commentId?: string
  likesCount?: number
  commentsCount?: number
  createdAt?: Date
  id?: string
  cardFor: 'comment' | 'post' | 'current-post' // карточка комментария, карточка поста, карточка текущего поста
  likedByUser?: boolean
  isFollowing?: boolean
  likes?: Like[] | CommentLike[]
  refetch?: () => void
  onClick?: () => void
}

// Функция для получения локали
const getLocale = (): Locale => {
  try {
    const userLocale = (navigator.language || navigator.languages[0] || 'ru')
      .split('-')
      .join('')

    return locales[userLocale as keyof typeof locales] || locales.ru
  } catch (error) {
    console.error('Ошибка при определении локали:', error)
    return locales.ru
  }
}

const Card = memo(
  ({
    avatarUrl = '',
    name = '',
    content = '',
    authorId = '',
    id = '',
    likesCount = 0,
    commentsCount = 0,
    cardFor = 'post',
    likedByUser = false,
    createdAt,
    commentId = '',
    isFollowing = false,
    likes = [],
    onClick,
  }: ICard) => {
    const [likePost] = useCreateLikeMutation()
    const [unlikePost] = useDeleteLikeMutation()

    const [toggleLike] = useToggleCommentLikeMutation()

    const [deletePost] = useDeletePostMutation()
    const [deleteComment] = useDeleteCommentMutation()

    const [error, setError] = useState('')
    const [isLikeInProgress, setIsLikeInProgress] = useState(false)
    const navigate = useNavigate()
    const currentUser = useSelector(selectCurrent)

    const [isTooltipVisible, setIsTooltipVisible] = useState(false)
    const [isLikesModalOpen, setIsLikesModalOpen] = useState(false)

    const handleLike = async () => {
      if (isLikeInProgress) return
      setIsLikeInProgress(true)

      try {
        if (cardFor === 'comment') {
          await toggleLike({
            commentId,
            isLiked: likedByUser,
            postId: id,
          }).unwrap()
        } else {
          if (likedByUser) {
            await unlikePost({
              postId: id,
              userId: authorId,
            }).unwrap()
          } else {
            await likePost({
              postId: id,
              userId: authorId,
            }).unwrap()
          }
        }
      } catch (err) {
        if (hasErrorField(err)) {
          setError(err.data.error)
        } else {
          setError(err as string)
        }
      } finally {
        setIsLikeInProgress(false)
      }
    }

    const { isOpen, onOpen, onOpenChange } = useDisclosure()

    const handleDelete = async () => {
      onClick?.()
      const toastId = toast.loading('Удаление...')
      try {
        switch (cardFor) {
          case 'post': {
            const promise = deletePost({ id, userId: authorId }).unwrap()
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
            const promise = deletePost({ id, userId: authorId }).unwrap()
            promise
              .then(() => {
                toast.success('Пост успешно удален!')
                navigate('/')
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
              commentId,
              postId: id,
            }).unwrap()
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
          setError(err.data.error)
          toast.error(err.data.error)
        } else {
          setError(err as string)
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
          toast.success('Ссылка скопирована в буфер обмена')
        })
        .catch(() => {
          toast.error('Не удалось скопировать ссылку')
        })
    }

    return (
      <NextUiCard
        className={`mb-5 transform ${
          cardFor === 'post'
            ? `transition-all duration-500 
    ease-in-out [&:has(>div.card-body:hover)]:scale-[1.01]
    [&:has(>div.card-body:hover)]:shadow-lg overflow-visible`
            : ''
        }`}
      >
        <CardHeader className="relative z-[1] justify-between items-center bg-transparent">
          <Link
            to={`/users/${authorId}`}
            title={`Переход на страницу автора ${name}`}
            className="flex-1"
          >
            <User
              name={name}
              className="text-small font-semibold leading-none text-default-600"
              avatarUrl={avatarUrl}
              description={
                <div className="flex items-center gap-1">
                  {createdAt &&
                    formatDistance(new Date(createdAt), new Date(), {
                      addSuffix: true,
                      locale: getLocale(),
                    })}
                  {window.matchMedia('(hover: hover) and (pointer: fine)')
                    .matches ? (
                    <Tooltip
                      delay={500}
                      showArrow
                      color="foreground"
                      content={`Дата создания - ${formatToClientDate(new Date(createdAt?.toString() || ''))}`}
                      className="pointer-events-none"
                    >
                      <div>
                        <FaCircleInfo
                          size={15}
                          opacity={0.5}
                          onClick={e => {
                            e.preventDefault()
                            e.stopPropagation()
                          }}
                          className="cursor-help"
                        />
                      </div>
                    </Tooltip>
                  ) : (
                    <Tooltip
                      showArrow
                      color="foreground"
                      content={`Дата создания - ${formatToClientDate(new Date(createdAt?.toString() || ''))}`}
                      isOpen={isTooltipVisible}
                      className="pointer-events-none"
                    >
                      <div>
                        <FaCircleInfo
                          size={15}
                          opacity={0.5}
                          onClick={e => {
                            e.preventDefault()
                            e.stopPropagation()
                            setIsTooltipVisible(true)
                            setTimeout(() => {
                              setIsTooltipVisible(false)
                            }, 2000)
                          }}
                          className="cursor-pointer"
                        />
                      </div>
                    </Tooltip>
                  )}
                </div>
              }
            />
          </Link>
          {isFollowing && (
            <Chip color="success" variant="flat" className="opacity-65">
              <RiUserFollowFill />
            </Chip>
          )}
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
                startContent={<AiOutlineLike />}
                onPress={() => setIsLikesModalOpen(true)}
              >
                Просмотр лайков
              </DropdownItem>
              <DropdownItem
                key="share"
                color="primary"
                startContent={<FaShareFromSquare />}
                onPress={handleShare}
              >
                Поделиться
              </DropdownItem>
              {authorId === currentUser?.id ? (
                <DropdownItem
                  key="delete"
                  className="text-danger"
                  color="danger"
                  startContent={<RiDeleteBinLine />}
                  onPress={onOpen}
                >
                  Удалить
                </DropdownItem>
              ) : null}
            </DropdownMenu>
          </Dropdown>
        </CardHeader>
        <CardBody
          className={`card-body px-3 py-2 cursor-pointer ${cardFor === 'comment' ? 'pb-0' : 'pb-5'}`}
          onClick={e => {
            if (cardFor === 'post') {
              // Если пользователь выделял текст, не переходим по ссылке
              if (window.getSelection()?.toString()) {
                e.preventDefault()
                return
              }
              navigate(`/posts/${id}`)
            }
          }}
        >
          <Typography size={cardFor === 'comment' ? 'text-lg' : undefined}>
            <RawHTML>{content}</RawHTML>
          </Typography>
        </CardBody>
        <CardFooter className="gap-3 -ml-2">
          <div className="flex gap-1 items-center">
            <AnimatedLike
              isLiked={likedByUser}
              count={likesCount}
              onClick={handleLike}
            />
            {cardFor === 'current-post' ? (
              <MetaInfo count={commentsCount} Icon={FaRegComment} />
            ) : cardFor !== 'comment' ? (
              <Link
                to={`/posts/${id}`}
                onClick={onClick}
                title={`Переход к посту ${content}`}
              >
                <MetaInfo count={commentsCount} Icon={FaRegComment} />
              </Link>
            ) : null}
          </div>
        </CardFooter>

        <Modal
          isOpen={isLikesModalOpen}
          onOpenChange={setIsLikesModalOpen}
          scrollBehavior="inside"
          backdrop="blur"
        >
          <ModalContent>
            {onClose => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Понравилось
                </ModalHeader>
                <ModalBody className="flex flex-col gap-2">
                  {likes.length !== 0 ? (
                    likes?.map(like => (
                      <Link key={like.id} to={`/users/${like.userId}`}>
                        <Divider className="mb-2" />
                        <User
                          name={like.user?.name || 'Аноним'}
                          avatarUrl={like.user?.avatarUrl || ''}
                          description={
                            <div className="flex items-center gap-1">
                              <AiOutlineLike />
                              {formatToClientDate(
                                new Date(like.createdAt?.toString() || ''),
                              )}
                            </div>
                          }
                          className="cursor-pointer"
                        />{' '}
                      </Link>
                    ))
                  ) : (
                    <p>Нет лайков</p>
                  )}
                </ModalBody>
                <ModalFooter>
                  <Button color="primary" onPress={onClose}>
                    Закрыть
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>

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
                  Данное действие нельзя будет отменить и данные будут удалены
                  без возможности восстановления
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Отмена
                  </Button>
                  <Button
                    color="primary"
                    onPress={() => {
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
      </NextUiCard>
    )
  },
)

export default Card
