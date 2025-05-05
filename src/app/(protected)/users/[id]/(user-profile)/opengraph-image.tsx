import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

import { User } from '@/store/types'
import { apiClient } from '@/services/ApiConfig'
import { BsPostcardFill } from 'react-icons/bs'
import { FaUsers } from 'react-icons/fa6'
import { RiUserFollowFill } from 'react-icons/ri'

export const alt = 'Профиль пользователя Zling'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image({ params }: { params: { id: string } }) {
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
    const response = await apiClient<string, User>(`users/${params.id}`, {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN_FOR_REQ}`,
      },
    })
    const user = response

    if (!user) {
      return fallbackImage(fontData)
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
                <span
                  style={{
                    fontSize: 20,
                    display: 'flex',
                    gap: 10,
                    alignItems: 'center',
                  }}
                >
                  <BsPostcardFill />
                  публикаций
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
                  {user.followers?.length || 0}
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
                  подписчиков
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
                  {user.following?.length || 0}
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
                  подписок
                </span>
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
        <div style={{ fontSize: 80, fontWeight: 'bold', marginBottom: 20 }}>
          Zling
        </div>
        <div>Профиль пользователя</div>
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
