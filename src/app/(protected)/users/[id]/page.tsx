'use client'
import { useEffect, useState, use } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Button,
  Card,
  Modal,
  ModalContent,
  Image as NextImage,
} from '@heroui/react'
import { MdOutlinePersonAddAlt1 } from 'react-icons/md'
import { MdOutlinePersonAddDisabled } from 'react-icons/md'
import { useDisclosure } from '@heroui/react'
import { CiEdit } from 'react-icons/ci'
import { RiEmotionSadLine } from 'react-icons/ri'

import Confetti from 'react-confetti'
import { motion } from 'framer-motion'

import { BsPostcardFill } from 'react-icons/bs'
import { RiUserFollowFill } from 'react-icons/ri'
import { FaUsers } from 'react-icons/fa'

import { resetUser, selectCurrent } from '@/features/user/user.slice'
import { useGetUserByIdQuery } from '@/store/services/user.api'
import { useCreateFollowMutation } from '@/store/services/follow.api'
import { Post } from '@/store/types'
import { useDeleteFollowMutation } from '@/store/services/follow.api'
import { useWindowSize } from '@/hooks/useWindowSize'
import UserProfileSkeleton from '@/components/ui/UserProfileSkeleton'
import GoBack from '@/components/layout/GoBack'
import Image from '@/components/ui/Image'
// import Image from 'next/image'
import CountInfo from '@/components/ui/CountInfo'
import ProfileInfo from '@/components/shared/ProfileInfo'
import { formatToClientDate } from '@/utils/formatToClientDate'
import PostList from '@/components/shared/PostList'
import EditProfile from '@/components/shared/EditProfile'
import { notFound } from 'next/navigation'

type PageProps = {
  params: Promise<{
    [x: string]: string
    id: string
  }>
}

function UserProfile({ params }: PageProps) {
  // Используем React.use для разворачивания Promise в params
  const unwrappedParams = use(params)
  const { id } = unwrappedParams
  // const paramss = useParams();
  // const id = paramss.id as string;

  const { isOpen, onOpen, onClose } = useDisclosure()
  const currentUser = useSelector(selectCurrent)
  const { data: user, isLoading } = useGetUserByIdQuery(
    { id: id ?? '' },
    { skip: !id }
  )
  const [posts, setPosts] = useState<Post[]>([])

  const [followUser] = useCreateFollowMutation()
  const [unfolowUser] = useDeleteFollowMutation()

  const [party, setParty] = useState(false)
  const size = useWindowSize()

  const dispatch = useDispatch()

  useEffect(
    () => () => {
      dispatch(resetUser())
    },
    []
  )

  const [isImageOpen, setImageOpen] = useState(false)

  const handleFollow = async () => {
    try {
      if (id) {
        if (user?.isFollowing) {
          unfolowUser({ followingId: id }).unwrap()
        } else {
          followUser({ followingId: id }).unwrap()
          setParty(true)
        }
      }
    } catch (error) {
      console.error(error)
    }
  }

  function handleEditProfile() {
    onOpen()
  }

  const handleImageClick = () => {
    setImageOpen(true)
  }

  useEffect(() => {
    if (!isLoading && user) {
      const newPosts = [...user.posts]
      newPosts.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      setPosts(newPosts)
    }
  }, [user, isLoading])

  if (isLoading) {
    return <UserProfileSkeleton />
  }

  if (!user) {
    return notFound()
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        exit={{ opacity: 0 }}
      >
        <GoBack />
        <Confetti
          width={size.width}
          height={size.height}
          recycle={false}
          run={party}
          onConfettiComplete={Confetti => {
            setParty(false)
            if (Confetti) {
              Confetti.reset()
            }
          }}
        />
        <div className="flex lg:flex-row flex-col items-stretch gap-4">
          <Card className="flex flex-col items-center text-center space-y-4 p-5 flex-2">
            <Image
              alt={`Изображение профиля ${user.name}`}
              src={`${user.avatarUrl}`}
              width={200}
              height={200}
              // isBlurred
              className="w-[200px] h-[200px] border-4 border-white rounded-xl cursor-pointer"
              onClick={handleImageClick}
            />
            <div className="flex flex-col text-2xl font-bold gap-4 items-center">
              {user.name}
              {currentUser?.id !== user.id ? (
                <Button
                  color={user?.isFollowing ? 'default' : 'secondary'}
                  variant="flat"
                  className="gap-2"
                  onPress={handleFollow}
                  endContent={
                    user?.isFollowing ? (
                      <MdOutlinePersonAddDisabled />
                    ) : (
                      <MdOutlinePersonAddAlt1 />
                    )
                  }
                >
                  {user?.isFollowing ? 'Отписаться' : 'Подписаться'}
                </Button>
              ) : (
                <Button
                  endContent={<CiEdit />}
                  onPress={handleEditProfile}
                  variant="ghost"
                  color="warning"
                >
                  Редактировать
                </Button>
              )}
            </div>
          </Card>
          <Card className="flex flex-col space-y-2 p-5 flex-1">
            <Card className="flex gap-2 justify-center flex-row flex-wrap mb-2">
              <CountInfo
                Icon={BsPostcardFill}
                count={user.posts.length}
                title="Публикации"
              />
              <CountInfo
                Icon={FaUsers}
                count={user.followers.length}
                title="Подписчики"
                userId={user.id}
                type="followers"
              />
              <CountInfo
                Icon={RiUserFollowFill}
                count={user.following.length}
                title="Подписки"
                userId={user.id}
                type="following"
              />
            </Card>
            <ProfileInfo
              title="Зарегистрирован"
              info={formatToClientDate(user.createdAt, false)}
            />
            <ProfileInfo title="Почта" info={user.email} />
            <ProfileInfo title="Местоположение" info={user.location} />
            <ProfileInfo
              title="Дата рождения"
              info={
                user.dateOfBirth
                  ? formatToClientDate(user.dateOfBirth, false)
                  : ''
              }
            />
            <ProfileInfo title="Обо мне" info={user.bio} />
          </Card>
        </div>
        <PostList
          className="w-full mt-4"
          data={posts || []}
          isLoading={isLoading}
          handleCardClick={() => {}}
        />
        <EditProfile
          isOpen={isOpen}
          onClose={onClose}
          user={user}
          params={{
            id: '',
          }}
        />
        <Modal
          closeButton={true}
          aria-labelledby="modal-title"
          isOpen={isImageOpen}
          onClose={() => setImageOpen(false)}
          size="5xl"
        >
          <ModalContent>
            <NextImage
              src={`${user.avatarUrl}`}
              alt={user.name}
              width="100%"
              height="auto"
              className="object-cover z-0"
            />
          </ModalContent>
        </Modal>
      </motion.div>
    </>
  )
}

export default UserProfile
