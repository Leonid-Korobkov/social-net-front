'use client'
import GoBack from '@/components/layout/GoBack'
import EditProfile from '@/components/shared/EditProfile'
import PostList from '@/components/shared/PostList'
import ProfileInfo from '@/components/shared/ProfileInfo'
import CountInfo from '@/components/ui/CountInfo'
import Image from '@/components/ui/Image'
import UserProfileSkeleton from '@/components/ui/UserProfileSkeleton'
import { useWindowSize } from '@/hooks/useWindowSize'
import { useCreateFollow, useDeleteFollow } from '@/services/api/follow.api'
import { useGetPostsByUserId, useGetUserById } from '@/services/api/user.api'
import { useUserStore } from '@/store/user.store'
import { formatToClientDate } from '@/utils/formatToClientDate'
import {
  Button,
  Card,
  Modal,
  ModalContent,
  Image as NextImage,
  useDisclosure,
} from '@heroui/react'
import { motion } from 'framer-motion'
import { notFound } from 'next/navigation'
import { use, useState } from 'react'
import Confetti from 'react-confetti'
import { BsPostcardFill } from 'react-icons/bs'
import { CiEdit } from 'react-icons/ci'
import { FaUsers } from 'react-icons/fa'
import {
  MdOutlinePersonAddAlt1,
  MdOutlinePersonAddDisabled,
} from 'react-icons/md'
import { RiUserFollowFill } from 'react-icons/ri'

type PageProps = {
  params: Promise<{
    [x: string]: string
    id: string
  }>
}

function UserProfile({ params }: PageProps) {
  const unwrappedParams = use(params)
  const { id } = unwrappedParams

  const [party, setParty] = useState(false)
  const [isImageOpen, setImageOpen] = useState(false)

  const { isOpen, onOpen, onClose } = useDisclosure()
  const currentUser = useUserStore.use.current()

  const { data: user, isPending: isLoading } = useGetUserById(id)
  const {
    data: posts,
    isLoading: isLoadingPosts,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useGetPostsByUserId({
    userId: id,
    limit: 10,
  })

  const { mutateAsync: followUser, isPending: isFollowPending } =
    useCreateFollow()
  const { mutateAsync: unfollowUser, isPending: isUnfollowPending } =
    useDeleteFollow()

  const size = useWindowSize()

  const handleFollow = async () => {
    try {
      if (id) {
        if (user?.isFollowing) {
          unfollowUser({ followingId: id, userId: currentUser?.id || '' })
        } else {
          followUser({ followingId: id, userId: currentUser?.id || '' })
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

  function handleSettingProfile() {}

  const handleImageClick = () => {
    setImageOpen(true)
  }

  const handleLoadMore = () => {
    fetchNextPage()
  }

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
              className="max-w-full max-h-full border-4 border-white rounded-xl cursor-pointer"
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
                  isLoading={isFollowPending || isUnfollowPending}
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
                <div className="flex gap-2">
                  <Button
                    endContent={<CiEdit />}
                    onPress={handleEditProfile}
                    variant="ghost"
                    color="warning"
                  >
                    Редактировать
                  </Button>
                  <Button
                    endContent={<CiEdit />}
                    onPress={handleSettingProfile}
                    variant="ghost"
                    color="secondary"
                  >
                    Настройки
                  </Button>
                </div>
              )}
            </div>
          </Card>
          <Card className="flex flex-col space-y-2 p-5 flex-1">
            <Card className="flex gap-2 justify-center flex-row flex-wrap mb-2">
              <CountInfo
                Icon={BsPostcardFill}
                count={user.postCount}
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
            <ProfileInfo title="Никнейм" info={`@${user.userName}`} />
            <ProfileInfo
              title="Зарегистрирован"
              info={formatToClientDate(user.createdAt, false)}
            />
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
          data={posts ?? []}
          isLoading={isLoadingPosts}
          hasMore={hasNextPage}
          onLoadMore={handleLoadMore}
          isFetchingMore={isFetchingNextPage && !isLoading}
          skeletonClassName="mt-10"
        />
        <EditProfile
          isOpen={isOpen}
          onClose={onClose}
          user={user}
          params={{
            id: id,
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
