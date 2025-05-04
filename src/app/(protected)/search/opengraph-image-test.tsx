import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { IoSearch } from 'react-icons/io5'

export const alt = 'Поиск в Zling'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  try {
    const rubik = await readFile(
      join(process.cwd(), '/assets/font/Rubik-SemiBold.ttf')
    )

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
              alignItems: 'center',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 80,
                fontWeight: 'bold',
                gap: 30,
                marginBottom: 30,
                color: '#663399',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <IoSearch />
                <span style={{ marginLeft: 20 }}>Поиск</span>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                width: '80%',
                height: 80,
                backgroundColor: 'white',
                borderRadius: 12,
                border: '2px solid #663399',
                padding: '0 20px',
                fontSize: 30,
                color: '#777',
                alignItems: 'center',
                marginBottom: 40,
              }}
            >
              Найдите пользователей и посты...
            </div>

            <div
              style={{
                display: 'flex',
                gap: 30,
                justifyContent: 'center',
                marginTop: 20,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  backgroundColor: '#E5D4F5',
                  padding: '20px 20px',
                  borderRadius: 15,
                  width: 250,
                }}
              >
                <div
                  style={{
                    fontSize: 24,
                    fontWeight: 'bold',
                    color: '#663399',
                    marginBottom: 10,
                  }}
                >
                  Посты
                </div>
                <div
                  style={{
                    fontSize: 18,
                    color: '#555',
                  }}
                >
                  Ищите интересные публикации
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  backgroundColor: '#E5D4F5',
                  padding: '20px 20px',
                  borderRadius: 15,
                  width: 250,
                }}
              >
                <div
                  style={{
                    fontSize: 24,
                    fontWeight: 'bold',
                    color: '#663399',
                    marginBottom: 10,
                  }}
                >
                  Пользователи
                </div>
                <div
                  style={{
                    fontSize: 18,
                    color: '#555',
                  }}
                >
                  Находите новых друзей
                </div>
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
        <div>Поиск</div>
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
