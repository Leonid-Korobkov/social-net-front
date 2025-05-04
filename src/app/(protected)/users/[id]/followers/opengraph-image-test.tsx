import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

import { apiClient } from '@/services/ApiConfig'
import { User } from '@/store/types'
import { FaUsers } from 'react-icons/fa6'

export const alt = 'Подписчики пользователя в Zling'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image({ params }: { params: { id: string } }) {
  try {
    const rubik = await readFile(
      join(process.cwd(), '/assets/font/Rubik-SemiBold.ttf')
    )

    const response = await apiClient<string, User>(`users/${params.id}`, {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN_FOR_REQ}`,
      },
    })
    const user = response

    if (!user) {
      return fallbackImage()
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
                    maxWidth: 650
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
                <span>{user.followers?.length || 0} подписчиков</span>
              </div>
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
        fonts: [
          {
            name: 'Rubik',
            data: rubik,
            style: 'normal',
            weight: 400,
          },
        ],
      }
    )
  } catch (error) {
    return fallbackImage()
  }
}

async function fallbackImage() {
  const rubik = await readFile(
    join(process.cwd(), '/assets/font/Rubik-SemiBold.ttf')
  )

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
        <div>Подписчики пользователя</div>
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
      fonts: [
        {
          name: 'Rubik',
          data: rubik,
          style: 'normal',
          weight: 400,
        },
      ],
    }
  )
}
