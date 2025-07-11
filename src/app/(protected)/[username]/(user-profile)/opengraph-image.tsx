import { ImageResponse } from 'next/og'
import { BsPostcardFill } from 'react-icons/bs'
import { FaUsers } from 'react-icons/fa6'
import { RiUserFollowFill } from 'react-icons/ri'
import { pluralizeRu } from '@/utils/pluralizeRu'
import { stripHtml } from '@/utils/stripHtml'
import { fetchOpenGraphUserData } from '@/app/utils/opengraph-api'
import {
  DEFAULT_SIZE,
  DEFAULT_CONTENT_TYPE,
  loadFont,
  generateFallbackImage,
  handleApiError,
} from '@/app/utils/fallback-opengraph'

export const alt = 'Профиль пользователя Zling'
export const size = DEFAULT_SIZE
export const contentType = DEFAULT_CONTENT_TYPE

export default async function Image({
  params,
}: {
  params: { username: string }
}) {
  const fontData = await loadFont()

  try {
    const user = await fetchOpenGraphUserData(params.username)

    if (!user) {
      return generateFallbackImage({
        title: 'Профиль пользователя',
        subtitle: 'Современная социальная сеть для своих',
        fontData,
      })
    }

    // Очищаем bio от HTML если это необходимо
    const cleanBio = user.bio && user.showBio ? stripHtml(user.bio) : ''

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
              padding: 40,
              width: '100%',
              height: '100%',
              justifyContent: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              borderRadius: 20,
              border: '4px solid #663399',
              maxWidth: 1000,
              maxHeight: 550,
              margin: 'auto',
              position: 'relative',
              zIndex: 1,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 30,
                marginBottom: 30,
              }}
            >
              <div
                style={{
                  width: 250,
                  height: 250,
                  borderRadius: '0.75rem',
                  overflow: 'hidden',
                  border: '5px solid white',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#f5f5f5',
                }}
              >
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl.replace('.webp', '.png')}
                    alt={user.name}
                    width={240}
                    height={240}
                    style={{ objectFit: 'cover', borderRadius: '0.75rem' }}
                  />
                ) : (
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 70,
                      fontWeight: 'bold',
                      color: '#663399',
                    }}
                  >
                    {user.name?.charAt(0) || '?'}
                  </div>
                )}
              </div>

              <div
                style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
              >
                <h1
                  style={{
                    fontSize: 60,
                    fontWeight: 'bold',
                    margin: 0,
                    lineHeight: 1,
                    width: 650,
                    color: '#6120A0',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {user.name}
                </h1>
                <h2
                  style={{
                    fontSize: 30,
                    color: '#555555',
                    margin: 0,
                    lineHeight: 1,
                  }}
                >
                  @{user.userName}
                </h2>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                gap: 20,
                marginBottom: 30,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#E5D4F5',
                  color: '#6120A0',
                  padding: '12px 24px',
                  borderRadius: 15,
                }}
              >
                <span style={{ fontSize: 40, fontWeight: 'bold' }}>
                  {user.stats.posts || 0}
                </span>
                <span
                  style={{
                    fontSize: 20,
                    display: 'flex',
                    gap: 10,
                    alignItems: 'center',
                  }}
                >
                  <BsPostcardFill />
                  {pluralizeRu(user.stats.posts || 0, [
                    'публикация',
                    'публикации',
                    'публикаций',
                  ])}
                </span>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  backgroundColor: '#E5D4F5',
                  color: '#6120A0',
                  padding: '12px 24px',
                  borderRadius: 15,
                }}
              >
                <span style={{ fontSize: 40, fontWeight: 'bold' }}>
                  {user.stats.followers || 0}
                </span>
                <span
                  style={{
                    fontSize: 20,
                    display: 'flex',
                    gap: 10,
                    alignItems: 'center',
                  }}
                >
                  <FaUsers />
                  {pluralizeRu(user.stats.followers || 0, [
                    'подписчик',
                    'подписчика',
                    'подписчиков',
                  ])}
                </span>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  color: '#6120A0',
                  backgroundColor: '#E5D4F5',
                  padding: '12px 24px',
                  borderRadius: 15,
                }}
              >
                <span style={{ fontSize: 40, fontWeight: 'bold' }}>
                  {user.stats.following || 0}
                </span>
                <span
                  style={{
                    fontSize: 20,
                    display: 'flex',
                    gap: 10,
                    alignItems: 'center',
                  }}
                >
                  <RiUserFollowFill />
                  {pluralizeRu(user.stats.following || 0, [
                    'подписка',
                    'подписки',
                    'подписок',
                  ])}
                </span>
              </div>
            </div>
            {cleanBio && (
              <div
                style={{
                  fontSize: 26,
                  maxWidth: 800,
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  color: '#333333',
                }}
              >
                {cleanBio.length > 100
                  ? `${cleanBio.substring(0, 100)}...`
                  : cleanBio}
              </div>
            )}
            <div
              style={{
                display: 'flex',
                position: 'absolute',
                bottom: 20,
                right: 30,
                fontSize: 20,
                color: '#663399',
                fontWeight: 'bold',
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
    await handleApiError(error, `профиля пользователя ${params.username}`)

    // Пробуем использовать аватар пользователя как фолбэк
    try {
      const userData = await fetchOpenGraphUserData(params.username)
      if (userData?.avatarUrl) {
        return generateFallbackImage({
          title: userData.name || 'Профиль пользователя',
          subtitle: `@${userData.userName || params.username}`,
          fontData,
          avatarUrl: userData.avatarUrl,
        })
      }
    } catch (fallbackError) {
      console.error('Ошибка при попытке получить аватар:', fallbackError)
    }

    // Если не удалось получить аватар, используем стандартный фолбэк
    return generateFallbackImage({
      title: 'Профиль пользователя',
      subtitle: 'Современная социальная сеть для своих',
      fontData,
    })
  }
}
