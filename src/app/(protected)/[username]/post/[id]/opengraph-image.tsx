import { ImageResponse } from 'next/og'
import { Post } from '@/store/types'
import { FaComment, FaHeart } from 'react-icons/fa6'
import { stripHtml } from '@/utils/stripHtml'
import { FiShare } from 'react-icons/fi'
import { FaCalendarAlt } from 'react-icons/fa'
import { fetchOpenGraphPostData } from '@/app/utils/opengraph-api'
import {
  DEFAULT_SIZE,
  DEFAULT_CONTENT_TYPE,
  loadFont,
  generateFallbackImage,
  handleApiError,
} from '@/app/utils/fallback-opengraph'

export const alt = 'Пост в Zling'
export const size = DEFAULT_SIZE
export const contentType = DEFAULT_CONTENT_TYPE

// Функция для преобразования Cloudinary URL в JPG формат
function optimizeCloudinaryImage(
  imageUrl: string,
  width: number = 1000
): string {
  if (!imageUrl) return ''
  if (!imageUrl.includes('cloudinary.com')) return imageUrl

  const baseUrl = imageUrl.split('upload/')[0] + 'upload/'
  const imagePath = imageUrl.split('upload/')[1]
  const transforms = [
    'q_auto:best',
    'fl_progressive',
    `w_${width}`,
    'f_png',
    'fl_immutable_cache',
  ].join(',')

  return `${baseUrl}${transforms}/${imagePath}`
}

// Функция для форматирования даты
function formatDate(dateString: string | Date): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

export default async function Image({ params }: { params: { id: string } }) {
  const fontData = await loadFont()

  try {
    const post = await fetchOpenGraphPostData(params.id)

    if (!post) {
      return generateFallbackImage({
        title: 'Пост',
        subtitle: 'Современная социальная сеть для своих',
        fontData,
      })
    }

    // Парсим HTML-контент и преобразуем его в текст без тегов
    const cleanContent = stripHtml(post.content)

    // Обрезаем контент поста до 250 символов
    const truncatedContent =
      cleanContent.length > 200
        ? `${cleanContent.substring(0, 200)}...`
        : cleanContent

    // Проверяем, есть ли изображения в посте
    const hasImages = post.media && post.media.length > 0
    const formattedDate = formatDate(post.createdAt)

    // Подготовка контента в зависимости от наличия изображений
    let contentElement = null

    if (hasImages && post.media) {
      if (post.media.length > 1) {
        // Для нескольких изображений - показываем текст и галерею миниатюр
        contentElement = (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'flex' }}>{truncatedContent}</div>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 10,
                justifyContent: 'flex-start',
                maxHeight: 300,
                overflow: 'hidden',
              }}
            >
              {post.media.slice(0, 4).map((url: string, index: number) => (
                <div
                  key={index}
                  style={{
                    width: 200,
                    height: 200,
                    borderRadius: 10,
                    overflow: 'hidden',
                    flexShrink: 0,
                    display: 'flex',
                  }}
                >
                  <img
                    src={optimizeCloudinaryImage(url, 300)}
                    alt={`Изображение ${index + 1}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        )
      } else {
        // Для одного изображения - показываем текст и изображение рядом
        const imageUrl = optimizeCloudinaryImage(post.media[0], 1000)
        contentElement = (
          <div style={{ display: 'flex', flexDirection: 'row', gap: 20 }}>
            {truncatedContent.trim() !== '' && (
              <div
                style={{
                  width: 1000,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  fontSize: 32,
                  lineHeight: 1.4,
                }}
              >
                {truncatedContent}
              </div>
            )}
            <div
              style={{
                width: 250,
                height: 250,
                borderRadius: 10,
                overflow: 'hidden',
                alignSelf:
                  truncatedContent.trim() !== '' ? 'flex-end' : 'flex-start',
                display: 'flex',
              }}
            >
              <img
                src={imageUrl}
                alt="Изображение из поста"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: 10,
                }}
              />
            </div>
          </div>
        )
      }
    } else {
      // Без изображений - показываем только текст
      contentElement = (
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {truncatedContent}
        </div>
      )
    }

    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 40,
            background: 'linear-gradient(90deg, #f5f5f5 0%, #e0e0e0 100%)',
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          <div
            style={{
              display: 'flex',
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              backgroundImage:
                'linear-gradient(to bottom, #9c66f6 0%, #663399 100%)',
              opacity: 0.1,
            }}
          />
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: 30,
              width: '100%',
              height: '100%',
              justifyContent: 'space-between',
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              borderRadius: 20,
              border: '4px solid #663399',
              maxWidth: 1050,
              maxHeight: 550,
              margin: 'auto',
              position: 'relative',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 20,
                width: '100%',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 40,
                    overflow: 'hidden',
                    border: '3px solid white',
                    backgroundColor: '#f5f5f5',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  {post.author?.avatarUrl ? (
                    <img
                      src={post.author.avatarUrl.replace('.webp', '.png')}
                      alt={post.author.name}
                      width={80}
                      height={80}
                      style={{ objectFit: 'cover' }}
                    />
                  ) : (
                    <div
                      style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 36,
                        fontWeight: 'bold',
                        color: '#663399',
                      }}
                    >
                      {post.author?.name?.charAt(0) || '?'}
                    </div>
                  )}
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      fontSize: 30,
                      fontWeight: 'bold',
                    }}
                  >
                    {post.author?.name || 'Пользователь'}
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      fontSize: 24,
                      color: '#555',
                    }}
                  >
                    @{post.author?.userName || 'username'}
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: 22,
                  color: '#555',
                }}
              >
                <FaCalendarAlt style={{ height: 16, width: 16 }} />
                <span>{formattedDate}</span>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                fontSize: 32,
                lineHeight: 1.4,
                flex: 1,
                overflow: 'hidden',
              }}
            >
              {contentElement}
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: 15,
                width: '100%',
              }}
            >
              <div style={{ display: 'flex', gap: 30 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <FaHeart color="#F31260" />
                  <span
                    style={{
                      display: 'flex',
                      fontSize: 24,
                    }}
                  >
                    {post.likeCount || 0}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <FaComment color="#2196f3" />
                  <span
                    style={{
                      display: 'flex',
                      fontSize: 24,
                    }}
                  >
                    {post.commentCount || 0}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <FiShare color="#663399" />
                  <span
                    style={{
                      display: 'flex',
                      fontSize: 24,
                    }}
                  >
                    {post.shareCount || 0}
                  </span>
                </div>
              </div>

              <div
                style={{
                  fontSize: 20,
                  color: '#663399',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <img
                  src={
                    'https://res.cloudinary.com/djsmqdror/image/upload/v1746368138/social-net/uycc5eujwb3jvsfgnuac.png'
                  }
                  width={100}
                  alt={'Zling логотип'}
                  style={{ objectFit: 'cover' }}
                />
              </div>
            </div>
          </div>
        </div>
      ),
      {
        ...size,
        fonts: fontData
          ? [
              {
                name: 'Rubik',
                data: fontData,
                style: 'normal',
                weight: 600,
              },
            ]
          : undefined,
      }
    )
  } catch (error) {
    await handleApiError(error, `поста ${params.id}`)

    // Пробуем использовать первое изображение из поста как фолбэк
    try {
      const postData = await fetchOpenGraphPostData(params.id)
      if (postData?.media?.[0]) {
        const cleanContent = stripHtml(postData.content || '')
        return generateFallbackImage({
          title: postData.author?.name || 'Пост',
          subtitle:
            cleanContent.substring(0, 100) +
            (cleanContent.length > 100 ? '...' : ''),
          fontData,
          avatarUrl: postData.media[0],
        })
      }
    } catch (fallbackError) {
      console.error(
        'Ошибка при попытке получить изображение поста:',
        fallbackError
      )
    }

    // Если не удалось получить изображение поста, используем стандартный фолбэк
    return generateFallbackImage({
      title: 'Пост',
      subtitle: 'Современная социальная сеть для своих',
      fontData,
    })
  }
}
