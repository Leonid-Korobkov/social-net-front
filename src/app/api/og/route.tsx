import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const title =
      searchParams.get('title') || 'Zling: Социальная сеть для своих'
    const type = searchParams.get('type') || 'default'
    const id = searchParams.get('id')

    // Загрузка шрифта
    let fontData
    try {
      fontData = await readFile(
        join(process.cwd(), 'assets/font/Rubik-SemiBold.ttf')
      )
    } catch (error) {
      try {
        fontData = await readFile(
          join(process.cwd(), 'public/assets/font/Rubik-SemiBold.ttf')
        )
      } catch (error) {
        console.error('Не удалось загрузить шрифт:', error)
        fontData = null
      }
    }

    if (type === 'profile' && id) {
      // Возвращаем изображение профиля пользователя
      return generateProfileImage(id, fontData)
    } else if (type === 'post' && id) {
      // Возвращаем изображение поста
      return generatePostImage(id, fontData)
    } else {
      // Возвращаем стандартное изображение
      return generateDefaultImage(title, fontData)
    }
  } catch (error) {
    console.error('Error generating image:', error)
    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 60,
            background: '#663399',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
          }}
        >
          Zling
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  }
}

async function generateDefaultImage(title: string, fontData: Buffer | null) {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 60,
          backgroundImage:
            'linear-gradient(to bottom, #9c66f6 0%, #663399 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          lineHeight: 1.2,
          textAlign: 'center',
          padding: 40,
        }}
      >
        <div style={{ fontSize: 80, fontWeight: 'bold', marginBottom: 20 }}>
          Zling
        </div>
        <div>{title}</div>
        <div
          style={{
            fontSize: 30,
            marginTop: 40,
            maxWidth: 800,
          }}
        >
          Современная социальная сеть для своих
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
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
}

// Импортируем API-клиент для получения данных пользователя
import { apiClient } from '@/services/ApiConfig'
import { User, Post } from '@/store/types'

async function generateProfileImage(id: string, fontData: Buffer | null) {
  try {
    const user = await apiClient<string, User>(`users/${id}`, {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN_FOR_REQ}`,
      },
    })

    if (!user) {
      throw new Error('User not found')
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
                  width: 200,
                  height: 200,
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
                    width={160}
                    height={160}
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
                    overflow: 'hidden',
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
                  {user.postCount || 0}
                </span>
                <span style={{ fontSize: 20 }}>публикаций</span>
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
                  {user.followers?.length || 0}
                </span>
                <span style={{ fontSize: 20 }}>подписчиков</span>
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
                  {user.following?.length || 0}
                </span>
                <span style={{ fontSize: 20 }}>подписок</span>
              </div>
            </div>
            <div
              style={{
                fontSize: 26,
                maxWidth: 800,
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
              }}
            >
              {user.bio && user.showBio
                ? user.bio.length > 100
                  ? `${user.bio.substring(0, 100)}...`
                  : user.bio
                : ' '}
            </div>

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
        width: 1200,
        height: 630,
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
    console.error('Error generating profile image:', error)
    return generateDefaultImage(`Профиль пользователя ${id}`, fontData)
  }
}

async function generatePostImage(id: string, fontData: Buffer | null) {
  try {
    const post = await apiClient<string, Post>(`posts/${id}`, {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN_FOR_REQ}`,
      },
    })

    if (!post) {
      throw new Error('Post not found')
    }

    // Обрезаем контент поста до 200 символов
    const truncatedContent =
      post.content.length > 200
        ? `${post.content.substring(0, 200)}...`
        : post.content

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
              padding: 40,
              width: '100%',
              height: '100%',
              justifyContent: 'space-between',
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              borderRadius: 20,
              border: '4px solid #663399',
              maxWidth: 1000,
              maxHeight: 550,
              margin: 'auto',
              position: 'relative',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                marginBottom: 30,
              }}
            >
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
                fontSize: 32,
                lineHeight: 1.4,
                flex: 1,
                overflow: 'hidden',
                padding: '20px 10px',
                backgroundColor: 'rgba(255, 255, 255, 0.5)',
                borderRadius: 15,
                border: '1px solid rgba(102, 51, 153, 0.2)',
              }}
            >
              {truncatedContent}
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: 30,
                width: '100%',
              }}
            >
              <div style={{ display: 'flex', gap: 30 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 12,
                      backgroundColor: '#F31260',
                    }}
                  />
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
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 12,
                      backgroundColor: '#2196f3',
                    }}
                  />
                  <span
                    style={{
                      display: 'flex',
                      fontSize: 24,
                    }}
                  >
                    {post.commentCount || 0}
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
        width: 1200,
        height: 630,
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
    console.error('Error generating post image:', error)
    return generateDefaultImage(`Пост ${id}`, fontData)
  }
}
