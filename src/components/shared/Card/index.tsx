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
} from '@nextui-org/react'
import { Link, useNavigate } from 'react-router-dom'
import { FaRegComment } from 'react-icons/fa6'
import { RiDeleteBinLine } from 'react-icons/ri'
import { useSelector } from 'react-redux'
import { Spinner } from '@nextui-org/react'
import { useState } from 'react'
import {
  useCreateLikeMutation,
  useDeleteLikeMutation,
} from '../../../app/services/like.api'
import { selectCurrent } from '../../../features/user/user.slice'
import { useDeletePostMutation } from '../../../app/services/post.api'
import { useDeleteCommentMutation } from '../../../app/services/comment.api'
import { hasErrorField } from '../../../utils/hasErrorField'
import { formatToClientDate } from '../../../utils/formatToClientDate'
import User from '../../ui/User'
import Typography from '../../ui/Typography'
import MetaInfo from '../../ui/MetaInfo'
import RawHTML from '../../ui/EscapeHtml'
import { toast } from 'react-hot-toast'
import AnimatedLike from '../../ui/AnimatedLike'

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
  refetch?: () => void
  onClick?: () => void
}

function Card({
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
  onClick,
}: ICard) {
  const [likePost] = useCreateLikeMutation()
  const [unlikePost] = useDeleteLikeMutation()
  const [deletePost, deletePostStatus] = useDeletePostMutation()
  const [deleteComment, deleteCommentStatus] = useDeleteCommentMutation()
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const currentUser = useSelector(selectCurrent)

  const handleLike = async () => {
    try {
      if (likedByUser) {
        unlikePost({
          postId: id,
          userId: authorId,
        }).unwrap()
      } else {
        likePost({
          postId: id,
          userId: authorId,
        }).unwrap()
      }
    } catch (err) {
      if (hasErrorField(err)) {
        setError(err.data.error)
      } else {
        setError(err as string)
      }
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

  return (
    <NextUiCard className="mb-5">
      <CardHeader className="justify-between items-center bg-transparent">
        <Link to={`/users/${authorId}`}>
          <User
            name={name}
            className="text-small font-semibold leading-none text-default-600"
            avatarUrl={avatarUrl}
            description={createdAt && formatToClientDate(createdAt)}
          />
        </Link>
        {isFollowing && (
          <Chip color="success" variant="flat" className="opacity-65">
            Вы подписаны
          </Chip>
        )}
        {authorId === currentUser?.id && (
          <div className="cursor-pointer" onClick={onOpen}>
            {deletePostStatus.isLoading || deleteCommentStatus.isLoading ? (
              <Spinner />
            ) : (
              <RiDeleteBinLine />
            )}
          </div>
        )}
      </CardHeader>
      <CardBody className="px-3 py-2 mb-5">
        <Typography>
          <RawHTML>{content}</RawHTML>
        </Typography>
      </CardBody>
      {cardFor !== 'comment' && (
        <CardFooter className="gap-3">
          <div className="flex gap-5 items-center">
            <AnimatedLike
              isLiked={likedByUser}
              count={likesCount}
              onClick={handleLike}
            />
            {cardFor === 'current-post' ? (
              <MetaInfo count={commentsCount} Icon={FaRegComment} />
            ) : (
              <Link to={`/posts/${id}`} onClick={onClick}>
                <MetaInfo count={commentsCount} Icon={FaRegComment} />
              </Link>
            )}
          </div>
          {error && <Alert color="danger" title={error} />}
        </CardFooter>
      )}

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
}

export default Card
