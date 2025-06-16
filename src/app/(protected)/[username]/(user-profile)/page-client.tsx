'use client'
import GoBack from '@/components/layout/GoBack'
import PostList from '@/components/shared/PostList'
import ProfileInfo from '@/components/shared/ProfileInfo'
import CountInfo from '@/components/ui/CountInfo'
import Image from '@/components/ui/Image'
import ShareDropdown from '@/components/ui/ShareDropdown'
import UserProfileSkeleton from '@/components/ui/UserProfileSkeleton'
import { useWindowSize } from '@/hooks/useWindowSize'
import { useCreateFollow, useDeleteFollow } from '@/services/api/follow.api'
import { useGetPostsByUserId, useGetUserById } from '@/services/api/user.api'
import { useModalsStore } from '@/store/modals.store'
import { useUserStore } from '@/store/user.store'
import { formatToClientDate } from '@/utils/formatToClientDate'
import {
  Button,
  Card,
  Modal,
  ModalContent,
  Image as NextImage,
} from '@heroui/react'
import { motion } from 'framer-motion'
import { notFound } from 'next/navigation'
import { use, useState } from 'react'
import { AiFillEdit } from 'react-icons/ai'
import { BsPostcardFill } from 'react-icons/bs'
import { FaUsers } from 'react-icons/fa'
import { IoIosSettings } from 'react-icons/io'
import {
  MdOutlinePersonAddAlt1,
  MdOutlinePersonAddDisabled,
} from 'react-icons/md'
import { RiUserFollowFill } from 'react-icons/ri'
import { useStore } from 'zustand'

type PageProps = {
  params: Promise<{ username: string }>
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}

function UserProfileClient({ params }: PageProps) {
  const { username: id } = use(params)

  const [party, setParty] = useState(false)
  const [isImageOpen, setImageOpen] = useState(false)
  const { openEditProfile, openSettings } = useModalsStore()

  const currentUser = useStore(useUserStore, state => state.user)

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
          unfollowUser({
            followingId: id,
            userId: currentUser?.id.toString() || '',
          })
        } else {
          followUser({
            followingId: id,
            userId: currentUser?.id.toString() || '',
          })
          setParty(true)
        }
      }
    } catch (error) {
      console.error(error)
    }
  }

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
        <div className="flex lg:flex-row flex-col items-stretch gap-4">
          <Card className="flex flex-col items-center text-center space-y-4 p-5 flex-grow-[1] min-w-[300px] lg:max-w-[300px]">
            <Image
              alt={`Изображение профиля ${user.name}`}
              src={`${user.avatarUrl}`}
              className="max-h-[200px] max-w-[200px] lg:max-h-[300px] w-full lg:max-w-[300px] cursor-pointer"
              onClick={handleImageClick}
            />
            <div className="flex flex-col text-2xl font-bold gap-4 items-center w-full">
              {user.name}
              {currentUser?.id !== user.id ? (
                <Button
                  color={user?.isFollowing ? 'default' : 'primary'}
                  variant="flat"
                  className="gap-2"
                  onClick={handleFollow}
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
                <div className="flex gap-2 flex-col w-full">
                  <Button
                    startContent={<AiFillEdit />}
                    onClick={() => openEditProfile(currentUser.id)}
                    variant="ghost"
                    color="warning"
                    fullWidth
                  >
                    Редактировать
                  </Button>
                  <Button
                    startContent={<IoIosSettings />}
                    onClick={() => openSettings(currentUser.id)}
                    variant="ghost"
                    color="primary"
                    fullWidth
                  >
                    Настройки
                  </Button>
                </div>
              )}
              {user && (
                <ShareDropdown
                  url={
                    typeof window !== 'undefined' ? window.location.href : ''
                  }
                  title={`Профиль ${user.name}`}
                  text={`Посмотрите профиль ${user.name} в социальной сети Zling!`}
                  buttonText="Поделиться"
                  className="w-full"
                />
              )}
            </div>
          </Card>
          <Card className="flex flex-col space-y-2 p-5 flex-grow-[3]">
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
                userId={user.userName}
                type="followers"
              />
              <CountInfo
                Icon={RiUserFollowFill}
                count={user.following.length}
                title="Подписки"
                userId={user.userName}
                type="following"
              />
            </Card>
            <ProfileInfo title="Никнейм" info={`@${user.userName}`} />
            <ProfileInfo
              title="Email"
              info={user.email}
              isPrivate={!user.showEmail}
            />
            <ProfileInfo
              title="Зарегистрирован"
              info={formatToClientDate(user.createdAt, false)}
            />
            <ProfileInfo
              title="Местоположение"
              info={user.location}
              isPrivate={!user.showLocation}
            />
            <ProfileInfo
              title="Дата рождения"
              info={
                user.dateOfBirth
                  ? formatToClientDate(user.dateOfBirth, false)
                  : ''
              }
              isPrivate={!user.showDateOfBirth}
            />
            <ProfileInfo
              title="Обо мне"
              info={user.bio}
              isPrivate={!user.showBio}
            />
          </Card>
        </div>
        <PostList
          className="w-full mt-4"
          data={posts ?? []}
          isLoading={isLoadingPosts}
          hasMore={hasNextPage}
          onLoadMore={handleLoadMore}
          isFetchingMore={isFetchingNextPage && !isLoading}
          skeletonClassName="mt-4"
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

export default UserProfileClient
