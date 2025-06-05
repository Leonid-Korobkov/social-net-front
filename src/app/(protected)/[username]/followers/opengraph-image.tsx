import { ImageResponse } from 'next/og'
import { User } from '@/store/types'
import { FaUsers } from 'react-icons/fa6'
import { pluralizeRu } from '@/utils/pluralizeRu'
import { fetchOpenGraphUserData } from '@/app/utils/opengraph-api'
import {
  DEFAULT_SIZE,
  DEFAULT_CONTENT_TYPE,
  loadFont,
  generateFallbackImage,
  handleApiError,
} from '@/app/utils/fallback-opengraph'

export const alt = 'Подписчики пользователя в Zling'
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
        title: 'Подписчики пользователя',
        subtitle: 'Современная социальная сеть для своих',
        fontData,
      })
    }

    // Создаем сетку аватаров подписчиков
    const followersGrid = Array.from({ length: 9 }, (_, index) => {
      const follower = user.followers?.[index]
      const avatarUrl = follower?.avatarUrl?.startsWith('http')
        ? follower.avatarUrl.replace('.webp', '.png')
        : null

      return (
        <div
          key={index}
          style={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            overflow: 'hidden',
            border: '2px solid white',
            backgroundColor: '#f5f5f5',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexShrink: 0,
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={follower?.name || 'Подписчик'}
              width={60}
              height={60}
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
                fontSize: 20,
                fontWeight: 'bold',
                color: '#663399',
                background: 'linear-gradient(45deg, #9c66f6, #663399)',
              }}
            >
              {String.fromCharCode(65 + index)}
            </div>
          )}
        </div>
      )
    })

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
                  }}
                >
                  Подписчики
                </h1>
                <h2
                  style={{
                    fontSize: 40,
                    margin: 0,
                    lineHeight: 1.2,
                  }}
                >
                  {user.name}
                </h2>
                <h3
                  style={{
                    fontSize: 30,
                    color: '#555555',
                    margin: 0,
                    lineHeight: 1,
                    maxWidth: 650,
                  }}
                >
                  @{user.userName}
                </h3>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                gap: 20,
                margin: '30px 0',
                alignItems: 'center',
                fontSize: 36,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  gap: 15,
                  backgroundColor: '#E5D4F5',
                  color: '#6120A0',
                  padding: '16px 30px',
                  borderRadius: 15,
                  fontWeight: 'bold',
                }}
              >
                <FaUsers />
                <span>
                  {user.stats.followers || 0}{' '}
                  {pluralizeRu(user.stats.followers || 0, [
                    'подписчик',
                    'подписчика',
                    'подписчиков',
                  ])}
                </span>
              </div>
            </div>

            {user.stats.followers && user.stats.followers > 0 && (
              <div
                style={{
                  display: 'flex',
                  gap: 15,
                  justifyContent: 'center',
                  marginTop: 20,
                  width: '100%',
                  maxWidth: 800,
                }}
              >
                {followersGrid}
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
    await handleApiError(error, `подписчиков пользователя ${params.username}`)

    // Пробуем использовать аватар пользователя как фолбэк
    try {
      const userData = await fetchOpenGraphUserData(params.username)
      if (userData?.avatarUrl) {
        return generateFallbackImage({
          title: 'Подписчики',
          subtitle: `${userData.name || 'Пользователь'} (@${
            userData.userName || params.username
          })`,
          fontData,
          avatarUrl: userData.avatarUrl,
        })
      }
    } catch (fallbackError) {
      console.error('Ошибка при попытке получить аватар:', fallbackError)
    }

    // Если не удалось получить аватар, используем стандартный фолбэк
    return generateFallbackImage({
      title: 'Подписчики пользователя',
      subtitle: 'Современная социальная сеть для своих',
      fontData,
    })
  }
}
