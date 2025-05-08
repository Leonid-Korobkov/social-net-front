import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

import { apiClient } from '@/services/ApiConfig'
import { Post } from '@/store/types'
import { FaComment, FaHeart } from 'react-icons/fa6'
import { stripHtml } from '@/app/utils/stripHtml'

export const alt = 'Пост в Zling'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image({ params }: { params: { id: string } }) {
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

  try {
    const response = await apiClient<string, Post>(`posts/${params.id}`, {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN_FOR_REQ}`,
      },
    })
    const post = response

    if (!post) {
      return fallbackImage(fontData)
    }

    // Парсим HTML-контент и преобразуем его в текст без тегов
    const cleanContent = stripHtml(post.content)

    // Обрезаем контент поста до 250 символов
    const truncatedContent =
      cleanContent.length > 200
        ? `${cleanContent.substring(0, 200)}...`
        : cleanContent

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
    return fallbackImage(fontData)
  }
}

async function fallbackImage(fontData: Buffer | null) {
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
        <div
          style={{
            fontSize: 80,
            fontWeight: 'bold',
            marginBottom: 20,
            display: 'flex',
          }}
        >
          Zling
        </div>
        <div style={{ display: 'flex' }}>Пост</div>
        <div
          style={{
            fontSize: 30,
            marginTop: 40,
            maxWidth: 800,
            display: 'flex',
          }}
        >
          Современная социальная сеть для своих
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
}
