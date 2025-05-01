'use client'
import {
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Card as NextUiCard,
  Tooltip,
} from '@heroui/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { memo, useState } from 'react'
import { FaCircleInfo, FaRegComment } from 'react-icons/fa6'
import { RiUserFollowFill } from 'react-icons/ri'

import AnimatedLike from '@/components/ui/AnimatedLike'
import RawHTML from '@/components/ui/EscapeHtml'
import MetaInfo from '@/components/ui/MetaInfo'
import Typography from '@/components/ui/Typography'
import User from '@/components/ui/User'
import { useToggleCommentLike } from '@/services/api/commentLike.api'
import { useCreateLike, useDeleteLike } from '@/services/api/like.api'
import { CommentLike, Like } from '@/store/types'
import { formatToClientDate } from '@/utils/formatToClientDate'
import { formatDistance, Locale } from 'date-fns'
import * as locales from 'date-fns/locale'
import { useTopLoader } from 'nextjs-toploader'
import CardActionWidget from '../CardActionWidget'
import CollapsibleText from '@/components/ui/CollapsibleText'

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
  }: ICard) => {
    const { mutateAsync: likePost } = useCreateLike()
    const { mutateAsync: unlikePost } = useDeleteLike()

    const { mutateAsync: toggleLike } = useToggleCommentLike()

    const [isLikeInProgress, setIsLikeInProgress] = useState(false)
    const router = useRouter()
    const loader = useTopLoader()

    const [isTooltipVisible, setIsTooltipVisible] = useState(false)

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
        console.log(err)
      } finally {
        setIsLikeInProgress(false)
      }
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
            href={`/users/${authorId}`}
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
                      color="foreground"
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
          className={`card-body px-3 py-2 ${
            cardFor === 'comment' ? 'pb-0' : 'pb-5'
          }`}
          onClick={e => {
            if (cardFor === 'post') {
              // Если пользователь выделял текст или кликнул по кнопке "Читать далее", не переходим по ссылке
              if (
                window.getSelection()?.toString() ||
                (e.target as HTMLElement).closest('button')
              ) {
                e.preventDefault()
                return
              }
              loader.start()
              router.push(`/posts/${id}`)
            }
          }}
        >
          {cardFor === 'post' || cardFor === 'comment' ? (
            <CollapsibleText content={content} />
          ) : (
            <Typography>
              <RawHTML>{content}</RawHTML>
            </Typography>
          )}
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
                href={`/posts/${id}`}
                onClick={onClick}
                title={`Переход к посту ${content}`}
              >
                <MetaInfo count={commentsCount} Icon={FaRegComment} />
              </Link>
            ) : null}
          </div>
        </CardFooter>
      </NextUiCard>
    )
  }
)

Card.displayName = 'Card'

export default Card
