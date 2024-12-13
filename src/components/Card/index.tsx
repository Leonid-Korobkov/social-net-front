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
import { FcDislike } from 'react-icons/fc'
import { MdOutlineFavoriteBorder } from 'react-icons/md'
import { RiDeleteBinLine } from 'react-icons/ri'
import { useSelector } from 'react-redux'
import { Spinner } from '@nextui-org/react'
import { useEffect, useState } from 'react'
import {
  useCreateLikeMutation,
  useDeleteLikeMutation,
} from '../../app/services/like.api'
import { selectCurrent } from '../../features/user/user.slice'
import {
  useDeletePostMutation,
  useLazyGetAllPostsQuery,
  useLazyGetPostByIdQuery,
} from '../../app/services/post.api'
import { useDeleteCommentMutation } from '../../app/services/comment.api'
import { hasErrorField } from '../../utils/hasErrorField'
import { formatToClientDate } from '../../utils/formatToClientDate'
import User from '../User'
import Typography from '../Typography'
import MetaInfo from '../MetaInfo'
import RawHTML from '../EscapeHtml'

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
  refetch,
}: ICard) {
  const [likePost, likePostStatus] = useCreateLikeMutation()
  const [unlikePost, unlikePostStatus] = useDeleteLikeMutation()
  const [triggerGetAllPosts] = useLazyGetAllPostsQuery()
  const [triggerGetPostById] = useLazyGetPostByIdQuery()
  const [deletePost, deletePostStatus] = useDeletePostMutation()
  const [deleteComment, deleteCommentStatus] = useDeleteCommentMutation()
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const currentUser = useSelector(selectCurrent)

  const refetchPosts = async () => {
    switch (cardFor) {
      case 'post':
        await triggerGetAllPosts().unwrap()
        break
      case 'current-post':
        await triggerGetAllPosts().unwrap()
        break
      case 'comment':
        await triggerGetPostById(id).unwrap()
        break
      default:
        throw new Error('Неверный аргумент cardFor')
    }
  }

  const handleClick = async () => {
    try {
      likedByUser
        ? await unlikePost({ postId: id }).unwrap()
        : await likePost({ postId: id }).unwrap()

      if (refetch) refetch()
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
    try {
      switch (cardFor) {
        case 'post':
          await deletePost(id).unwrap()
          await refetchPosts()
          break
        case 'current-post':
          await deletePost(id).unwrap()
          navigate('/')
          break
        case 'comment':
          await deleteComment(commentId).unwrap()
          await refetchPosts()
          break
        default:
          throw new Error('Неверный аргумент cardFor')
      }
      if (refetch) refetch()
    } catch (err) {
      console.log(err)
      if (hasErrorField(err)) {
        setError(err.data.error)
      } else {
        setError(err as string)
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
            <div onClick={handleClick}>
              <MetaInfo
                classNameForIcon={likedByUser ? 'text-danger' : ''}
                count={likesCount}
                // Icon={
                //   likePostStatus.isLoading || unlikePostStatus.isLoading
                //     ? Spinner
                //     : likedByUser
                //       ? FcDislike
                //       : MdOutlineFavoriteBorder
                // }
                Icon={likedByUser ? FcDislike : MdOutlineFavoriteBorder}
              />
            </div>
            {cardFor === 'current-post' ? (
              <MetaInfo count={commentsCount} Icon={FaRegComment} />
            ) : (
              <Link to={`/posts/${id}`}>
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
