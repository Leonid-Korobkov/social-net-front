'use client'
import {
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Card as HeroCard,
  Tooltip,
} from '@heroui/react'
import clsx from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { memo, useEffect, useState, useCallback } from 'react'
import { FaCircleInfo, FaRegComment } from 'react-icons/fa6'
import { IoEyeOutline } from 'react-icons/io5'
import { LuSend } from 'react-icons/lu'
import { RiUserFollowFill } from 'react-icons/ri'

import CollapsibleText from '@/components/shared/CollapsibleText'
import AnimatedLike from '@/components/ui/AnimatedLike'
import RawHTML from '@/components/ui/EscapeHtml'
import MetaInfo from '@/components/ui/MetaInfo'
import User from '@/components/ui/User'
import { useToggleCommentLike } from '@/services/api/commentLike.api'
import { useCreateLike, useDeleteLike } from '@/services/api/like.api'
import { useIncrementShareCount } from '@/services/api/post.api'
import { CommentLike, Like } from '@/store/types'
import { UserSettingsStore } from '@/store/userSettings.store'
import { formatToClientDate } from '@/utils/formatToClientDate'
import { formatDistance, Locale } from 'date-fns'
import * as locales from 'date-fns/locale'
import { useTopLoader } from 'nextjs-toploader'
import CardActionWidget from '../CardActionWidget'
import MediaCarousel from '../MediaCarousel'
import MediaModal from '../MediaModal'

export interface ICard {
  avatarUrl: string
  username: string
  authorId: string
  content: string
  commentId?: string
  likesCount?: number
  commentsCount?: number
  createdAt?: Date
  id?: string
  cardFor: 'comment' | 'post' | 'current-post' | 'search' // карточка комментария, карточка поста, карточка текущего поста
  likedByUser?: boolean
  isFollowing?: boolean
  likes?: Like[] | CommentLike[]
  refetch?: () => void
  onClick?: () => void
  viewCount?: number
  shareCount?: number
  media?: any[]
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
    username = '',
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
    viewCount = 0,
    shareCount = 0,
    media = [],
  }: ICard) => {
    const { mutateAsync: likePost } = useCreateLike()
    const { mutateAsync: unlikePost } = useDeleteLike()

    const { mutateAsync: toggleLike } = useToggleCommentLike()
    const { mutate: incrementShareCount } = useIncrementShareCount()

    const [isLikeInProgress, setIsLikeInProgress] = useState(false)
    const router = useRouter()
    const loader = useTopLoader()

    const [isTooltipVisible, setIsTooltipVisible] = useState(false)

    // Добавляем состояние для управления модальным окном с медиа
    const [isMediaModalOpen, setIsMediaModalOpen] = useState(false)
    const [selectedMediaIndex, setSelectedMediaIndex] = useState(0)

    // Функция для открытия медиа в модальном окне по индексу
    const openMediaModal = useCallback((index: number) => {
      setSelectedMediaIndex(index)
      setIsMediaModalOpen(true)
    }, [])

    const handleLike = async () => {
      if (isLikeInProgress) return
      setIsLikeInProgress(true)

      try {
        if (cardFor === 'comment') {
          await toggleLike({
            commentId,
            isLiked: likedByUser,
            postId: id,
          })
        } else {
          if (likedByUser) {
            await unlikePost({
              postId: id,
              userId: authorId,
            })
          } else {
            await likePost({
              postId: id,
              userId: authorId,
            })
          }
        }
      } catch (err) {
        // Обрабатываем ошибку без вывода в консоль
      } finally {
        setIsLikeInProgress(false)
      }
    }

    return (
      <>
        <HeroCard className={`mb-5 transform`}>
          <CardHeader className="relative z-[1] justify-between items-start bg-transparent pb-0">
            <Link
              href={`/users/${username}`}
              title={`Переход на страницу автора ${username}`}
              className="flex-1"
            >
              <User
                username={username}
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
                        color="primary"
                        content={`Дата создания - ${formatToClientDate(
                          new Date(createdAt?.toString() || '')
                        )}`}
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
                        content={`Дата создания - ${formatToClientDate(
                          new Date(createdAt?.toString() || '')
                        )}`}
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
            <CardActionWidget
              authorId={authorId}
              id={id}
              cardFor={cardFor}
              commentId={commentId}
              onClick={onClick}
            />
          </CardHeader>
          <CardBody
            className={`card-body px-3 py-2 overflow-hidden ${
              cardFor === 'comment' ? 'pb-0' : 'pb-2'
            }`}
            onClick={e => {
              if (cardFor === 'post' || cardFor === 'search') {
                // Если пользователь выделял текст или кликнул по кнопке "Читать далее", не переходим по ссылке
                if (
                  window.getSelection()?.toString() ||
                  (e.target as HTMLElement).closest('.non-click')
                ) {
                  e.preventDefault()
                  return
                }
                loader.start()
                router.push(`/posts/${id}`)
              }
            }}
          >
            {cardFor === 'current-post' || cardFor === 'comment' ? (
              <RawHTML>{content}</RawHTML>
            ) : (
              <CollapsibleText
                content={content}
                className={clsx(
                  cardFor === 'search' && 'text-sm',
                  'leading-snug'
                )}
                maxLines={20}
                href={`/users/${username}`}
                title={`Переход на страницу автора ${username}`}
              />
            )}
            {/* Отображаем медиафайлы, если они есть */}
            {media && media.length > 0 && (
              <MediaCarousel
                media={media}
                className="non-click mt-2 mb-2 rounded-lg"
                onMediaClick={openMediaModal}
              />
            )}
          </CardBody>
          {cardFor !== 'search' && (
            <CardFooter className="gap-3 -ml-2">
              <div className="flex items-center gap-1 w-full">
                <AnimatedLike
                  isLiked={likedByUser}
                  count={likesCount}
                  onClick={handleLike}
                />
                {cardFor === 'current-post' ? (
                  <MetaInfo count={commentsCount} Icon={FaRegComment} />
                ) : cardFor !== 'comment' ? (
                  <Link
                    href={`/posts/${id}`}
                    onClick={onClick}
                    title={`Переход к посту ${content}`}
                  >
                    <MetaInfo count={commentsCount} Icon={FaRegComment} />
                  </Link>
                ) : null}
                <div className="flex flex-1">
                  <MetaInfo
                    count={shareCount}
                    Icon={LuSend}
                    postId={id}
                    shareTitle={`Пост от ${username} в Zling`}
                    shareText={
                      content.substring(0, 100) +
                      (content.length > 100 ? '...' : '')
                    }
                    onShare={() => incrementShareCount(id)}
                  />
                </div>
                {cardFor !== 'comment' && (
                  <MetaInfo
                    count={viewCount}
                    Icon={IoEyeOutline}
                    size="small"
                  />
                )}
              </div>
            </CardFooter>
          )}
        </HeroCard>

        {/* Модальное окно для медиафайлов */}
        {media && media.length > 0 && (
          <MediaModal
            isOpen={isMediaModalOpen}
            onClose={() => setIsMediaModalOpen(false)}
            media={media}
            initialIndex={selectedMediaIndex}
          />
        )}
      </>
    )
  }
)

Card.displayName = 'Card'

export default Card
