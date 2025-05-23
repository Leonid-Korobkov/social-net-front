import { APP_URL } from '@/app/constants'
import { useIncrementShareCount } from '@/services/api/post.api'
import { toast } from 'react-hot-toast'
import { useState, useEffect } from 'react'

interface ShareOptions {
  username: string
  title?: string
  text?: string
  postId: string
  commentId?: string
}

export function useShare() {
  const { mutate: incrementShareCount, isPending: isSharing } =
    useIncrementShareCount()
  const [canNativeShare, setCanNativeShare] = useState(false)

  useEffect(() => {
    setCanNativeShare(typeof navigator !== 'undefined' && 'share' in navigator)
  }, [])

  const getShareUrl = (
    username: string,
    postId: string,
    commentId?: string
  ) => {
    const baseUrl = APP_URL
    return commentId
      ? `${baseUrl}/${username}/post/${postId}?comment=${commentId}`
      : `${baseUrl}/${username}/post/${postId}`
  }

  const handleShare = async ({
    username,
    title = 'Zling',
    text = 'Интересный пост в соцсети Zling',
    postId,
    commentId,
  }: ShareOptions) => {
    const shareUrl = getShareUrl(username, postId, commentId)

    try {
      if (canNativeShare && navigator.share) {
        // Используем нативный шеринг
        await navigator.share({
          title,
          text,
          url: shareUrl,
        })

        // Увеличиваем счетчик шеринга
        incrementShareCount(postId)
        toast.success('Ссылка успешно отправлена')
      } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
        // Fallback - копирование в буфер обмена
        await navigator.clipboard.writeText(shareUrl)
        incrementShareCount(postId)
        toast.success('Ссылка скопирована в буфер обмена')
      } else {
        // Если нет поддержки ни Web Share API, ни Clipboard API
        toast.error('Ваш браузер не поддерживает нужный функционал')
      }
    } catch (error) {
      const err = error as Error
      // Не показываем ошибку, если пользователь отменил шеринг
      if (err.name !== 'AbortError') {
        toast.error('Не удалось поделиться ссылкой')
        console.error('Ошибка при шеринге:', err)
      }
    }
  }

  const copyToClipboard = async (shareUrl: string, postId: string) => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl)
        incrementShareCount(postId)
        toast.success('Ссылка скопирована в буфер обмена')
      } else {
        toast.error('Ваш браузер не поддерживает копирование в буфер обмена')
      }
    } catch (error) {
      toast.error('Не удалось скопировать ссылку')
      console.error('Ошибка при копировании:', error)
    }
  }

  return {
    handleShare,
    copyToClipboard,
    getShareUrl,
    isSharing,
    canNativeShare,
  }
}
